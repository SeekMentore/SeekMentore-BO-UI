import { EventHandler } from './event-handler';

export class ActionButton {
  id: string;
  label: string;
  btnclass: string = 'btnSubmit';
  eventHandler: EventHandler;

  constructor(id: string, label: string, eventHandler: EventHandler, btnclass: string = 'btnSubmit') {
    this.id = id;
    this.label = label;
    this.btnclass = btnclass;
    this.eventHandler = eventHandler;
  }
}
