'use client';

import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePortal,
  AutocompletePositioner,
} from '@/components/ui/autocomplete';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

export function GeocodingInput() {
  return (
    <Autocomplete
      items={frameworks}
      openOnInputClick
    >
      <AutocompleteInputGroup>
        <AutocompleteInput
          aria-label='Address'
          placeholder='Input an address'
        />
        <AutocompleteClear aria-label='Clear address' />
      </AutocompleteInputGroup>

      <AutocompletePortal>
        <AutocompletePositioner>
          <AutocompleteContent>
            <AutocompleteEmpty>No items found.</AutocompleteEmpty>
            <AutocompleteList>
              {(item: string) => (
                <AutocompleteItem
                  key={item}
                  value={item}
                >
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </AutocompletePositioner>
      </AutocompletePortal>
    </Autocomplete>
  );
}
