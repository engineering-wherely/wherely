import {
  GetStartedButton,
  type GetStartedButtonProps,
} from '@/features/mapping/components/GetStartedButton';
import type Map from 'ol/Map';
import type { Coordinate } from 'ol/coordinate';
import type { Options as ControlOptions } from 'ol/control/Control';
import Control from 'ol/control/Control';
import type { EventsKey } from 'ol/events';
import { unByKey } from 'ol/Observable';
import Popup, { type PopupOptions } from 'ol-ext/overlay/Popup';
import 'ol-ext/overlay/Popup.css';
import { createElement, type MouseEvent } from 'react';
import { createRoot, type Root } from 'react-dom/client';

type PopupContent = string | Element;

export type GetStartedControlOptions = Pick<
  GetStartedButtonProps,
  'firstName' | 'lastName' | 'onClick' | 'disabled'
> & {
  className?: string;
  popupContent?: PopupContent | ((map: Map) => PopupContent);
  popupCoordinate?: Coordinate | ((map: Map) => Coordinate | undefined);
  popupOptions?: PopupOptions;
  showPopupOnClick?: boolean;
  target?: ControlOptions['target'];
};

export class GetStartedControl extends Control {
  private readonly buttonProps: Pick<
    GetStartedControlOptions,
    'firstName' | 'lastName' | 'onClick' | 'disabled' | 'className'
  >;
  private readonly popupContent?: GetStartedControlOptions['popupContent'];
  private readonly popupCoordinate?: GetStartedControlOptions['popupCoordinate'];
  private readonly popupOptions?: PopupOptions;
  private readonly showPopupOnClick: boolean;
  private popup?: Popup;
  private mapChangeKeys: EventsKey[] = [];
  private readonly target?: ControlOptions['target'];
  private root?: Root;

  constructor({
    firstName,
    lastName,
    onClick,
    disabled,
    className,
    popupContent,
    popupCoordinate,
    popupOptions,
    showPopupOnClick = true,
    target,
  }: GetStartedControlOptions) {
    super({});

    this.buttonProps = {
      firstName,
      lastName,
      onClick,
      disabled,
      className,
    };
    this.popupContent = popupContent;
    this.popupCoordinate = popupCoordinate;
    this.popupOptions = popupOptions;
    this.showPopupOnClick = showPopupOnClick;
    this.target = target;
  }

  override setMap(map: Map | null) {
    const previousMap = this.getMap();

    this.unlistenForMapChanges();

    if (map) {
      this.ensureElement();
    }

    super.setMap(map);

    if (!map) {
      this.popup?.hide();
      if (previousMap && this.popup) {
        previousMap.removeOverlay(this.popup);
      }
      this.root?.unmount();
      this.popup = undefined;
      this.root = undefined;
      return;
    }

    this.listenForMapChanges(map);

    if (!this.element) {
      return;
    }

    this.root ??= createRoot(this.element);
    this.root.render(
      createElement(GetStartedButton, {
        ...this.buttonProps,
        onClick: this.handleClick,
      })
    );
  }

  protected override disposeInternal() {
    const map = this.getMap();
    this.popup?.hide();
    if (map && this.popup) {
      map.removeOverlay(this.popup);
    }
    this.unlistenForMapChanges();
    this.root?.unmount();
    super.disposeInternal();
  }

  private readonly handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    this.buttonProps.onClick?.(event);

    if (!this.showPopupOnClick || event.defaultPrevented) {
      return;
    }

    this.showPopup();
  };

  private showPopup() {
    const map = this.getMap();
    if (!map) {
      return;
    }

    const popup = this.ensurePopup(map);
    const coordinate = this.getPopupCoordinate(map);
    if (!coordinate) {
      return;
    }

    popup.show(coordinate, this.getPopupContent(map));
  }

  private readonly updatePopupPosition = () => {
    const map = this.getMap();
    if (!map || !this.popup?.getVisible()) {
      return;
    }

    const coordinate = this.getPopupCoordinate(map);
    if (!coordinate) {
      return;
    }

    this.popup.show(coordinate);
  };

  private ensurePopup(map: Map) {
    if (this.popup) {
      return this.popup;
    }

    const popup = new Popup({
      closeBox: true,
      positioning: 'center-right',
      stopEvent: true,
      ...this.popupOptions,
    });
    map.addOverlay(popup);
    this.popup = popup;
    return popup;
  }

  private getPopupCoordinate(map: Map) {
    if (typeof this.popupCoordinate === 'function') {
      return this.popupCoordinate(map);
    }

    return this.popupCoordinate ?? this.getControlAnchorCoordinate(map);
  }

  private getPopupContent(map: Map): PopupContent {
    if (typeof this.popupContent === 'function') {
      return this.popupContent(map);
    }

    return this.popupContent ?? `Get started as ${this.buttonProps.firstName} ${this.buttonProps.lastName}`;
  }

  private getControlAnchorCoordinate(map: Map) {
    if (!this.element) {
      return map.getView().getCenter();
    }

    const controlRect = this.element.getBoundingClientRect();
    const viewportRect = map.getViewport().getBoundingClientRect();
    const controlLeftCenterPixel: [number, number] = [
      controlRect.left - viewportRect.left,
      controlRect.top - viewportRect.top + controlRect.height / 2,
    ];

    return map.getCoordinateFromPixel(controlLeftCenterPixel);
  }

  private listenForMapChanges(map: Map) {
    this.mapChangeKeys = [
      map.on('change:size', this.updatePopupPosition),
      map.on('postrender', this.updatePopupPosition),
    ];
  }

  private unlistenForMapChanges() {
    if (this.mapChangeKeys.length === 0) {
      return;
    }

    for (const key of this.mapChangeKeys) {
      unByKey(key);
    }
    this.mapChangeKeys = [];
  }

  private ensureElement() {
    if (this.element) {
      return;
    }

    const element = document.createElement('div');
    element.className = 'ol-unselectable np-westland-get-started-control';
    element.style.pointerEvents = 'auto';
    this.element = element;

    if (this.target) {
      this.setTarget(this.target);
    }
  }
}
