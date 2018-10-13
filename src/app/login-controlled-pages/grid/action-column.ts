import { ActionButton } from './action-button';

export class ActionColumn {
  id: string;
  buttons: ActionButton[];
  totalButtons: number = -1;

  constructor(id: string, buttons: ActionButton[]) {
    this.id = id;
    this.buttons = buttons;
    this.totalButtons =  this.buttons.length;
  }

  public getButtonFromButtonNumber(num: number) {
    if (null != this.buttons) {
      if (num > 0 && num < this.buttons.length) {
        return this.buttons[num];
      }
    }
    return null;
  }

  public getButtonFromButtonId(id: string) {
    for (const button of this.buttons) {
      if (button.id === id) {
        return button;
      }
    }
    return null;
  }
}
