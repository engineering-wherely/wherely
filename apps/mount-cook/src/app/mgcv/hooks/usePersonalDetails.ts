'use client';

import { useFormInputNodes } from '@/app/mgcv/hooks/useFormInputNodes';
import type { Nullable, PersonalDetails } from 'np-westland/types';

export function usePersonalDetails() {
  const result = useFormInputNodes(8);
  const firstInput = result.data?.[0];
  const fieldValue = (fieldId: number) =>
    firstInput?.fieldInputs.find((input) => input.fieldId === fieldId)?.value ??
    '';
  const data: Nullable<PersonalDetails> = firstInput
    ? {
        firstName: fieldValue(11),
        lastName: fieldValue(12),
        professionalTitle: fieldValue(17),
        location: fieldValue(13),
        emailAddress: fieldValue(15),
        linkedInUrl: fieldValue(18),
        rightToWork: fieldValue(16),
      }
    : null;

  return { ...result, data };
}
