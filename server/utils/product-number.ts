import { eq } from 'drizzle-orm';
import { useDrizzle } from './drizzle';
import { productNumberSequence } from '../database/schema/product-variants.schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a new product number from a sequence.
 * Creates the sequence if it doesn't exist.
 * 
 * @param prefix The prefix to use for the product number (e.g. 'P' for products, 'V' for variants)
 * @returns A new unique product number
 */
export async function generateProductNumber(prefix: string = 'P'): Promise<string> {
  const db = useDrizzle();
  
  // Find or create sequence
  let sequence = await db.select()
    .from(productNumberSequence)
    .where(eq(productNumberSequence.prefix, prefix))
    .limit(1)
    .then(rows => rows[0]);
  
  if (!sequence) {
    // Create new sequence
    await db.insert(productNumberSequence)
      .values({
        id: uuidv4(),
        prefix,
        lastNumber: 0
      });
    
    sequence = {
      id: uuidv4(),
      prefix,
      lastNumber: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };
  }
  
  // Increment the sequence
  const nextNumber = sequence.lastNumber + 1;
  
  // Update the sequence
  await db.update(productNumberSequence)
    .set({ lastNumber: nextNumber })
    .where(eq(productNumberSequence.id, sequence.id));
  
  // Format the number with leading zeros (6 digits)
  const formattedNumber = nextNumber.toString().padStart(6, '0');
  
  // Return the formatted product number
  return `${prefix}${formattedNumber}`;
} 