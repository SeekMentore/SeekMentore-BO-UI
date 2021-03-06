import { CkeditorConfig } from "./ckeditor-config";
import { EnvironmentConstants } from "./environment-constants";
import { GridRecord } from "./grid/grid-record";
import { AppConstants } from "./app-constants";

declare var CKEDITOR: any;

export class CommonUtilityFunctions {

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
    if (CommonUtilityFunctions.checkObjectAvailability(stringObject)) {
      if ('' !== stringObject.trim()) {
        return true;
      }
    }
    return false;
  }

  public static checkNonNegativeNumberAvailability(object: number) {
    if (CommonUtilityFunctions.checkObjectAvailability(object)) {
      return object >= 0;
    }    
    return false;
  }

  public static checkNonNegativeNonZeroNumberAvailability(object: number) {
    if (CommonUtilityFunctions.checkObjectAvailability(object)) {
      return object > 0;
    }    
    return false;
  }

  public static checkNonEmptyList(object: any[]) {
    if (CommonUtilityFunctions.checkObjectAvailability(object) && object.length > 0) {
      return true;
    }
    return false;
  }

  // For setting value on <input> field type="date" - Param passed as Date signature
  public static getDateForDateInputParam(completeDateSignatureInUTC: Date) {
    const dateParam = new Date(completeDateSignatureInUTC);
    let dateValue = dateParam.getDate() > 9 ? dateParam.getDate() : ('0' + dateParam.getDate());
    let monthValue = (dateParam.getMonth() + 1) > 9 ? (dateParam.getMonth() + 1) : ('0' + (dateParam.getMonth() + 1));
    return dateParam.getFullYear() + '-' + monthValue + '-' + dateValue;    
  }

  // For setting value on <input> field type="date" - Param passed as Milliseconds
  public static getDateForDateMillisParam(millis: number) {
    const dateParam = new Date(millis);
    let dateValue = dateParam.getDate() > 9 ? dateParam.getDate() : ('0' + dateParam.getDate());
    let monthValue = (dateParam.getMonth() + 1) > 9 ? (dateParam.getMonth() + 1) : ('0' + (dateParam.getMonth() + 1));
    return dateParam.getFullYear() + '-' + monthValue + '-' + dateValue;    
  }

  // For setting value on <input> field type="time" - Param passed as Milliseconds
  public static getTimeForDateMillisParam(millis: number) {
    const dateParam = new Date(millis);
    let hoursValue = dateParam.getHours() > 9 ? dateParam.getHours() : ('0' + dateParam.getHours());
    let minutesValue = dateParam.getMinutes() > 9 ? dateParam.getMinutes() : ('0' + dateParam.getMinutes());
    return hoursValue + ':' + minutesValue;    
  }

  // Formatting Date as YYYYMMDD which is understood by the Server
  public static formatDateYYYYMMDD(completeDateSignatureInUTC: Date) {
    let dateValue = completeDateSignatureInUTC.getDate() > 9 ? completeDateSignatureInUTC.getDate() : ('0' + completeDateSignatureInUTC.getDate());
    let monthValue = (completeDateSignatureInUTC.getMonth() + 1) > 9 ? (completeDateSignatureInUTC.getMonth() + 1) : ('0' + (completeDateSignatureInUTC.getMonth() + 1));
    return completeDateSignatureInUTC.getFullYear() + '-' + monthValue + '-' + dateValue;    
  }

  // For showing Date on all UI Screens
  public static getDateStringInDDMMYYYYHHmmSS(datemillisInUTC: number) {
    if (datemillisInUTC > 0 && CommonUtilityFunctions.checkObjectAvailability(datemillisInUTC)) {
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
      const dateString = CommonUtilityFunctions.WEEKDAY_NAME_ARRAY[date_value.getDay()] 
        + ' ' + (date_value.getDate() > 9 ? date_value.getDate() : ('0' + date_value.getDate()))
        + '-' + CommonUtilityFunctions.MONTH_NAME_ARRAY[date_value.getMonth()]
        + '-' + date_value.getFullYear()
        + ' - ' + (hours > 9 ? hours : ('0' + hours))
        + ':' + (date_value.getMinutes() > 9 ? date_value.getMinutes() : ('0' + date_value.getMinutes()))
        + ' ' + am_pm;;
      return dateString;
    }
    return '';
  }

  // For showing Date (shorter version) on all UI Screens
  public static getDateStringShortVersionInDDMMYYYYHHmmSS(datemillisInUTC: number) {
    if (datemillisInUTC > 0 && CommonUtilityFunctions.checkObjectAvailability(datemillisInUTC)) {
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
        + '-' + CommonUtilityFunctions.MONTH_ABBR_NAME_ARRAY[date_value.getMonth()]
        + '-' + date_value.getFullYear()
        + ' - ' + (hours > 9 ? hours : ('0' + hours))
        + ':' + (date_value.getMinutes() > 9 ? date_value.getMinutes() : ('0' + date_value.getMinutes()))
        + ' ' + am_pm;;
      return dateString;
    }
    return '';
  }

  static getSelectedFilterItems(allowedOptions: { value: any, label: any }[], selectedValues: string) {
    if (!CommonUtilityFunctions.checkStringAvailability(selectedValues)) {
      selectedValues = '';
    }
    const selectedValuesArray = selectedValues.split(';');
    const selectedOptionsArray: any[] = [];
    for (const value of selectedValuesArray) {
      for (const option of allowedOptions) {
        if (option.value === value) {
          selectedOptionsArray.push(option);
        }
      }
    }
    return selectedOptionsArray;
  }

  public static checkStringContainsText(stringObject: string, textToSearch: string) {
    if (CommonUtilityFunctions.checkObjectAvailability(stringObject)) {
      if ('' !== stringObject.trim()) {
        if (stringObject.includes(textToSearch)) {
          return true;
        }
      }
    }
    return false;
  }

  private static getSelectedItemsValueList(selectOptions :{value:'',label:''} []) {
    let valueList : string[] = [];
    if (CommonUtilityFunctions.checkObjectAvailability(selectOptions)) {
      if (selectOptions.length > 0) {
        selectOptions.forEach( (selectOption) => {
          valueList.push(selectOption.value);
        });
      }
    }
    return valueList;
  } 

  public static convertValueOfYYYYMMDDDateToJSDate(value: string) {
    let parts: string[] = value.split('-');
    let dateValue = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return dateValue;
  }

  public static updateRecordProperty (
              key: string, 
              event: any, 
              data_type: string, 
              updatedData: any, 
              record: Object,
              deselected: boolean,
              isAllOPeration: boolean,
              predefinedValueProperty: string = null
  ) {
    switch (data_type) {
      case 'multilist' : {
        let value = event.value;
        if (isAllOPeration) {
          if (deselected) {
            updatedData[key] = 'NULLIFIED';
          } else {
            let valueList : string[] = this.getSelectedItemsValueList(event);
            if (valueList.length > 0) {
              updatedData[key] = valueList.join(';');
            } else {
              updatedData[key] = 'NULLIFIED';
            }
          }
        } else {
          let previous_selected_value = updatedData[key];
          if (!CommonUtilityFunctions.checkStringAvailability(previous_selected_value)) {
            previous_selected_value = record[key];
          }
          if ('NULLIFIED' === previous_selected_value) {
            previous_selected_value = null;
          }
          let previous_selected_value_array = CommonUtilityFunctions.checkStringAvailability(previous_selected_value) ? previous_selected_value.split(';') : [];
          if (deselected) {
            if (previous_selected_value.length > 0) {
              previous_selected_value_array.splice(previous_selected_value_array.indexOf(value), 1); 
            }
          } else {
            previous_selected_value_array.push(value);
          }
          if (previous_selected_value_array.length > 0) {
            updatedData[key] = previous_selected_value_array.join(';');
          } else {
            updatedData[key] = 'NULLIFIED';
          }
        }
        break;
      }
      case 'list': { 
        let value = event.value;
        if (deselected) {
          updatedData[key] = 'NULLIFIED';
        } else {
          updatedData[key] = value.toString();
        }      
        break;
      }
      case 'millis' : {
        let value = event.target.valueAsNumber;   
        updatedData[key] = value.toString();
        updatedData['localTimezoneOffsetInMilliseconds'] = (new Date().getTimezoneOffset() * 60 * 1000).toString();
        break;
      }
      case 'date' : {
        updatedData[key] = CommonUtilityFunctions.formatDateYYYYMMDD((new Date(event.target.valueAsNumber + (new Date().getTimezoneOffset() * 60 * 1000))));
        break;
      }
      case 'string' : {
        let value = event.target.value;
        if (CommonUtilityFunctions.checkStringAvailability(value)) {
          updatedData[key] = value;
        } else {
          updatedData[key] = 'NULLIFIED';
        }
        break;
      }
      case 'direct_value' : {
        let value = event;
        if (CommonUtilityFunctions.checkStringAvailability(value.toString())) {
          updatedData[key] = value.toString();
        } else {
          updatedData[key] = 'NULLIFIED';
        }
        break;
      }
      case 'predefined_value' : {
        if (CommonUtilityFunctions.checkStringAvailability(predefinedValueProperty)) {
          switch (predefinedValueProperty) {
            case AppConstants.VARIABLE_LOCAL_TZ_OFFSET_MS : {
              updatedData['localTimezoneOffsetInMilliseconds'] = (new Date().getTimezoneOffset() * 60 * 1000).toString();
              break;
            }
          }
        }
        break;
      }   
      default : {
        let value = event.target.value;
        if (CommonUtilityFunctions.checkStringAvailability(value.toString())) {
          updatedData[key] = value.toString();
        } else {
          updatedData[key] = 'NULLIFIED';
        }
        break;
      }
    }   
  }

  public static getDataFromRichEditor(editorId: string): string {
    return CKEDITOR.instances[editorId].getData();
  }

  public static setDataForRichEditor(editorId: string, data: string) {
    CKEDITOR.instances[editorId].setData(data);
  }

  public static makeRichEditor(editorId: string, configuration: any) {
    CKEDITOR.replace(editorId, configuration);
  }

  public static makeRichEditorWithDefaultConfiguration(editorId: string) {
    CKEDITOR.replace(editorId, CkeditorConfig.defaultConfiguration);
  }
  
  public static encodeFormDataToUpdatedJSONWithParentSerialId(updatedValues: any, parentSerialId: any) {
    const formData = new FormData();
    formData.append('completeUpdatedRecord', JSON.stringify(updatedValues));
    formData.append('parentSerialId', parentSerialId);
    return formData;
  }

  public static removeHTMLBRTagsFromServerResponse(responseString: string) {
    if (CommonUtilityFunctions.checkStringAvailability(responseString)) {
      let brRemovedHtmlString: string = responseString.replace(/\<BR\/\>/g, '\n');
      if (brRemovedHtmlString.indexOf('\n') == 0) {
        brRemovedHtmlString = brRemovedHtmlString.replace('\n','');
      }
      return brRemovedHtmlString;
    }
    return '';
  }

  public static searchItemsInStringListThatHasSearchedSubstring(stringList: string[], substring: string, caseSensitiveSearch: boolean = false) {
    let searchedStringItemList: string[] = stringList;
    if (this.checkObjectAvailability(stringList) && stringList.length > 0 && this.checkStringAvailability(substring)) {
      substring = substring.trim();
      searchedStringItemList = [];
      for(var index = 0; index < stringList.length; index++) {
        let stringItem: string = stringList[index];
        if (this.checkStringAvailability(stringItem)) {
          if (caseSensitiveSearch) {
            if (stringItem.indexOf(substring) !== -1) {
              searchedStringItemList.push(stringItem);
            }
          } else {
            if (stringItem.toUpperCase().indexOf(substring.toUpperCase()) !== -1) {
              searchedStringItemList.push(stringItem);
            }
          }
        }
      }
    }
    return searchedStringItemList;
  }

  public static calculateRemainingHoursMinutesSecondsFromTotalAndCompletedHoursMinutesSeconds(
    totalHours: number,
    totalMinutes: number,
    totalSeconds: number,
    completedHours: number,
    completedMinutes: number,
    completedSeconds: number
  ) {
    if (!CommonUtilityFunctions.checkObjectAvailability(totalHours) || totalHours < 1) {
      totalHours = 0;
    }
    if (!CommonUtilityFunctions.checkObjectAvailability(totalMinutes) || totalMinutes < 1) {
      totalMinutes = 0;
    }
    if (!CommonUtilityFunctions.checkObjectAvailability(totalSeconds) || totalSeconds < 1) {
      totalSeconds = 0;
    }
    if (!CommonUtilityFunctions.checkObjectAvailability(completedHours) || completedHours < 1) {
      completedHours = 0;
    }
    if (!CommonUtilityFunctions.checkObjectAvailability(completedMinutes) || completedMinutes < 1) {
      completedMinutes = 0;
    }
    if (!CommonUtilityFunctions.checkObjectAvailability(completedSeconds) || completedSeconds < 1) {
      completedSeconds = 0;
    }
    let calculateTotalDurationInSeconds: number = (totalHours * 60 * 60) + (totalMinutes * 60) + totalSeconds;
    let calculateCompletedDurationInSeconds: number = (completedHours * 60 * 60) + (completedMinutes * 60) + completedSeconds;
    return CommonUtilityFunctions.calculateGapInTime(calculateTotalDurationInSeconds, calculateCompletedDurationInSeconds);
  }

  public static calculateIntervalHoursMinutesSecondsFromStartMillisecondsAndEndMilliseconds(
    startMillis: number,
    endMillis: number
  ) {
    if (!CommonUtilityFunctions.checkObjectAvailability(startMillis) || startMillis < 1) {
      startMillis = 0;
    }
    if (!CommonUtilityFunctions.checkObjectAvailability(endMillis) || endMillis < 1) {
      endMillis = 0;
    }
    let calculateTotalDurationInSeconds: number = Math.ceil(endMillis / 1000);
    let calculateCompletedDurationInSeconds: number = Math.ceil(startMillis / 1000);
    return CommonUtilityFunctions.calculateGapInTime(calculateTotalDurationInSeconds, calculateCompletedDurationInSeconds);
  }

  private static calculateGapInTime(totalDurationInSeconds: number, completedDurationInSeconds: number) {
    let remainingTime: {
      remainingHours: number,
      remainingMinutes: number,
      remainingSeconds: number,
      overdueHours: number,
      overdueMinutes: number,
      overdueSeconds: number,
      isOverdue: boolean
    } = {
      remainingHours: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      overdueHours: 0,
      overdueMinutes: 0,
      overdueSeconds: 0,
      isOverdue: (completedDurationInSeconds > totalDurationInSeconds)
    };
    let calculateGapDurationInSeconds: number = remainingTime.isOverdue 
                            ? (completedDurationInSeconds - totalDurationInSeconds)
                            : (totalDurationInSeconds - completedDurationInSeconds);
    let gapInHours: number = Math.floor(calculateGapDurationInSeconds / 3600);
    let gapInMinutes: number = Math.floor((calculateGapDurationInSeconds - (gapInHours * 3600)) / 60);
    let gapInSeconds: number = calculateGapDurationInSeconds - ((gapInHours * 3600) + (gapInMinutes * 60));
    if (remainingTime.isOverdue) {
      remainingTime.overdueHours = gapInHours;
      remainingTime.overdueMinutes = gapInMinutes;
      remainingTime.overdueSeconds = gapInSeconds;
    } else {
      remainingTime.remainingHours = gapInHours;
      remainingTime.remainingMinutes = gapInMinutes;
      remainingTime.remainingSeconds = gapInSeconds;
    }
    return remainingTime;
  }

  public static extractGridRecordObject(response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any      
    } = {
      record: null,
      isError: false,
      errorMessage: null,
      responseMessage: null,
      additionalProperties: {}
    };
    
    if (response['success']) {
      if (CommonUtilityFunctions.checkObjectAvailability(response['recordObject'])) {
        gridRecordObject.record = new GridRecord('CustomObject-M-UI0', response['recordObject']);
        for (const propertyName in response) {
          if (propertyName !== 'success' && propertyName !== 'recordObject' && propertyName !== 'message') {
            gridRecordObject.additionalProperties[propertyName] = response[propertyName];
          }
        }
      } else {        
        gridRecordObject.isError = true;
        gridRecordObject.errorMessage = 'No object found';
      }
    } else {
      gridRecordObject.isError = true;
      gridRecordObject.errorMessage = response['message'];
    }
    gridRecordObject.responseMessage = response['message'];

    return gridRecordObject;
  }

  public static setHTMLInputElementValue(elementId: string, elementValue: any) {
    elementValue = CommonUtilityFunctions.checkObjectAvailability(elementValue) ? elementValue.toString() : '';
    const element: HTMLInputElement = <HTMLInputElement>document.getElementById(elementId);
    if (CommonUtilityFunctions.checkObjectAvailability(element)) {
      if (!CommonUtilityFunctions.checkStringAvailability(elementValue)) {
        elementValue = '';
      }
      element.value = elementValue;
    } else {
      CommonUtilityFunctions.logOnConsole('Element with HTML ID - ' + elementId + ' does not exists, hence cannot set value = ' + elementValue, true);
    }
  }

  public static getHTMLInputElementValue(elementId: string) {
    const element: HTMLInputElement = <HTMLInputElement>document.getElementById(elementId);
    if (CommonUtilityFunctions.checkObjectAvailability(element)) {
      return element.value;
    } else {
      CommonUtilityFunctions.logOnConsole('Element with HTML ID - ' + elementId + ' does not exists, hence cannot get value');
    }
    return null;
  }

  public static logOnConsole(messageOrObject: any, isError: boolean = false, event: Event = null) {
    if (EnvironmentConstants.IS_LOGGING_ENABLED) {
      if (isError) {
        if (EnvironmentConstants.IS_ERROR_LOGGING_ENABLED) {
          if (CommonUtilityFunctions.checkObjectAvailability(event)) {
            console.error(messageOrObject, event);
          } else {
            console.error(messageOrObject);
          }
        }
      } else {
        if (EnvironmentConstants.IS_DEBUG_LOGGING_ENABLED) {
          if (CommonUtilityFunctions.checkObjectAvailability(event)) {
            console.log(messageOrObject, event);
          } else {
            console.log(messageOrObject);
          }
        }
      }
    }
  }

  public static decodeTrueFalseFromYN(yesNoResponse: string, nonCaseSensitive: boolean = false) {
    return (CommonUtilityFunctions.checkStringAvailability(yesNoResponse) && ('Y' === yesNoResponse || (nonCaseSensitive && 'y' === yesNoResponse)));      
  }

  public static getAllIdsStringFromPropertyAndAlternatePropertyList(selectedPropertyList: any[], selectedAlternatePropertyList: any[]): string {
    let allIdsListString: string = '';
    if (CommonUtilityFunctions.checkNonEmptyList(selectedPropertyList)) {
      allIdsListString += selectedPropertyList.join(';');
    }
    if (CommonUtilityFunctions.checkNonEmptyList(selectedAlternatePropertyList)) {
      allIdsListString += ':';
      allIdsListString += selectedAlternatePropertyList.join(';');
    }
    return allIdsListString;
  }
}