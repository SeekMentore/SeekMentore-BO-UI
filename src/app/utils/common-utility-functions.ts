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

  static updateRecordProperty(key: string, value: string, data_type: string, updatedData: any, parentRecord: any) {
    switch (data_type) {
      case 'list':
        let previous_value = updatedData[key];
        if (!previous_value) {
          previous_value = parentRecord.property[key];
        }
        const previous_value_array = previous_value.split(';');
        if (previous_value_array.includes(value)) {
          previous_value_array.splice(previous_value_array.indexOf(value), 1);

        } else {
          previous_value_array.push(value);
        }
        updatedData[key] = previous_value_array.join(';');
        break;
      default:
        updatedData[key] = value;
    }   
  }
}