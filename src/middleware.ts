import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

export const prerender = false;
const isProtectedRoute = createRouteMatcher(['/admin(.*)']);

export const onRequest = clerkMiddleware((auth, context) => {
  const { redirectToSignIn, userId } = auth();

  if (!userId && isProtectedRoute(context.request)) {
    // Add custom logic to run before redirecting

    return redirectToSignIn();
  }
});
