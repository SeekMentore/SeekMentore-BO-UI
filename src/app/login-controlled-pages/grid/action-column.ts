import { ActionButton } from './action-button';
import { GridCommonFunctions } from './grid-common-functions';

export class ActionColumn {
  id: string;
  label: string = 'Action Column'
  buttons: ActionButton[];
  totalButtons: number = -1;

  constructor(
      id: string, 
      buttonsMetadata: Object[] = [], 
      label: string = 'Action Column'
  ) {
    this.id = id;
    this.label = label;
    this.buttons = [];
    if (GridCommonFunctions.checkObjectAvailability(buttonsMetadata) && buttonsMetadata.length > 0) {
      for (var i = 0; i < buttonsMetadata.length; i++) {
        var buttonMetadata:any = buttonsMetadata[i];
        if (GridCommonFunctions.checkObjectAvailability(buttonMetadata)) {
          const buttonId = GridCommonFunctions.checkObjectAvailability(buttonMetadata.id) ? buttonMetadata.id : i.toString();
          if (GridCommonFunctions.checkObjectAvailability(buttonMetadata.btnclass)) {
            this.buttons.push(new ActionButton(this.id + '-ActionButton-' + buttonId, buttonMetadata.label, buttonMetadata.clickEvent, buttonMetadata.btnclass));
          } else {
            this.buttons.push(new ActionButton(this.id + '-ActionButton-' + buttonId, buttonMetadata.label, buttonMetadata.clickEvent));
          }
        }
      }
    }
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
