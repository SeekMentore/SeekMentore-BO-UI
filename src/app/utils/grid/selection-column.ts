import { GridCommonFunctions } from './grid-common-functions';
import { ActionButton } from './action-button';

export class SelectionColumn {
  id: string;
  attachMapping: boolean = false;
  mapping: string;
  buttons: ActionButton[];
  totalButtons: number = -1;

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
          if (GridCommonFunctions.checkObjectAvailability(buttonMetadata.btnclass)) {
            this.buttons.push(new ActionButton(this.id + '-ActionButton-' + buttonId, buttonMetadata.label, buttonMetadata.clickEvent, buttonMetadata.renderer, buttonMetadata.btnclass));
          } else {
            this.buttons.push(new ActionButton(this.id + '-ActionButton-' + buttonId, buttonMetadata.label, buttonMetadata.clickEvent, buttonMetadata.renderer));
          }
        }
      }
    }
    this.totalButtons =  this.buttons.length;
  }
}
