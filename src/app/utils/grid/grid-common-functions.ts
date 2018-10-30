import { Column } from './column';
import { GridRecord } from './grid-record';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';

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
  public static renderDateFromMillis(record: GridRecord, column: Column) {
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

  public static renderDateFromMillisWithTime(record: GridRecord, column: Column) {
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

  public static lookupRenderer(record: GridRecord, column: Column, lookupList: any []) {
    var value = column.getValueForColumn(record);
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  private static lookupRendererForValue(value: any, lookupList: any []) {
    lookupList.forEach(filterOption => {
      if (filterOption.value === value) {
        return filterOption.label
      }
    });
    return value;
  }

  public static lookupMultiRenderer(record: GridRecord, column: Column, lookupList: any [], valueSplitter: string) {
    var multivalue = column.getValueForColumn(record);
    return GridCommonFunctions.lookupMultiRendererForValue(multivalue.split(valueSplitter), lookupList);
  }

  private static lookupMultiRendererForValue(multivalueSplittedList: any [], lookupList: any []) {
    var returnHTML = '';
    multivalueSplittedList.forEach(splittedValue => {
      var found: boolean = false;
      returnHTML += GridCommonFunctions.lookupRendererForValue(splittedValue, lookupList) + '<br/>';
    });
    return returnHTML;
  }

  public static yesNoRenderer(record, column) {
    return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.yesNoFilterOptions);
  }

  public static getSelectedRecordsPropertyList(selectedRecords: GridRecord[], propertyName: string) {
    const selectedPropertyList: any[] = [];
    for(const record of selectedRecords) {
      if (record.selectionModelCheck) {
        selectedPropertyList.push(record.getProperty(propertyName));
      }
    }
    return selectedPropertyList;
  }
}
