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

  public static getDateForDateInputParam(value: any) {
    const dateParam = new Date(value);
    let dateValue = dateParam.getDate() > 9 ? dateParam.getDate() : ('0' + dateParam.getDate());
    let monthValue = (dateParam.getMonth() + 1) > 9 ? (dateParam.getMonth() + 1) : ('0' + (dateParam.getMonth() + 1));
    return dateParam.getUTCFullYear() + '-' + monthValue + '-' + dateValue;    
  }

  public static getDateStringInDDMMYYYYHHmmSS(datemillis: number) {
    if (CommonUtilityFunctions.checkObjectAvailability(datemillis)) {
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
              value: string, 
              data_type: string, 
              updatedData: any, 
              record: GridRecord,
              event: any = null, 
              deselected: boolean = false,
              isAllOPeration: boolean = false
  ) {
    switch (data_type) {
      case 'multilist' : {
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
        if (deselected) {
          updatedData[key] = 'NULLIFIED';
        } else {
          updatedData[key] = value;
        }      
        break;
      }
      case 'millis' : {
        let millisValue = CommonUtilityFunctions.convertValueOfYYYYMMDDDateToJSDate(value).getTime();        
        updatedData[key] = millisValue;
        break;
      }
      case 'date' : {        
        updatedData[key] = value;
        break;
      }
      case 'string' : {
        if (CommonUtilityFunctions.checkStringAvailability(value)) {
          updatedData[key] = value;
        } else {
          updatedData[key] = 'NULLIFIED';
        }
        break;
      }      
      default : {
        if (CommonUtilityFunctions.checkStringAvailability(value.toString())) {
          updatedData[key] = value;
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
}