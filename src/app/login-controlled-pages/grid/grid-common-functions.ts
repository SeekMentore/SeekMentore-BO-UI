import {Column} from "./column";
import {Record} from "./record";

export class GridCommonFunctions {

  /** Common validity functions */
  public static checkObjectAvailability(object: any) {
    if (null !== object && undefined !== object) {
      return true;
    }
    return false;
  }

  public static checkStringAvailability(stringObject: string) {
    if (GridCommonFunctions.checkObjectAvailability(stringObject)) {
      if ('' !== stringObject.trim()) {
        return true;
      }
    }
    return false;
  }

  /** Common Renderer functions */
  public static renderDateFromMillis(record: Record, column: Column) {
    const datemillis = column.getValueForColumn(record);
    if (GridCommonFunctions.checkObjectAvailability(datemillis)) {
      const date_value = new Date(datemillis);
      const dateString = date_value.getDate()
        + '/' + (date_value.getMonth() + 1)
        + '/' + date_value.getUTCFullYear();
      return dateString;
    }
    return '';
  }

  public static renderDateFromMillisWithTime(record: Record, column: Column) {
    const datemillis = column.getValueForColumn(record);
    if (GridCommonFunctions.checkObjectAvailability(datemillis)) {
      const date_value = new Date(datemillis);
      const dateString = date_value.getDate()
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
