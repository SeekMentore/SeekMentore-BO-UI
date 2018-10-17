import { Column } from './column';
import { GridCommonFunctions } from './grid-common-functions';
import { Record } from './record';

export class UIRenderer {
  id: string;  
	private callback_renderColumn: any;	

  constructor(id: string, callback_renderColumn: any) {
    this.id = id;
    this.callback_renderColumn =  callback_renderColumn;
  }  

  public renderColumn(record: Record, column: Column) {
    if (GridCommonFunctions.checkObjectAvailability(this.callback_renderColumn)) {
      return this.callback_renderColumn(record, column);      
    }    
    return column.getValueForColumn(record);
  }  
}
