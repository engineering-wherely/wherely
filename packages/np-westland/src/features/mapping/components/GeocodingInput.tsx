'use client';

import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
} from '@/shadcn-ui/components/ui/autocomplete';
import type { GeocodeResult } from '@googlemaps/google-maps-services-js';

type GeocodingInputProps = {
  location: string;
  result: GeocodeResult[];
  onLocationChange: (location: string) => void;
};

export function GeocodingInput({ location, result, onLocationChange }: GeocodingInputProps) {
  const items = result.map((r) => r.formatted_address);
  return (
    <Autocomplete
      items={items}
      value={location}
      onValueChange={onLocationChange}
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
