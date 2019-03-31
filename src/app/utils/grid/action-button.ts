import { EventHandler } from './event-handler';
import { GridCommonFunctions } from './grid-common-functions';
import { UIRenderer } from './ui-renderer';

export class ActionButton {
  id: string;
  label: string;
  btnclass: string = 'btnSubmit';
  isDisabled: boolean = false;
  eventHandler: EventHandler;
  uiRenderer: UIRenderer;

  constructor(
          id: string, 
          label: string, 
          clickEvent: any,
          renderer: any,
          btnclass: string = 'btnSubmit',          
  ) {
    this.id = id;
    this.label = label;
    this.btnclass = btnclass;
    this.eventHandler = null;
    if (GridCommonFunctions.checkObjectAvailability(clickEvent)) {
      this.eventHandler = new EventHandler(this.id + '-eventHandler', clickEvent);
    }
    this.uiRenderer = null;
    if (GridCommonFunctions.checkObjectAvailability(renderer)) {
      this.uiRenderer = new UIRenderer(this.id + '-UIRenderer', renderer);
    }
  }

  public disable() {
    this.isDisabled = true;
  }

  public enable() {
    this.isDisabled = false;
  }
}
