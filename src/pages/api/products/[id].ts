import type { APIRoute } from 'astro';
import { db } from '~/db';
import { products } from '~/db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;
export const GET: APIRoute = async ({ params }) => {
  try {
    const productId = parseInt(params.id as string, 10);

    if (isNaN(productId)) {
      return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);

    if (product.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ product: product[0] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
