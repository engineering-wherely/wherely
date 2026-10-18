'use client';

import GetStartedControl from '@/app/mgcv/components/GetStartedControl';
import PersonalDetailsCard from '@/app/mgcv/components/PersonalDetailsCard';
import VectorLayer from '@/app/mgcv/components/VectorLayer';
import YearMonthRangeListControl from '@/app/mgcv/components/YearMonthRangeListControl';
import { MountCookMappingService } from '@/services/mapping/MountCookMappingService';
import store from '@/store';
import {
  Controls,
  Drawer,
  Layers,
  MapArtisan,
  MappingContextProvider,
  Popup,
} from 'np-westland';
import type { Coordinate, Nullable } from 'np-westland/types';
import type OlMap from 'ol/Map';
import { useCallback, useMemo, useState } from 'react';
import { useStore } from 'zustand';

const GET_STARTED_CONTROL_INSET = 8;
const GET_STARTED_CONTROL_SIZE = 48;
const GET_STARTED_POPUP_GAP = 12;
const GET_STARTED_POPUP_OPTIONS = { positioning: 'auto' };

export default function Home() {
  const mappingService = useMemo(() => new MountCookMappingService(), []);
  const zoom = useStore(store, (s) => s.zoom);
  const center = useStore(store, (s) => s.center);
  const projection = useStore(store, (s) => s.projection);
  const setCenter = useStore(store, (s) => s.setCenter);
  const [
    getStartedPopupCloseButtonTarget,
    setGetStartedPopupCloseButtonTarget,
  ] = useState<Nullable<HTMLDivElement>>(null);
  const [isGetStartedPopupOpen, setIsGetStartedPopupOpen] = useState(true);

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
      GET_STARTED_CONTROL_INSET,
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
          <Controls position="top-right">
            <GetStartedControl
              onClick={() => {
                setIsGetStartedPopupOpen(true);
              }}
            />
            <YearMonthRangeListControl />
          </Controls>

          {isGetStartedPopupOpen ? (
            <Popup
              className="np-westland-get-started-popup"
              closeButtonTarget={getStartedPopupCloseButtonTarget}
              popupOptions={GET_STARTED_POPUP_OPTIONS}
              coordinate={getGetStartedPopupCoordinate}
              defaultOpen={isGetStartedPopupOpen}
              onOpenChange={setIsGetStartedPopupOpen}
              updateOnPostRender
            >
              <PersonalDetailsCard
                headerActions={
                  <div ref={setGetStartedPopupCloseButtonTarget} />
                }
              />
            </Popup>
          ) : null}

          <Layers>
            <VectorLayer geoLayerId={1} />
          </Layers>
        </MapArtisan>
        <Drawer.Drawer swipeDirection="down" showSwipeHandle>
          <Drawer.DrawerTrigger className="absolute bottom-4 left-4 rounded-lg bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2">
            Map details
          </Drawer.DrawerTrigger>
          <Drawer.DrawerContent>
            <Drawer.DrawerHeader>
              <Drawer.DrawerTitle>Map details</Drawer.DrawerTitle>
              <Drawer.DrawerDescription>
                Explore the map and its geographic features.
              </Drawer.DrawerDescription>
            </Drawer.DrawerHeader>
            <Drawer.DrawerFooter className="pt-4">
              <Drawer.DrawerClose className="self-end rounded-md border px-4 py-2 text-sm font-medium">
                Close
              </Drawer.DrawerClose>
            </Drawer.DrawerFooter>
          </Drawer.DrawerContent>
        </Drawer.Drawer>
      </div>
    </MappingContextProvider>
  );
}
