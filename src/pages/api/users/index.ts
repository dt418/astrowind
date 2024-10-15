import type { APIRoute } from 'astro';
import { db } from '~/db';
import { users } from '~/db/schema';

export const prerender = false;
export const GET: APIRoute = async () => {
  try {
    const allUsers = await db.select().from(users);

    console.log('Fetched users:', allUsers.length);

    return new Response(JSON.stringify({ users: allUsers }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
