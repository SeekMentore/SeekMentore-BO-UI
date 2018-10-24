import { Column } from './column';
import { Record } from './record';
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

  public static lookupRenderer(record: Record, column: Column, lookupList: any []) {
    var value = column.getValueForColumn(record);        
    return this.lookupRendererForValue(value, lookupList);
  }

  private static lookupRendererForValue(value: any, lookupList: any []) {
    lookupList.forEach(filterOption => {
      if (filterOption.value === value) {
        return filterOption.label
      } 
    });    
    return value;
  }
  
  public static lookupMultiRenderer(record: Record, column: Column, lookupList: any [], valueSplitter: string) {
    var multivalue = column.getValueForColumn(record);     
    return this.lookupMultiRendererForValue(multivalue.split(valueSplitter), lookupList);
  }

  private static lookupMultiRendererForValue(multivalueSplittedList: any [], lookupList: any []) {
    var returnHTML = '';
    multivalueSplittedList.forEach(splittedValue => {
      var found: boolean = false;
      returnHTML += this.lookupRendererForValue(splittedValue, lookupList) + '<br/>';      
    });    
    return returnHTML;
  }
  
  public static yesNoRenderer(record, column) {
    return this.lookupRenderer(record, column, CommonFilterOptions.yesNoFilterOptions); 
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
    dialogTitle.innerHTML = '<b><u>' + dialogTitleText + '</u></b>';
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
    contentTable.cellPadding = '5';
    contentTable.style.border = '1px solid blue';

    var counter = 0;
    for (const key in dialogData) {
      const dataRow = document.createElement('tr');
      dataRow.innerHTML = '<td width="25%"><b>' + key + '</b></td><td>' + dialogData[key] + '</td>';
      dataRow.style.margin = '5px 10px';
      dataRow.style.padding = '3px';     
      if (counter%2 == 0) {
        dataRow.style.backgroundColor = 'lightgray';
      } 
      contentTable.appendChild(dataRow);
      counter++;
    }

    const dismissButton = document.createElement('button');
    dialogModal.appendChild(dismissButton);
    dismissButton.className = 'cancel-button';
    dismissButton.innerHTML = 'Dismiss';
    dismissButton.onclick = (ev) => {
      document.body.removeChild(dialog);
    };

    document.body.appendChild(dialog);
  }
}
