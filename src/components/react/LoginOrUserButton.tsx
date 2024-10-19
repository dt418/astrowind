import { Suspense } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/astro/react';

const DefaultAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
    <span className="text-gray-600">?</span>
  </div>
);

export default function LoginOrUserButton() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl={'/admin'} />
      </SignedOut>
      <SignedIn>
        <Suspense fallback={<DefaultAvatar />}>
          <UserButton />
        </Suspense>
      </SignedIn>
    </>
  );
}
