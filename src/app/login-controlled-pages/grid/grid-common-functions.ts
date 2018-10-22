import {Column} from './column';
import {Record} from './record';

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

  public static displayDetailsForRecord(dialogTitleText: string, dialogData: any) {
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
    closeButton.style.cssFloat = 'right';
    closeButton.style.paddingTop = '0';
    closeButton.style.paddingRight = '0';

    const dialogTitle: HTMLSpanElement = document.createElement('div');
    dialogTitle.innerHTML = '<b>' + dialogTitleText + '</b>';
    dialogTitle.style.width = '100%';
    dialogTitle.style.marginTop = '10px';
    dialogTitle.style.marginBottom = '10px';
    dialogTitle.style.textAlign = 'center';

    const headerDiv: HTMLDivElement = document.createElement('div');
    headerDiv.style.display = 'block';
    headerDiv.style.width = '100%';
    headerDiv.appendChild(closeButton);
    headerDiv.appendChild(dialogTitle);
    dialogModal.appendChild(headerDiv);

    const contentTable = document.createElement('table');
    dialogModal.appendChild(contentTable);
    contentTable.style.maxHeight = '400px';
    contentTable.style.overflowY = 'auto';
    contentTable.style.width = '95%';


    for (const key in dialogData) {
      const dataRow = document.createElement('tr');
      dataRow.innerHTML = '<td><b>' + key + ' :</b></td> ' + '<td>' + dialogData[key] + '</td>';
      dataRow.style.margin = '5px 10px';
      dataRow.style.padding = '3px';
      // dataDiv.noWrap = false;
      // dataDiv.style.maxHeight = '40px';
      contentTable.appendChild(dataRow);
    }


    document.body.appendChild(dialog);
  }
}
