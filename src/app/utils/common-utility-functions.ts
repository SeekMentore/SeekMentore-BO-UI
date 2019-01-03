import { CkeditorConfig } from "./ckeditor-config";
import { GridRecord } from "./grid/grid-record";

declare var CKEDITOR: any;

export class CommonUtilityFunctions {

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

  public static getDateForDateInputParam(completeDateSignatureInUTC: Date) {
    const dateParam = new Date(completeDateSignatureInUTC);
    let dateValue = dateParam.getDate() > 9 ? dateParam.getDate() : ('0' + dateParam.getDate());
    let monthValue = (dateParam.getMonth() + 1) > 9 ? (dateParam.getMonth() + 1) : ('0' + (dateParam.getMonth() + 1));
    return dateParam.getFullYear() + '-' + monthValue + '-' + dateValue;    
  }

  public static formatDateYYYYMMDD(completeDateSignatureInUTC: Date) {
    let dateValue = completeDateSignatureInUTC.getDate() > 9 ? completeDateSignatureInUTC.getDate() : ('0' + completeDateSignatureInUTC.getDate());
    let monthValue = (completeDateSignatureInUTC.getMonth() + 1) > 9 ? (completeDateSignatureInUTC.getMonth() + 1) : ('0' + (completeDateSignatureInUTC.getMonth() + 1));
    return completeDateSignatureInUTC.getFullYear() + '-' + monthValue + '-' + dateValue;    
  }

  public static getDateStringInDDMMYYYYHHmmSS(datemillisInUTC: number) {
    if (datemillisInUTC > 0 && CommonUtilityFunctions.checkObjectAvailability(datemillisInUTC)) {
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

  static getSelectedFilterItems(allowedOptions: { value: any, label: any }[], selectedValues: string) {
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
        })
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
              record: GridRecord,
              deselected: boolean,
              isAllOPeration: boolean
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
            previous_selected_value = record.getProperty(key);
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
        let value = event.target.valueAsDate;
        updatedData[key] = CommonUtilityFunctions.formatDateYYYYMMDD(value);
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

  public static encodedGridFormData(updatedValues: any, parentId: any) {
    const formData = new FormData();
    formData.append('completeUpdatedRecord', JSON.stringify(updatedValues));
    formData.append('parentId', parentId);
    return formData;
  }

  public static removeHTMLBRTagsFromServerResponse(responseString: string) {
    return CommonUtilityFunctions.checkStringAvailability(responseString) ? responseString.replace(/\<BR\/\>/g, '\n').replace('\n','') : '';
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
}