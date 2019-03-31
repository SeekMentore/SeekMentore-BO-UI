import { Column } from './column';
import { GridCommonFunctions } from './grid-common-functions';
import { GridRecord } from './grid-record';
import { GridComponent } from './grid.component';
import { ActionButton } from './action-button';

export class UIRenderer {
  id: string;  
	private callback_render: any;	

  constructor(id: string, callback_render: any) {
    this.id = id;
    this.callback_render =  callback_render;
  }  

  public renderColumn(record: GridRecord, column: Column, gridComponentObject: GridComponent) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_render)) {
      return this.callback_render(record, column, gridComponentObject);      
    }    
    return column.getValueForColumn(record);
  } 
  
  public renderButton(record: GridRecord, button: ActionButton, gridComponentObject: GridComponent) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_render)) {
      return this.callback_render(record, button, gridComponentObject);      
    }    
    return true;
  }
}
