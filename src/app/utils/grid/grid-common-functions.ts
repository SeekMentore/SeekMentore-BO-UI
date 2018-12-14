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

  public static checkStringContainsText(stringObject: string, textToSearch: string) {
    if (GridCommonFunctions.checkObjectAvailability(stringObject)) {
      if ('' !== stringObject.trim()) {
        if (stringObject.includes(textToSearch)) {
          return true;
        }
      }
    }
    return false;
  }

  /** Common Renderer functions */
  public static renderDateFromMillis(record: GridRecord, column: Column) {
    const datemillis = column.getValueForColumn(record);
    if (GridCommonFunctions.checkObjectAvailability(datemillis)) {
      const date_value = new Date(datemillis);
      const dateString = date_value.getUTCDate()
        + '/' + (date_value.getUTCMonth() + 1)
        + '/' + date_value.getUTCFullYear();
      return dateString;
    }
    return '';
  }

  public static renderDateFromMillisWithTime(record: GridRecord, column: Column) {
    const datemillis = column.getValueForColumn(record);
    if (GridCommonFunctions.checkObjectAvailability(datemillis)) {
      const date_value = new Date(datemillis);
      const dateString = date_value.getUTCDate()
        + '/' + (date_value.getUTCMonth() + 1)
        + '/' + date_value.getUTCFullYear()
        + ' ' + date_value.getUTCHours()
        + ':' + date_value.getUTCMinutes()
        + ':' + date_value.getUTCSeconds();
      return dateString;
    }
    return '';
  }

  public static lookupRenderer(record: GridRecord, column: Column, lookupList: any []) {
    var value = column.getValueForColumn(record);    	
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  public static lookupRendererForValue(value: any, lookupList: any []) {
    let returnValue = value;
    for (var i  = 0; i < lookupList.length; i++) {
      let filterOption = lookupList[i];
      if (filterOption.value === value) {        
        returnValue = filterOption.label; 
        break;      
      } 
    }       	
    return returnValue;
  }

  public static lookupMultiRenderer(record: GridRecord, column: Column, lookupList: any [], valueSplitter: string) {
    var multivalue = column.getValueForColumn(record);    
    return GridCommonFunctions.lookupMultiRendererForValue(multivalue.split(valueSplitter), lookupList);
  }

  private static lookupMultiRendererForValue(multivalueSplittedList: any [], lookupList: any []) {
    var returnHTMLList = [];
    multivalueSplittedList.forEach(splittedValue => {
      returnHTMLList.push(GridCommonFunctions.lookupRendererForValue(splittedValue, lookupList));
    });
    return returnHTMLList.join('; ');
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
