'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import type * as React from 'react';

import { cn } from '@/lib/utils';

type StyledProps<T extends React.ElementType> = Omit<React.ComponentProps<T>, 'className'> & {
  className?: string;
};

const Autocomplete = AutocompletePrimitive.Root;

function AutocompleteValue(props: React.ComponentProps<typeof AutocompletePrimitive.Value>) {
  return <AutocompletePrimitive.Value {...props} />;
}

function AutocompletePortal(props: React.ComponentProps<typeof AutocompletePrimitive.Portal>) {
  return <AutocompletePrimitive.Portal {...props} />;
}

function AutocompleteCollection(
  props: React.ComponentProps<typeof AutocompletePrimitive.Collection>
) {
  return <AutocompletePrimitive.Collection {...props} />;
}

function AutocompleteInputGroup({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.InputGroup>) {
  return (
    <AutocompletePrimitive.InputGroup
      data-slot='autocomplete-input-group'
      className={cn(
        'flex h-8 w-full items-center rounded-lg border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  );
}

function AutocompleteInput({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Input>) {
  return (
    <AutocompletePrimitive.Input
      data-slot='autocomplete-input'
      className={cn(
        'min-w-0 flex-1 bg-transparent px-2.5 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function AutocompleteTrigger({
  className,
  children,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Trigger>) {
  return (
    <AutocompletePrimitive.Trigger
      data-slot='autocomplete-trigger'
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <path d='m6 9 6 6 6-6' />
        </svg>
      )}
    </AutocompletePrimitive.Trigger>
  );
}

function AutocompleteIcon({ className, ...props }: StyledProps<typeof AutocompletePrimitive.Icon>) {
  return (
    <AutocompletePrimitive.Icon
      data-slot='autocomplete-icon'
      className={cn('flex shrink-0 items-center text-muted-foreground [&_svg]:size-4', className)}
      {...props}
    />
  );
}

function AutocompleteClear({
  className,
  children,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Clear>) {
  return (
    <AutocompletePrimitive.Clear
      data-slot='autocomplete-clear'
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <path d='M18 6 6 18M6 6l12 12' />
        </svg>
      )}
    </AutocompletePrimitive.Clear>
  );
}

function AutocompletePositioner({
  className,
  align = 'start',
  sideOffset = 4,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Positioner>) {
  return (
    <AutocompletePrimitive.Positioner
      data-slot='autocomplete-positioner'
      align={align}
      sideOffset={sideOffset}
      className={cn('z-50', className)}
      {...props}
    />
  );
}

function AutocompleteContent({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Popup>) {
  return (
    <AutocompletePrimitive.Popup
      data-slot='autocomplete-content'
      className={cn(
        'max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md outline-none transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
        className
      )}
      {...props}
    />
  );
}

function AutocompleteList({ className, ...props }: StyledProps<typeof AutocompletePrimitive.List>) {
  return (
    <AutocompletePrimitive.List
      data-slot='autocomplete-list'
      className={cn('max-h-[min(18rem,var(--available-height))] overflow-y-auto p-1', className)}
      {...props}
    />
  );
}

function AutocompleteItem({ className, ...props }: StyledProps<typeof AutocompletePrimitive.Item>) {
  return (
    <AutocompletePrimitive.Item
      data-slot='autocomplete-item'
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteEmpty({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Empty>) {
  return (
    <AutocompletePrimitive.Empty
      data-slot='autocomplete-empty'
      className={cn('px-2 py-6 text-center text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function AutocompleteStatus({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Status>) {
  return (
    <AutocompletePrimitive.Status
      data-slot='autocomplete-status'
      className={cn('px-2 py-2 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function AutocompleteGroup({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Group>) {
  return (
    <AutocompletePrimitive.Group
      data-slot='autocomplete-group'
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[data-slot=autocomplete-item]]:px-2',
        className
      )}
      {...props}
    />
  );
}

function AutocompleteGroupLabel({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.GroupLabel>) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot='autocomplete-group-label'
      className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  );
}

function AutocompleteSeparator({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Separator>) {
  return (
    <AutocompletePrimitive.Separator
      data-slot='autocomplete-separator'
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

function AutocompleteRow({ className, ...props }: StyledProps<typeof AutocompletePrimitive.Row>) {
  return (
    <AutocompletePrimitive.Row
      data-slot='autocomplete-row'
      className={cn('flex', className)}
      {...props}
    />
  );
}

function AutocompleteBackdrop({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Backdrop>) {
  return (
    <AutocompletePrimitive.Backdrop
      data-slot='autocomplete-backdrop'
      className={cn('fixed inset-0 z-50', className)}
      {...props}
    />
  );
}

function AutocompleteArrow({
  className,
  ...props
}: StyledProps<typeof AutocompletePrimitive.Arrow>) {
  return (
    <AutocompletePrimitive.Arrow
      data-slot='autocomplete-arrow'
      className={cn(
        'fill-popover stroke-border data-[side=bottom]:-translate-y-px data-[side=left]:translate-x-px data-[side=right]:-translate-x-px data-[side=top]:translate-y-px',
        className
      )}
      {...props}
    />
  );
}

export {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteBackdrop,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteIcon,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompleteRow,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  AutocompleteValue,
};
