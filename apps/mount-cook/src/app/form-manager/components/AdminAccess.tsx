'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { useQuery } from '@tanstack/react-query';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

const AdminContext = createContext(false);
export const useAdminAccess = () => useContext(AdminContext);

export default function AdminAccess({ children }: { children: ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const session = useQuery({
    queryKey: ['form-manager', 'admin-session'],
    queryFn: async () => {
      if (!Amplify.getConfig().Auth?.Cognito) {
        return { configured: false, signedIn: false, admin: false };
      }
      const { tokens } = await fetchAuthSession();
      const groups = tokens?.accessToken.payload['cognito:groups'];
      return {
        configured: true,
        signedIn: !!tokens,
        admin: Array.isArray(groups) && groups.includes('Administrators'),
      };
    },
    retry: false,
  });
  const { refetch } = session;
  useEffect(
    () =>
      Hub.listen('auth', () => {
        void refetch();
      }),
    [refetch]
  );
  const admin = session.data?.admin === true && !session.isError;
  return (
    <AdminContext.Provider value={admin}>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-white px-6 py-2 text-xs text-slate-500">
        <span>
          {session.isPending
            ? 'Checking editing access…'
            : session.isError
              ? 'Unable to check editing access.'
              : admin
                ? 'Administrator · Editing enabled'
                : session.data?.configured
                  ? 'Only administrators can save changes.'
                  : 'Administrator sign-in is not configured yet.'}
        </span>
        {session.isError ? (
          <button
            onClick={() => {
              void session.refetch();
            }}
          >
            Retry
          </button>
        ) : session.data?.signedIn ? (
          <button
            onClick={() => {
              void signOut().catch(() => {
                void session.refetch();
              });
            }}
          >
            Sign out
          </button>
        ) : (
          session.data?.configured && (
            <button
              onClick={() => {
                setShowLogin(!showLogin);
              }}
            >
              {showLogin ? 'Close sign-in' : 'Administrator sign-in'}
            </button>
          )
        )}
      </div>
      {showLogin && !session.data?.signedIn && (
        <div className="max-h-[70vh] overflow-auto border-b bg-white p-4">
          <Authenticator hideSignUp />
        </div>
      )}
      {children}
    </AdminContext.Provider>
  );
}
