import {Renderer} from './renderer';
import {EventHandler} from './event-handler';

export class SelectionColumn {
  id: string;
  attachMapping: boolean;
  mapping: string;
  renderer: Renderer; // This is a JS definition which we defined
  eventHandler: EventHandler; // This is a JS definition which we defined

  constructor(id: string, attachMapping = false, mapping = null, renderer = null, eventHandler = null) {
    this.id = id;
    /*
         * If attachMapping, mapping, renderer, eventHandler are Not Null
         * set values to class variables
         */
  }
}
