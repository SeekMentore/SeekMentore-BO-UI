import { EventHandler } from './event-handler';
import { GridCommonFunctions } from './grid-common-functions';

export class ActionButton {
  id: string;
  label: string;
  btnclass: string = 'btnSubmit';
  eventHandler: EventHandler;

  constructor(
          id: string, 
          label: string, 
          clickEvent: any, 
          btnclass: string = 'btnSubmit'
  ) {
    this.id = id;
    this.label = label;
    this.btnclass = btnclass;
    this.eventHandler = null;
    if (GridCommonFunctions.checkObjectAvailability(clickEvent)) {
      this.eventHandler = new EventHandler(this.id + '-eventHandler', clickEvent);
    }
  }
}
