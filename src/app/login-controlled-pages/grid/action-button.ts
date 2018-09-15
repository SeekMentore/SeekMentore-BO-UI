import {Renderer} from './renderer';
import {EventHandler} from './event-handler';

export class ActionButton {
  id: string;
  label: string;
  renderer: Renderer; // This is a JS definition which we defined
  eventHandler: EventHandler;  // This is a JS definition which we defined

  constructor(id: string, label: string, renderer: Renderer = null, eventHandler: EventHandler = null) {
    this.id = id;
    this.label = label;
    /*
         * If label, renderer, eventHandler are Not Null
         * set values to class variables
         */
  }
}
