import { EventHandler } from './event-handler';
import { Renderer } from './renderer';

export class ActionButton {
  id: string;
  label: string;
  btnclass: string = 'btnSubmit';
  renderer: Renderer;
  eventHandler: EventHandler;

  constructor(id: string, label: string, btnclass: string = 'btnSubmit', renderer: Renderer = null, eventHandler: EventHandler = null) {
    this.id = id;
    this.label = label;
    this.btnclass = btnclass;
    this.renderer = renderer;
    this.eventHandler = eventHandler;
  }
}
