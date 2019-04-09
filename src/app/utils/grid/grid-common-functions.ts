import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { Column } from './column';
import { GridRecord } from './grid-record';

export class GridCommonFunctions {

  static MONTH_NAME_ARRAY = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  static MONTH_ABBR_NAME_ARRAY = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  static WEEKDAY_NAME_ARRAY = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

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
      const dateString = (date_value.getDate() > 9 ? date_value.getDate() : ('0' + date_value.getDate()))
        + '-' + GridCommonFunctions.MONTH_ABBR_NAME_ARRAY[date_value.getMonth()]
        + '-' + date_value.getFullYear();
      return dateString;
    }
    return '';
  }

  public static renderDateFromMillisWithTime(record: GridRecord, column: Column) {
    const datemillisInUTC = column.getValueForColumn(record);
    if (datemillisInUTC > 0 && GridCommonFunctions.checkObjectAvailability(datemillisInUTC)) {
      const date_value = new Date(datemillisInUTC);
      let hours: number = date_value.getHours();
      let am_pm: string = 'AM';
      if (hours > 12) {
        am_pm = 'PM';
      }
      if (hours < 1) {
        hours = 12 - hours;
      } else if (hours > 12) {
        hours = hours - 12;
      }      
      const dateString = (date_value.getDate() > 9 ? date_value.getDate() : ('0' + date_value.getDate()))
        + '-' + GridCommonFunctions.MONTH_ABBR_NAME_ARRAY[date_value.getMonth()]
        + '-' + date_value.getFullYear()
        + ' - '+ (hours > 9 ? hours : ('0' + hours))
        + ':' + (date_value.getMinutes() > 9 ? date_value.getMinutes() : ('0' + date_value.getMinutes()))
        + ' ' + am_pm;
      return dateString;
    }
    return '';
  }

  public static lookupRenderer(record: GridRecord, column: Column, lookupList: any []) {
    var value = column.getValueForColumn(record);    	
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  public static lookupRendererForValue(lookupValue: any, lookupList: { value: any, label: any }[]) {
    let returnValue: any = lookupValue;
    if (GridCommonFunctions.checkNonEmptyList(lookupList) 
          && GridCommonFunctions.checkObjectAvailability(lookupValue)
          && GridCommonFunctions.checkStringAvailability(lookupValue.toString())) {
      for (var i  = 0; i < lookupList.length; i++) {
        let filterOption = lookupList[i];
        if (filterOption.value.toString() === lookupValue.toString()) {        
          returnValue = filterOption.label.toString(); 
          break;      
        } 
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

  public static yesNoRenderer(record: GridRecord, column: Column) {
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

  public static getGridRecordsPropertyAndAlternatePropertyList (
      selectedRecords: GridRecord[], 
      propertyName: string, 
      alternatePropertyName: string
  ) : {
    selectedPropertyList: any[],
    selectedAlternatePropertyList: any[]
  } {
    let selectedValuesList : {
      selectedPropertyList: any[],
      selectedAlternatePropertyList: any[]
    } = {
      selectedPropertyList: [],
      selectedAlternatePropertyList: []
    };
    for(const record of selectedRecords) {
      let propertyValue: any = record.getProperty(propertyName);
      if (GridCommonFunctions.checkStringAvailability(propertyValue.toString())) {
        selectedValuesList.selectedPropertyList.push(propertyValue);
      } else {
        if (GridCommonFunctions.checkStringAvailability(alternatePropertyName)) {
          selectedValuesList.selectedAlternatePropertyList.push(record.getProperty(alternatePropertyName))
        }
      }      
    }
    return selectedValuesList;
  }

  public static setGridRecordPropertiesInCustomObject(record: GridRecord, customObject: any) {
    if (GridCommonFunctions.checkObjectAvailability(record) && GridCommonFunctions.checkObjectAvailability(customObject)) {
      for (const customProperty in record.property) {
        customObject[customProperty] = record.getProperty(customProperty);
      }
    }
  }
}
