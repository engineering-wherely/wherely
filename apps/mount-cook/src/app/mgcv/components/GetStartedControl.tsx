'use client';

import { usePersonalDetails } from '@/app/mgcv/hooks/usePersonalDetails';
import {
  GetStartedControl as NPWGetStartedControl,
  type GetStartedControlProps as NPWGetStartedControlProps,
} from 'np-westland';

type GetStartedControlProps = Omit<
  NPWGetStartedControlProps,
  'firstName' | 'lastName'
>;

export default function GetStartedControl(props: GetStartedControlProps) {
  const { data: personalDetails } = usePersonalDetails();

  if (!personalDetails) {
    return null;
  }

  return (
    <NPWGetStartedControl
      {...props}
      firstName={personalDetails.firstName}
      lastName={personalDetails.lastName}
    />
  );
}
