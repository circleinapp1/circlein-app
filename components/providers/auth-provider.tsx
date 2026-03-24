'use client';

import { ReactNode, createContext, useContext } from 'react';

// Mock session for preview
const mockSession = {
  user: {
    id: 'preview-user',
    name: 'Preview User',
    email: 'preview@circlein.app',
    image: null,
    role: 'resident',
    propertyId: 'preview-property',
  },
  expires: '2099-12-31T23:59:59.999Z',
};

// Create a mock session context
const MockSessionContext = createContext<{ data: typeof mockSession; status: 'authenticated' }>({
  data: mockSession,
  status: 'authenticated',
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // BYPASS: Return children directly without NextAuth SessionProvider
  return (
    <MockSessionContext.Provider value={{ data: mockSession, status: 'authenticated' }}>
      {children}
    </MockSessionContext.Provider>
  );
}

// Export mock hook for components that use useSession
export function useMockSession() {
  return useContext(MockSessionContext);
}
