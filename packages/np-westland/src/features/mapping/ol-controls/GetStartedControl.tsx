import {
  GetStartedButton,
  type GetStartedButtonProps,
} from '@/features/mapping/components/GetStartedButton';
import type Map from 'ol/Map';
import type { Options as ControlOptions } from 'ol/control/Control';
import Control from 'ol/control/Control';
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

export type GetStartedControlOptions = Pick<
  GetStartedButtonProps,
  'firstName' | 'lastName' | 'onClick' | 'disabled'
> & {
  className?: string;
  target?: ControlOptions['target'];
};

export class GetStartedControl extends Control {
  private readonly buttonProps: Pick<
    GetStartedControlOptions,
    'firstName' | 'lastName' | 'onClick' | 'disabled' | 'className'
  >;
  private readonly target?: ControlOptions['target'];
  private root?: Root;

  constructor({
    firstName,
    lastName,
    onClick,
    disabled,
    className,
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
    this.target = target;
  }

  override setMap(map: Map | null) {
    if (map) {
      this.ensureElement();
    }

    super.setMap(map);

    if (!map) {
      this.root?.unmount();
      this.root = undefined;
      return;
    }

    if (!this.element) {
      return;
    }

    this.root ??= createRoot(this.element);
    this.root.render(
      createElement(GetStartedButton, {
        ...this.buttonProps,
      })
    );
  }

  protected override disposeInternal() {
    this.root?.unmount();
    super.disposeInternal();
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
