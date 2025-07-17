<template>
  <div class="container mx-auto py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Edit Product</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="navigateTo(`/products/${productId}`)">
          Cancel
        </Button>
        <Button @click="saveProduct" :disabled="isSaving">
          <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
          Save Changes
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Basic Information -->
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input id="name" v-model="productForm.name" required />
            </div>

            <div class="space-y-2">
              <Label for="sku">SKU</Label>
              <Input id="sku" v-model="productForm.sku" required />
            </div>

            <div class="space-y-2">
              <Label for="price">Price</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                v-model="productForm.price" 
                required 
              />
            </div>

            <div class="space-y-2">
              <Label for="cost">Cost</Label>
              <Input 
                id="cost" 
                type="number" 
                step="0.01" 
                v-model="productForm.cost" 
                required 
              />
            </div>

            <div class="space-y-2">
              <Label for="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number" 
                v-model="productForm.quantity" 
                required 
              />
            </div>

            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea id="description" v-model="productForm.description" />
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Variants -->
      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
          <CardDescription>
            Manage product variants and their inheritance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <!-- Variants List -->
            <div v-if="variants.length > 0" class="space-y-4">
              <div v-for="variant in variants" :key="variant.id" class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-medium">{{ variant.name }}</h3>
                    <p class="text-sm text-muted-foreground">{{ variant.productNumber }}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" class="h-8 w-8 p-0">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="editVariant(variant)">
                        <Pencil class="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="viewInheritance(variant)">
                        <GitBranch class="mr-2 h-4 w-4" />
                        View Inheritance
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="deleteVariant(variant)">
                        <Trash2 class="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-muted-foreground">Price:</span>
                    <span class="ml-2">{{ formatPrice(variant.price) }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Cost:</span>
                    <span class="ml-2">{{ formatPrice(variant.cost) }}</span>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Quantity:</span>
                    <span class="ml-2">{{ variant.quantity }}</span>
                  </div>
                </div>

                <div class="mt-2">
                  <div class="flex gap-2">
                    <Badge 
                      v-for="field in INHERITABLE_FIELDS" 
                      :key="field"
                      :variant="isFieldInherited(variant, field) ? 'default' : 'secondary'"
                      class="cursor-pointer"
                      @click="toggleInheritance(variant, field)"
                    >
                      {{ field }}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-muted-foreground">
              No variants created yet
            </div>

            <Button @click="showGenerateDialog = true" class="w-full">
              <Plus class="mr-2 h-4 w-4" />
              Generate Variants
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Generate Variants Dialog -->
    <Dialog :open="showGenerateDialog" @update:open="showGenerateDialog = $event">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Variants</DialogTitle>
          <DialogDescription>
            Select properties and values to generate variants
          </DialogDescription>
        </DialogHeader>
        
        <div class="space-y-4">
          <!-- Property Selection -->
          <div v-for="property in properties" :key="property.id" class="space-y-2">
            <Label>{{ property.name }}</Label>
            <Select v-model="selectedProperties[property.id]">
              <SelectTrigger>
                <SelectValue placeholder="Select values" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem 
                  v-for="value in property.values" 
                  :key="value.id"
                  :value="value.id"
                >
                  {{ value.displayName || value.value }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Field Inheritance -->
          <div class="space-y-2">
            <Label>Field Inheritance</Label>
            <div class="grid grid-cols-3 gap-4">
              <div v-for="field in INHERITABLE_FIELDS" :key="field" class="flex items-center space-x-2">
                <Checkbox 
                  v-model="fieldInheritance[field]" 
                  :id="field"
                />
                <Label :for="field" class="capitalize">{{ field }}</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showGenerateDialog = false">
            Cancel
          </Button>
          <Button @click="generateVariants" :disabled="isGenerating">
            <Loader2 v-if="isGenerating" class="mr-2 h-4 w-4 animate-spin" />
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Inheritance Info Dialog -->
    <Dialog :open="showInheritanceDialog" @update:open="showInheritanceDialog = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inheritance Information</DialogTitle>
          <DialogDescription>
            View inheritance details for {{ selectedVariant?.productNumber }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <div v-for="field in INHERITABLE_FIELDS" :key="field" class="space-y-2">
            <Label class="capitalize">{{ field }}</Label>
            <div class="flex items-center space-x-2">
              <Badge :variant="selectedVariant?.inheritanceInfo[field].isInherited ? 'default' : 'secondary'">
                {{ selectedVariant?.inheritanceInfo[field].isInherited ? 'Inherited' : 'Local' }}
              </Badge>
              <span class="text-sm text-muted-foreground">
                {{ formatValue(field, selectedVariant?.inheritanceInfo[field].localValue) }}
              </span>
            </div>
            <div v-if="selectedVariant?.inheritanceInfo[field].isInherited" class="text-sm text-muted-foreground">
              Inherited from parent: {{ formatValue(field, selectedVariant?.inheritanceInfo[field].parentValue) }}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button @click="showInheritanceDialog = false">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, GitBranch } from 'lucide-vue-next';
import { INHERITABLE_FIELDS } from '~/server/database/schema/product-variants.schema';
import type { ProductVariant, InheritableField } from '~/server/database/schema/product-variants.schema';
import type { ProductProperty } from '~/server/database/schema/product-properties.schema';
import type { Product } from '~/server/database/schema/products.schema';

const route = useRoute();
const router = useRouter();
const productId = route.params.id as string;

// State
const product = ref<Product | null>(null);
const variants = ref<ProductVariant[]>([]);
const properties = ref<ProductProperty[]>([]);
const showGenerateDialog = ref(false);
const showInheritanceDialog = ref(false);
const isSaving = ref(false);
const isGenerating = ref(false);
const selectedVariant = ref<ProductVariant | null>(null);
const selectedProperties = ref<Record<string, string>>({});
const fieldInheritance = ref<Record<InheritableField, boolean>>({
  name: true,
  price: true,
  cost: true
});

const productForm = ref<Partial<Product>>({
  name: '',
  sku: '',
  price: 0,
  cost: 0,
  quantity: 0,
  description: ''
});

// Fetch data
async function fetchProduct() {
  try {
    const response = await $fetch(`/api/products/${productId}`);
    if (response.status === 200) {
      product.value = response.data;
      productForm.value = { ...response.data };
    }
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }
}

async function fetchVariants() {
  try {
    const response = await $fetch(`/api/products/${productId}/variants`);
    variants.value = response.data;
  } catch (error) {
    console.error('Failed to fetch variants:', error);
  }
}

async function fetchProperties() {
  try {
    const response = await $fetch('/api/product-properties');
    properties.value = response.data;
    
    // Initialize selected properties
    properties.value.forEach(property => {
      selectedProperties.value[property.id] = '';
    });
  } catch (error) {
    console.error('Failed to fetch properties:', error);
  }
}

// Product management
async function saveProduct() {
  if (!productId) return;
  
  isSaving.value = true;
  try {
    const response = await $fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: productForm.value
    });
    
    if (response.status === 200) {
      await fetchProduct();
      await fetchVariants();
    }
  } catch (error) {
    console.error('Failed to save product:', error);
  } finally {
    isSaving.value = false;
  }
}

