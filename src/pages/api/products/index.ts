import type { APIRoute } from 'astro';
import { db } from '~/db';
import { products } from '~/db/schema';

export const prerender = false;
export const GET: APIRoute = async () => {
  try {
    const allProducts = await db.select().from(products);

    console.log('Fetched products:', allProducts.length);

    return new Response(JSON.stringify({ products: allProducts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
