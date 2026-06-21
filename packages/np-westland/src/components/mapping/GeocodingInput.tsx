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
} from '@/components/ui/autocomplete';

type GeocodingInputProps = {
  location: string;
  result: unknown[];
  onLocationChange: (location: string) => void;
};

export function GeocodingInput({ location, result, onLocationChange }: GeocodingInputProps) {
  return (
    <Autocomplete
      items={result}
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
