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
import { useContext, useState } from 'react';
import { MappingContext } from './MappingContext';

type GeocodingInputProps = {
  location: string;
};

export function GeocodingInput({ location }: GeocodingInputProps) {
  const mappingService = useContext(MappingContext);
  const [result, setResult] = useState<unknown[]>([]);

  async function onLocationChange(value: string) {
    if (!mappingService) {
      return [];
    }

    const foo = await mappingService.geocode(value);
    setResult(foo);
  }

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
