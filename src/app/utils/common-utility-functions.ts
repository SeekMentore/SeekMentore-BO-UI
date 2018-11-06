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
}