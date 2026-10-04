'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React from 'react';

const components = {
  SignIn: {
    Footer() {
      // Return an empty footer or custom elements without the "Forgot your password?" button
      return <div className="text-red-500">Hello Wherely!</div>;
    },
  },
};

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authenticator components={components} hideSignUp>
      {children}
    </Authenticator>
  );
}
