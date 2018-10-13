import { Record } from './record';

export class EventHandler {
  id: string;
  private callback_clickEvent: any;
	private callback_mouseOverEvent: any;
	private callback_textEnterEvent: any;

  constructor(id: string, callback_clickEvent: any, callback_mouseOverEvent: any, callback_textEnterEvent: any) {
    this.id = id;
    this.callback_clickEvent = callback_clickEvent;
    this.callback_mouseOverEvent =  callback_mouseOverEvent;
    this.callback_textEnterEvent =  callback_textEnterEvent;
  }

  public clickEvent(record: Record) {
    this.callback_clickEvent(record);
  }

  public mouseOverEvent(record: Record) {
    this.callback_mouseOverEvent(record);
  }

  public textEnterEvent(record: Record) {
    this.callback_textEnterEvent(record);
  }
}
