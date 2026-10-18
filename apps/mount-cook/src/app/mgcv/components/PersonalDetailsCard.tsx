'use client';

import { usePersonalDetails } from '@/app/mgcv/hooks/usePersonalDetails';
import {
  PersonalDetailsCard as NPWPersonalDetailsCard,
  type PersonalDetailsCardProps as NPWPersonalDetailsCardProps,
} from 'np-westland';

type PersonalDetailsCardProps = Omit<NPWPersonalDetailsCardProps, 'details'>;

export default function PersonalDetailsCard(props: PersonalDetailsCardProps) {
  const { data: personalDetails } = usePersonalDetails();

  if (!personalDetails) {
    return null;
  }

  return <NPWPersonalDetailsCard {...props} details={personalDetails} />;
}
