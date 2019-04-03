import { ActionButton } from './action-button';
import { Column } from './column';
import { GridCommonFunctions } from './grid-common-functions';
import { GridRecord } from './grid-record';
import { GridComponent } from './grid.component';

export class EventHandler {
  id: string;
  private callback_clickEvent: any;

  constructor(id: string, callback_clickEvent: any) {
    this.id = id;
    this.callback_clickEvent = callback_clickEvent;
  }

  public clickEventColumn(record: GridRecord, column: Column, gridComponentObject: GridComponent) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_clickEvent)) {
      this.callback_clickEvent(record, column, gridComponentObject);
    }
  }

  public clickEventActionColumnActionButton(record: GridRecord, button: ActionButton, gridComponentObject: GridComponent) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_clickEvent)) {
      this.callback_clickEvent(record, button, gridComponentObject);
    }
  }

  public clickEventSelectionColumnActionButton(selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_clickEvent)) {
      this.callback_clickEvent(selectedRecords, button, gridComponentObject);
    }
  }
}