// Variant management
async function generateVariants() {
  if (!productId) return;
  
  isGenerating.value = true;
  try {
    const propertyIds = Object.keys(selectedProperties.value);
    const selectedValueIds = Object.entries(selectedProperties.value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: [value] }), {});
      
    const response = await $fetch('/api/product-variants/generate', {
      method: 'POST',
      body: {
        productId,
        propertyIds,
        selectedValueIds,
        fieldInheritance: fieldInheritance.value
      }
    });
    
    if (response.status === 201) {
      await fetchVariants();
      showGenerateDialog.value = false;
    }
  } catch (error) {
    console.error('Failed to generate variants:', error);
  } finally {
    isGenerating.value = false;
  }
}

async function deleteVariant(variant: ProductVariant) {
  if (!confirm('Are you sure you want to delete this variant?')) return;
  
  try {
    const response = await $fetch(`/api/product-variants/${variant.id}`, {
      method: 'DELETE'
    });
    
    if (response.status === 200) {
      await fetchVariants();
    }
  } catch (error) {
    console.error('Failed to delete variant:', error);
  }
}

// Inheritance management
function isFieldInherited(variant: ProductVariant, field: InheritableField): boolean {
  return variant.inheritedFields?.includes(field) ?? false;
}

async function toggleInheritance(variant: ProductVariant, field: InheritableField) {
  try {
    const isCurrentlyInherited = isFieldInherited(variant, field);
    const response = await $fetch('/api/product-variants/inheritance', {
      method: 'POST',
      body: {
        variantId: variant.id,
        field,
        inherit: !isCurrentlyInherited
      }
    });
    
    if (response.status === 200) {
      await fetchVariants();
    }
  } catch (error) {
    console.error('Failed to toggle inheritance:', error);
  }
}

function viewInheritance(variant: ProductVariant) {
  selectedVariant.value = variant;
  showInheritanceDialog.value = true;
}

// Utility functions
function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function formatValue(field: InheritableField, value: any): string {
  if (value === null || value === undefined) return '-';
  
  if (field === 'price' || field === 'cost') {
    return formatPrice(value);
  }
  
  return String(value);
}

// Lifecycle
onMounted(() => {
  fetchProduct();
  fetchVariants();
  fetchProperties();
});
</script> 