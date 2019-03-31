import { ActionButton } from './action-button';
import { GridCommonFunctions } from './grid-common-functions';

export class ActionColumn {
  id: string;
  label: string = 'Action Column'
  buttons: ActionButton[];
  totalButtons: number = -1;
  secureButtons: string[] = [];

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
          let button: ActionButton;
          if (GridCommonFunctions.checkObjectAvailability(buttonMetadata.btnclass)) {
            button = new ActionButton(
                                    this.id + '-ActionButton-' + buttonId, 
                                    buttonId,
                                    buttonMetadata.label, 
                                    buttonMetadata.clickEvent, 
                                    buttonMetadata.renderer, 
                                    buttonMetadata.btnclass,
                                    buttonMetadata.securityMapping
                      );
          } else {
            button = new ActionButton(
                                  this.id + '-ActionButton-' + buttonId, 
                                  buttonId,
                                  buttonMetadata.label, 
                                  buttonMetadata.clickEvent, 
                                  buttonMetadata.renderer,
                                  null,
                                  buttonMetadata.securityMapping
                    );
          }
          this.buttons.push(button);
          this.checkAndSetSecureButtons(button);
        }
      }
    }
    this.totalButtons =  this.buttons.length;
  }

  private checkAndSetSecureButtons(button: ActionButton) {
    if (button.isSecured) {
      this.secureButtons.push(button.userGivenId);
    }
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
