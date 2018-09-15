import {ActionButton} from './action-button';

export class ActionColumn {
  id: string;
  buttons: ActionButton[];
  totalButtons = -1;

  constructor(id: string, buttons: ActionButton[]) {
    this.id = id;
    this.buttons = buttons;
    /*
         * If label, renderer, eventHandler are Not Null
         * set values to class variables
         */
  }

  public getButtonFromButtonNumber() {
    // return button using button number
  }

  public getButtonFromButtonId() {
    // return button using button number
  }
}
