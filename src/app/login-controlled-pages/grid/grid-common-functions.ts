import { Column } from './column';
import { Record } from './record';

export class GridCommonFunctions {
  
  /** Common Renderer functions */
  public static renderDateFromMillis(record: Record, column: Column) {
    const datemillis = column.getValueForColumn(record);
    if (null !== datemillis) {
      const date_value = new Date(datemillis);
      var dateString = date_value.getDate() 
                      + '/' + (date_value.getMonth() + 1) 
                      + '/' + date_value.getUTCFullYear();
      return dateString;
    }
    return '';
  }

  public static renderDateFromMillisWithTime(record: Record, column: Column) {
    const datemillis = column.getValueForColumn(record);
    if (null !== datemillis) {
      const date_value = new Date(datemillis);
      var dateString = date_value.getDate() 
                      + '/' + (date_value.getMonth() + 1) 
                      + '/' + date_value.getUTCFullYear() 
                      + ' ' + date_value.getHours() 
                      + ':' + date_value.getMinutes() 
                      + ':' + date_value.getSeconds();
      return dateString;
    }
    return '';
  }
}
