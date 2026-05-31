'use client';

import { Amplify } from 'aws-amplify';

import outputs from 'lake-pukaki/amplify_outputs.json';

Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
