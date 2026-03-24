'use client';

import { ReactNode } from 'react';

/**
 * Wrapper component that synchronizes NextAuth with Firebase Auth
 * BYPASSED for development preview
 */
export function FirebaseAuthSync({ children }: { children: ReactNode }) {
  // BYPASS: Disabled Firebase auth for preview
  return <>{children}</>;
}
