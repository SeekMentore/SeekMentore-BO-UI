import { GridCommonFunctions } from './grid-common-functions';
import { ActionButton } from './action-button';

export class SelectionColumn {
  id: string;
  attachMapping: boolean = false;
  mapping: string;
  buttons: ActionButton[];
  totalButtons: number = -1;
  secureButtons: string[] = [];

  constructor(
    id: string, 
    buttonsMetadata: Object[] = [],
    mapping: string = null
  ) {
    this.id = id;    
    this.mapping = mapping;
    if (GridCommonFunctions.checkObjectAvailability(this.mapping)) {
      this.attachMapping = true;
    }
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
}
