import { productVariants, productPropertyAssociations, propertyValues, variantPropertyValues } from '../../database/schema';
import { products } from '../../database/schema/products.schema';
import { INHERITABLE_FIELDS, InheritableField } from '../../database/schema/product-variants.schema';
import { eq, and } from 'drizzle-orm';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';
import { v4 as uuidv4 } from 'uuid';
import { generateProductNumber } from '../../utils/product-number';
import { applyInheritance } from '../../utils/product-inheritance';

interface GenerateVariantsRequest {
  productId: string;
  propertyIds: string[];
  selectedValueIds: Record<string, string[]>;
  fieldInheritance?: Partial<Record<InheritableField, boolean>>;
}

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event) as GenerateVariantsRequest;
  
  // Validate product exists
  const product = await db.select()
    .from(products)
    .where(eq(products.id, body.productId))
    .limit(1);
    
  if (product.length === 0) {
    return new ResponseBody(404, 'Product not found');
  }
  
  // Validate all properties exist and are associated with the product
  const propertyAssociations = await db.select()
    .from(productPropertyAssociations)
    .where(and(
      eq(productPropertyAssociations.productId, body.productId),
      eq(productPropertyAssociations.propertyId, body.propertyIds[0]) // Check first property
    ));
    
  if (propertyAssociations.length === 0) {
    return new ResponseBody(400, 'Property is not associated with this product');
  }
  
  // Get all selected values for each property
  const propertyValuesMap = new Map<string, string[]>();
  
  // Fetch property value data for display names
  const valueData = new Map<string, { value: string, displayName: string }>();
  
  for (const [propertyId, valueIds] of Object.entries(body.selectedValueIds)) {
    // Fetch all values for this property
    const values = await db.select()
      .from(propertyValues)
      .where(eq(propertyValues.propertyId, propertyId));
      
    if (values.length === 0) {
      return new ResponseBody(400, `No values found for property ${propertyId}`);
    }
    
    // Check each selected value exists
    const validValueIds = values
      .filter(v => valueIds.includes(v.id))
      .map(v => {
        valueData.set(v.id, { 
          value: v.value, 
          displayName: v.displayName || v.value 
        });
        return v.id;
      });
      
    if (validValueIds.length === 0) {
      return new ResponseBody(400, `Invalid values for property ${propertyId}`);
    }
    
    propertyValuesMap.set(propertyId, validValueIds);
  }
  
  // Generate variants using cartesian product
  const variants = generateVariants(body.propertyIds, propertyValuesMap, valueData);
  
  // Determine which fields to inherit
  let inheritedFields: InheritableField[] = [...INHERITABLE_FIELDS];
  
  // If fieldInheritance is provided, use it to determine which fields to inherit
  if (body.fieldInheritance) {
    inheritedFields = INHERITABLE_FIELDS.filter((field: InheritableField) => 
      body.fieldInheritance && body.fieldInheritance[field] !== false
    );
  }
  
  // Create variants in database
  const createdVariants = [];
  for (const variant of variants) {
    const variantId = uuidv4();
    const productNumber = await generateProductNumber('V');
    
    // Create variant with null values for inherited fields
    const variantData: Record<string, any> = {
      id: variantId,
      productId: body.productId,
      productNumber,
      quantity: 0,
      attributes: variant.reduce((acc, v) => ({ ...acc, [v.propertyId]: v.value }), {}),
      inheritedFields
    };
    
    // Only set values for fields that are not inherited
    for (const field of INHERITABLE_FIELDS) {
      if (!inheritedFields.includes(field)) {
        // For non-inherited fields, set explicit values
        if (field === 'name') {
          variantData.name = `${product[0].name} - ${variant.map(v => v.displayName).join(' / ')}`;
        } else if (field === 'price') {
          variantData.price = product[0].price;
        } else if (field === 'cost') {
          variantData.cost = product[0].cost;
        }
      }
    }
    
    // Create variant
    await db.insert(productVariants)
      .values(variantData);
      
    // Create variant property values
    for (const value of variant) {
      await db.insert(variantPropertyValues)
        .values({
          id: uuidv4(),
          variantId,
          propertyId: value.propertyId,
          valueId: value.id,
          isLinked: true
        });
    }
    
    // Get created variant with inheritance applied
    const createdVariant = await db.select()
      .from(productVariants)
      .where(eq(productVariants.id, variantId))
      .limit(1)
      .then(rows => rows[0]);
      
    if (createdVariant) {
      // Apply inheritance to get full variant data
      const variantWithInheritance = await applyInheritance(createdVariant);
      
      createdVariants.push({
        ...variantWithInheritance,
        propertyValues: variant,
        inheritedFields
      });
    }
  }
  
  return new ResponseBody(201, undefined, createdVariants);
}, {
  validateBody: (body) => {
    return body && 
           typeof body.productId === 'string' && 
           Array.isArray(body.propertyIds) &&
           typeof body.selectedValueIds === 'object';
  },
  logRequest: true,
  logResponse: true,
  logError: true,
  rateLimit: {
    max: 10,
    windowMs: 60000
  }
});

interface VariantValue {
  propertyId: string;
  id: string;
  value: string;
  displayName: string;
}

function generateVariants(
  propertyIds: string[],
  propertyValuesMap: Map<string, string[]>,
  valueData: Map<string, { value: string, displayName: string }>
): VariantValue[][] {
  const result: VariantValue[][] = [];
  
  function generate(current: VariantValue[], index: number) {
    if (index === propertyIds.length) {
      result.push([...current]);
      return;
    }
    
    const propertyId = propertyIds[index];
    const valueIds = propertyValuesMap.get(propertyId) || [];
    
    for (const valueId of valueIds) {
      const data = valueData.get(valueId);
      current.push({
        propertyId,
        id: valueId,
        value: data?.value || '',
        displayName: data?.displayName || ''
      });
      generate(current, index + 1);
      current.pop();
    }
  }
  
  generate([], 0);
  return result;
} 