import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  description: z.string().optional(),
  category: z.string().optional(),
  inStock: z.boolean().optional(),
});

export const orderSchema = z.object({
  userId: z.number().positive(),
  total: z.number().positive(),
});
