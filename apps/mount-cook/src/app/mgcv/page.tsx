'use client';

import YearMonthRangeListControl from '@/app/mgcv/components/YearMonthRangeListControl';
import { useGeoLayers } from '@/app/mgcv/hooks/useGeoLayers';
import { MountCookMappingService } from '@/services/mapping/MountCookMappingService';
import store from '@/store';
import {
  GetStartedControl,
  MapArtisan,
  MappingContextProvider,
  Popup,
} from 'np-westland';
import type { Coordinate } from 'np-westland/types';
import type OlMap from 'ol/Map';
import { useCallback, useMemo, useState } from 'react';
import { useStore } from 'zustand';

const GET_STARTED_CONTROL_INSET = 8;
const GET_STARTED_CONTROL_SIZE = 48;
const GET_STARTED_POPUP_GAP = 12;

export default function Home() {
  const mappingService = useMemo(() => new MountCookMappingService(), []);
  const zoom = useStore(store, (s) => s.zoom);
  const center = useStore(store, (s) => s.center);
  const projection = useStore(store, (s) => s.projection);
  const setCenter = useStore(store, (s) => s.setCenter);
  const [isGetStartedPopupOpen, setIsGetStartedPopupOpen] = useState(true);
  const { status: geoLayersStatus, data: geoLayers } = useGeoLayers();

  function onCenterChanged(c: Coordinate) {
    setCenter(c);
  }

  const getGetStartedPopupCoordinate = useCallback((map: OlMap) => {
    const size = map.getSize();
    if (!size) {
      return map.getView().getCenter();
    }

    return map.getCoordinateFromPixel([
      size[0] -
        GET_STARTED_CONTROL_INSET -
        GET_STARTED_CONTROL_SIZE -
        GET_STARTED_POPUP_GAP,
      GET_STARTED_CONTROL_INSET + GET_STARTED_CONTROL_SIZE / 2,
    ]);
  }, []);

  return (
    <MappingContextProvider service={mappingService} store={store}>
      <div className="relative h-full w-full">
        <MapArtisan
          zoom={zoom}
          center={center}
          projection={projection}
          listeners={{ onCenterChanged }}
        >
          <GetStartedControl
            firstName="Matthew"
            lastName="Gong"
            onClick={() => {
              setIsGetStartedPopupOpen(true);
            }}
          />
          {isGetStartedPopupOpen ? (
            <Popup
              coordinate={getGetStartedPopupCoordinate}
              defaultOpen={isGetStartedPopupOpen}
              onOpenChange={setIsGetStartedPopupOpen}
              updateOnPostRender
            >
              Get started as Matthew Gong
            </Popup>
          ) : null}
          <YearMonthRangeListControl />
        </MapArtisan>
        <div
          className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-md"
          role="status"
          aria-live="polite"
        >
          {geoLayersStatus === 'pending'
            ? 'Loading geo layers…'
            : geoLayersStatus === 'error'
              ? 'Unable to load geo layers'
              : `Geo layers: ${geoLayers.length}`}
        </div>
      </div>
    </MappingContextProvider>
  );
}
