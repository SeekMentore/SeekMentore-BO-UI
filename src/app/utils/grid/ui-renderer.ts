import { Column } from './column';
import { GridCommonFunctions } from './grid-common-functions';
import { GridRecord } from './grid-record';
import { GridComponent } from './grid.component';

export class UIRenderer {
  id: string;  
	private callback_renderColumn: any;	

  constructor(id: string, callback_renderColumn: any) {
    this.id = id;
    this.callback_renderColumn =  callback_renderColumn;
  }  

  public renderColumn(record: GridRecord, column: Column, gridComponentObject: GridComponent) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_renderColumn)) {
      return this.callback_renderColumn(record, column, gridComponentObject);      
    }    
    return column.getValueForColumn(record);
  }  
}
