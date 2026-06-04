'use client';

import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePortal,
  AutocompletePopup,
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
          <AutocompletePopup>
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
          </AutocompletePopup>
        </AutocompletePositioner>
      </AutocompletePortal>
    </Autocomplete>
  );
}
