declare module 'ol-ext/overlay/Popup' {
  import Overlay, { type Options as OverlayOptions } from 'ol/Overlay';
  import type { Coordinate } from 'ol/coordinate';

  export type PopupOptions = Omit<OverlayOptions, 'positioning'> & {
    anchor?: boolean;
    anim?: boolean;
    className?: string;
    closeBox?: boolean;
    html?: string;
    minibar?: boolean;
    offsetBox?: number | [number, number] | [number, number, number, number];
    onclose?: () => void;
    onshow?: () => void;
    popupClass?: string;
    positioning?: OverlayOptions['positioning'] | 'auto' | `auto-${string}`;
  };

  export default class Popup extends Overlay {
    constructor(options?: PopupOptions);
    addPopupClass(className: string): void;
    getVisible(): boolean;
    hide(): void;
    removePopupClass(className: string): void;
    setClosebox(value: boolean): void;
    setPopupClass(className: string): void;
    show(coordinate: Coordinate | string | true, html?: string | Element): void;
  }
}
