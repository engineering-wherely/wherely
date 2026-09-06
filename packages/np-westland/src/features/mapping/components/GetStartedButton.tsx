import { cn } from '@/shadcn-ui/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

export type GetStartedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  firstName: string;
  lastName: string;
};

function getInitial(value: string) {
  return Array.from(value.trim()).at(0)?.toLocaleUpperCase() ?? '';
}

export function GetStartedButton({
  firstName,
  lastName,
  className,
  'aria-label': ariaLabel,
  ...props
}: GetStartedButtonProps) {
  const initials = `${getInitial(firstName)}${getInitial(lastName)}`;
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <button
      type='button'
      aria-label={ariaLabel ?? (fullName ? `Get started as ${fullName}` : 'Get started')}
      className={cn(
        'flex size-12 items-center justify-center rounded-full border border-border bg-primary text-base font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {initials}
    </button>
  );
}
