import { GetStartedButton, type GetStartedButtonProps } from '@/features/mapping/components/GetStartedButton';
import Control from 'ol/control/Control';
import type { Options as ControlOptions } from 'ol/control/Control';
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
  private readonly root: Root;

  constructor({ firstName, lastName, onClick, disabled, className, target }: GetStartedControlOptions) {
    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control np-westland-get-started-control';

    const root = createRoot(element);
    root.render(
      createElement(GetStartedButton, {
        firstName,
        lastName,
        onClick,
        disabled,
        className,
      })
    );

    super({
      element,
      target,
    });

    this.root = root;
  }

  protected override disposeInternal() {
    this.root.unmount();
    super.disposeInternal();
  }
}
