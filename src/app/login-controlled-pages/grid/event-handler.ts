import { Record } from './record';
import { Column } from './column';
import { ActionButton } from './action-button';
import { GridCommonFunctions } from './grid-common-functions';
import {GridComponent} from './grid.component';

export class EventHandler {
  id: string;
  private callback_clickEvent: any;

  constructor(id: string, callback_clickEvent: any) {
    this.id = id;
    this.callback_clickEvent = callback_clickEvent;
  }

  public clickEventColumn(record: Record, column: Column) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_clickEvent)) {
      this.callback_clickEvent(record, column);
    }
  }

  public clickEventActionColumnButton(record: Record, button: ActionButton) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_clickEvent)) {
      this.callback_clickEvent(record, button);
    }
  }

  public clickEventSelectionColumnMultipleActionButton(selectedRecords: Record[], button: ActionButton) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_clickEvent)) {
      this.callback_clickEvent(selectedRecords, button);
    }
  }
}
