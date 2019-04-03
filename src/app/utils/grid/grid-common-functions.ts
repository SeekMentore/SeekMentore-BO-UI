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

  public static checkNonNegativeNumberAvailability(object: number) {
    if (GridCommonFunctions.checkObjectAvailability(object)) {
      return object >= 0;
    }    
    return false;
  }

  public static checkNonNegativeNonZeroNumberAvailability(object: number) {
    if (GridCommonFunctions.checkObjectAvailability(object)) {
      return object > 0;
    }    
    return false;
  }

  public static checkNonEmptyList(object: any[]) {
    if (GridCommonFunctions.checkObjectAvailability(object) && object.length > 0) {
      return true;
    }
    return false;
  }

  /** Common Renderer functions */
  public static renderDateFromMillis(record: GridRecord, column: Column) {
    const datemillisInUTC = column.getValueForColumn(record);
    if (datemillisInUTC > 0 && GridCommonFunctions.checkObjectAvailability(datemillisInUTC)) {
      const date_value = new Date(datemillisInUTC);
      const dateString = 
                (date_value.getDate() > 9 ? date_value.getDate() : ('0' + date_value.getDate()))
        + '/' + ((date_value.getMonth() + 1) > 9 ? (date_value.getMonth() + 1) : ('0' + (date_value.getMonth() + 1)))
        + '/' + date_value.getFullYear()
      return dateString;
    }
    return '';
  }

  public static renderDateFromMillisWithTime(record: GridRecord, column: Column) {
    const datemillisInUTC = column.getValueForColumn(record);
    if (datemillisInUTC > 0 && GridCommonFunctions.checkObjectAvailability(datemillisInUTC)) {
      const date_value = new Date(datemillisInUTC);
      const dateString = 
                (date_value.getDate() > 9 ? date_value.getDate() : ('0' + date_value.getDate()))
        + '/' + ((date_value.getMonth() + 1) > 9 ? (date_value.getMonth() + 1) : ('0' + (date_value.getMonth() + 1)))
        + '/' + date_value.getFullYear()
        + ' ' + (date_value.getHours() > 9 ? date_value.getHours() : ('0' + date_value.getHours()))
        + ':' + (date_value.getMinutes() > 9 ? date_value.getMinutes() : ('0' + date_value.getMinutes()))
        + ':' + (date_value.getSeconds() > 9 ? date_value.getSeconds() : ('0' + date_value.getSeconds()));
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

  public static lookupMultiRendererForValue(multivalueSplittedList: any [], lookupList: any [], seperationJoiner: string = '; ') {
    var returnHTMLList = [];
    multivalueSplittedList.forEach(splittedValue => {
      returnHTMLList.push(GridCommonFunctions.lookupRendererForValue(splittedValue, lookupList));
    });
    return returnHTMLList.join(seperationJoiner);
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

  public static setGridRecordPropertiesInCustomObject(record: GridRecord, customObject: any) {
    if (GridCommonFunctions.checkObjectAvailability(record) && GridCommonFunctions.checkObjectAvailability(customObject)) {
      for (const customProperty in record.property) {
        customObject[customProperty] = record.getProperty(customProperty);
      }
    }
  }
}
