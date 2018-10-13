import { EventHandler } from './event-handler';
import { Renderer } from './renderer';

export class SelectionColumn {
  id: string;
  attachMapping: boolean;
  mapping: string;
  renderer: Renderer;
  eventHandler: EventHandler;

  constructor(id: string, attachMapping = false, mapping = null, renderer = null, eventHandler = null) {
    this.id = id;
    this.attachMapping = attachMapping;
    this.mapping = mapping;
    this.renderer = renderer;
    this.eventHandler = eventHandler;
  }
}
