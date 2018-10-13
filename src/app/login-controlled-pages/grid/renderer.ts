import { Record } from './record';

export class Renderer {
  id: string;
  private callback_renderSelectionColumn: any;
	private callback_renderColumn: any;
	private callback_renderActionButton: any;

  constructor(id: string, callback_renderSelectionColumn: any, callback_renderColumn: any, callback_renderActionButton: any) {
    this.id = id;
    this.callback_renderSelectionColumn = callback_renderSelectionColumn;
    this.callback_renderColumn =  callback_renderColumn;
    this.callback_renderActionButton =  callback_renderActionButton;
  }

  public renderSelectionColumn(record: Record) {
    this.callback_renderSelectionColumn(record);
  }

  public renderColumn(record: Record) {
    this.callback_renderColumn(record);
  }

  public renderActionButton(record: Record) {
    this.callback_renderActionButton(record);
  }
}
