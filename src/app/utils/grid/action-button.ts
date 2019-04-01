import { EventHandler } from './event-handler';
import { GridCommonFunctions } from './grid-common-functions';
import { UIRenderer } from './ui-renderer';

export class ActionButton {
  id: string;
  userGivenId: string;
  label: string;
  btnclass: string = 'btnSubmit';
  isDisabled: boolean = false;
  eventHandler: EventHandler;
  uiRenderer: UIRenderer;
  isSecured: boolean;
  securityIsVisibleProperty: string;
  securityIsEnabledProperty: string;

  constructor(
          id: string, 
          userGivenId: string,
          label: string, 
          clickEvent: any,
          renderer: any,
          btnclass: string = 'btnSubmit',
          securityMapping: any          
  ) {
    this.id = id;
    this.userGivenId = userGivenId;
    this.label = label;
    if (GridCommonFunctions.checkStringAvailability(btnclass)) {
      this.btnclass = btnclass;
    } else {
      this.btnclass = 'btnSubmit';
    }
    this.eventHandler = null;
    if (GridCommonFunctions.checkObjectAvailability(clickEvent)) {
      this.eventHandler = new EventHandler(this.id + '-eventHandler', clickEvent);
    }
    this.uiRenderer = null;
    if (GridCommonFunctions.checkObjectAvailability(renderer)) {
      this.uiRenderer = new UIRenderer(this.id + '-UIRenderer', renderer);
    }
    if (securityMapping) {
      if (GridCommonFunctions.checkObjectAvailability(securityMapping.isSecured) && securityMapping.isSecured === true) {
        this.isSecured = true;
        if (GridCommonFunctions.checkStringAvailability(securityMapping.visible)) {
          this.securityIsVisibleProperty = securityMapping.visible;
        } else {
          this.securityIsVisibleProperty = '-UNKNOWN-';
        }
        if (GridCommonFunctions.checkStringAvailability(securityMapping.enabled)) {
          this.securityIsEnabledProperty = securityMapping.enabled;
        } else {
          this.securityIsEnabledProperty = '-UNKNOWN-';
        }
      }
    } else {
      this.isSecured = false;
    }
  }

  public disable() {
    this.isDisabled = true;
  }

  public enable() {
    this.isDisabled = false;
  }

  public setLabel(label: string) {
    if (GridCommonFunctions.checkStringAvailability(label)) {
      this.label = label;
    }
  }
}
