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

  public static displayDetailsForRecord(record: Record, column: Column) {
    const dialog: HTMLDivElement = document.createElement('div');
    dialog.setAttribute('class', 'dialog');
    const dialogModal: HTMLDivElement = document.createElement('div');
    dialog.appendChild(dialogModal);
    dialogModal.setAttribute('class', 'dialog_modal');

    const closeButton: HTMLSpanElement = document.createElement('span');
    closeButton.innerHTML = '<i class=\'fas fa-times\' style=\'color: var(--colorPrimary); align-self: flex-end; margin: 0px; cursor: pointer;\'></i>';
    closeButton.onclick = (ev) => {
      document.body.removeChild(dialog);
    };
    closeButton.style.padding = '4px';
    dialogModal.appendChild(closeButton);


    const dialogTitle: HTMLSpanElement = document.createElement('div');
    dialogTitle.innerText = 'Record Details';
    dialogTitle.style.fontWeight = '600';
    dialogTitle.style.alignSelf = 'centre';

    const headerDiv: HTMLDivElement = document.createElement('div');
    headerDiv.style.display = 'flex';
    headerDiv.style.width = '100%';
    headerDiv.appendChild(dialogTitle);
    headerDiv.appendChild(closeButton);
    dialogModal.appendChild(headerDiv);

    const contentDiv = document.createElement('div');
    dialogModal.appendChild(contentDiv);
    contentDiv.style.maxHeight = '400px';
    contentDiv.style.overflowY = 'auto';
    contentDiv.style.width = '100%';

    const displayData = {
      'Initiate Date': (new Date(record.getProperty('initiatedDateMillis'))).toDateString(),
      'Subject': record.getProperty('subject'),
      'Initiated By': record.getProperty('initiatedBy'),
      'Due Date': record.getProperty('dueDateMillis'),
      'Action Date': (new Date(record.getProperty('actionDateMillis'))).toDateString(),
      'Action By': record.getProperty('actionBy')
    };

    for (const key in displayData) {
      const dataDiv = document.createElement('div');
      dataDiv.innerHTML = key + ' : ' + displayData[key];
      dataDiv.style.margin = '5px 10px';
      dataDiv.style.padding = '10px';
      dataDiv.style.border = '1px solid var(--colorPrimary)';
      dataDiv.noWrap = false;
      // dataDiv.style.maxHeight = '40px';
      contentDiv.appendChild(dataDiv);
    }


    document.body.appendChild(dialog);
  }
}
