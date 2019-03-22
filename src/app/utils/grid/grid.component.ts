import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AppUtilityService } from '../../utils/app-utility.service';
import { HelperService } from '../../utils/helper.service';
import { LcpConstants } from "../../utils/lcp-constants";
import { MultiSelectInputData } from '../../utils/multi-select-input/multi-select-input.component';
import { AlertDialogEvent } from '../alert-dialog/alert-dialog.component';
import { ActionButton } from './action-button';
import { Column } from './column';
import { Grid } from './grid';
import { ColumnExtraDataDisplayInputData } from './grid-column-extra-data/grid-column-extra-data.component';
import { GridCommonFunctions } from './grid-common-functions';
import { GridConstants } from './grid-constants';
import { GridRecord } from './grid-record';
import { RecordDisplayInputData } from './grid-record-pop-up/grid-record-pop-up.component';
import { Sorter, SortingOrder } from './sorter';
import { Filter } from './filter';
import { CommonUtilityFunctions } from '../common-utility-functions';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {

  htmlDomElementId: string;
  idForModalPopUp: string;
  hidden = true;
  mulit_select_input_data: MultiSelectInputData = null;
  record_display_input_data: RecordDisplayInputData = null;
  column_extra_data_display_input: ColumnExtraDataDisplayInputData = null;
  grid: Grid;

  @Input()
  gridMetaData: GridDataInterface;

  constructor(public utility_service: AppUtilityService,
              private helperService: HelperService) {
  }

  ngOnInit() {
    const recordDisplayInput: RecordDisplayInputData = {
      titleText: 'Record Details', 
      data: []
    };   
    this.record_display_input_data = recordDisplayInput;

    const columnExtraDataDisplayInput: ColumnExtraDataDisplayInputData = {
      titleText: 'Record Details', 
      dataText: '',
      column: null,
      record: null,
      multiList: false,
      hasClickEventHandlerAttached: false
    };   
    this.column_extra_data_display_input = columnExtraDataDisplayInput;
  }

  ngAfterViewInit() {    
  }  

  public init() {
    this.htmlDomElementId = this.gridMetaData.htmlDomElementId;
    this.grid = null;
    if (GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid)) {
      const pagingCapable = GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.pagingCapable) ? this.gridMetaData.grid.pagingCapable : true;
      const hasSelectionColumn = GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.hasSelectionColumn) ? this.gridMetaData.grid.hasSelectionColumn : false;
      const hasActionColumn = GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.hasActionColumn) ? this.gridMetaData.grid.hasActionColumn : false
      this.grid = new Grid(
        GridCommonFunctions.checkStringAvailability(this.gridMetaData.grid.id) ? this.gridMetaData.grid.id : this.htmlDomElementId,
        GridCommonFunctions.checkStringAvailability(this.gridMetaData.grid.title) ? this.gridMetaData.grid.title : this.htmlDomElementId,
        this.gridMetaData.grid.store, /**Assign a default store here */
        GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.columns) ? this.gridMetaData.grid.columns : [],
        pagingCapable,
        pagingCapable ? (GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.recordsPerPage) ? this.gridMetaData.grid.recordsPerPage : null) : null,
        GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.sortable) ? this.gridMetaData.grid.sortable : true,
        GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.filterable) ? this.gridMetaData.grid.filterable : true,
        hasSelectionColumn,
        hasSelectionColumn ? (GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.selectionColumn) ? this.gridMetaData.grid.selectionColumn : null) : null,
        hasActionColumn,
        hasActionColumn ? (GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.actionColumn) ? this.gridMetaData.grid.actionColumn : null) : null,
        GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.offline) ? this.gridMetaData.grid.offline : false,
        GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.onlineOfflineToggle) ? this.gridMetaData.grid.onlineOfflineToggle : false,
        GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.isCollapsable) ? this.gridMetaData.grid.isCollapsable : true,
        GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.collapsed) ? this.gridMetaData.grid.collapsed : false
      );
    }
    this.hidden = this.gridMetaData.hidden;
    this.idForModalPopUp = this.grid.id;
    
    setTimeout(() => {
      this.hideShowRemoveFilterTab();
    }, 1000);
  }

  public addExtraParams(paramKey: string, paramValue: Object) {
      this.grid.addExtraParams(paramKey, paramValue);
  }

  public showMessageOnGridStoreLoadFailure(errorMessage: string) {
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: errorMessage,
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
    return;
  }

  public loadNextPage() {
    if (this.grid.isPagingCapable) {
      if (this.grid.paginator.navigateNextPage()) {
        this.grid.loadData(this);
        return;
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'This is the last page, cannot navigate to next page.',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Paging capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public loadPreviousPage() {
    if (this.grid.isPagingCapable) {
      if (this.grid.paginator.navigatePreviousPage()) {
        this.grid.loadData(this);
        return;
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'This is the first page, cannot navigate to previous page.',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Paging capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public goToPageNumber(pageNum) {
    if (this.grid.isPagingCapable) {
      if (this.grid.paginator.navigateToPage(pageNum)) {
        this.grid.loadData(this);
        return;
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Cannot navigate to Page : "' + pageNum + '". Please enter a page between 1 - ' + this.grid.paginator.totalPages,
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Paging capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public collapseGrid() {
    this.grid.stateExpanded = false;
  }

  public expandGrid() {
    this.grid.stateExpanded = true;
  }

  public downloadGridData() {
    if (!this.grid.store.downloadGridData(this.grid, this)) {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Download capability not coded',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
    }
  }

  public showGridHelpComponentPopup() {
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Help component unavailable right now',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public applyFilter() {
    if (this.grid.isFilterCapable) {
      if (!this.grid.offline) {
        this.grid.filters = [];
        for (const column of this.grid.columns) {
          if (column.isFiltered) {
            this.grid.filters.push(column.filter);
          }
        }
        this.grid.paginator.navigateToFirstPage();
        this.grid.loadData(this);
      } else {
        this.filterRecords();
      }
      this.hideShowRemoveFilterTab();
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Filter capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public resetFilter() {
    if (this.grid.isFilterCapable) {
      this.grid.filters = [];
      for (const column of this.grid.columns) {
        column.isFiltered = false;
        this.removeFilterFromColumn(column);
      }
      if (!this.grid.offline) {
        this.grid.paginator.navigateToFirstPage();
        this.grid.loadData(this);
      } else {
        this.filterRecords();
      }
      this.hideShowRemoveFilterTab();
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Filter capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public toggleRemoteLoad(event: any) {
    if (event === 'ONLINE') {
      this.grid.offline = false;
    } else {
      this.grid.offline = true;
    }
  }

  public sortToggle(sorter: Sorter, sortOrder: SortingOrder) {
    if (this.grid.isSortingCapable) {
      sorter.order = sortOrder;
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Sorting capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public sortColumn(column: Column, sortOrder: SortingOrder) {
    if (this.grid.isSortingCapable) {
      if (column.sortable) {
        let sorterExists = false;
        this.grid.sorters.forEach(sorter => {
          if (sorter.columnId === column.id) {
            if (sorter.order !== sortOrder) {
              sorter.order = sortOrder;
            }
            sorterExists = true;
          }
        });
        if (sorterExists) {
          return;
        }
        this.grid.sorters.push(new Sorter(column.id + '-sorter', column.dataType, column.mapping, column.id, column.headerName, sortOrder, column.clubbedMapping, column.clubbedProperties));
        return;
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Column does not have Sorting capability',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Sorting capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public removeSorterFromSorterList(sorter: Sorter) {
    if (this.grid.isSortingCapable) {
      for (let i = 0; i < this.grid.sorters.length; i++) {
        if (this.grid.sorters[i].id === sorter.id) {
          this.grid.sorters.splice(i, 1);
        }
      }
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Sorting capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public applySorter() {
    if (this.grid.isSortingCapable) {
      if (!this.grid.offline) {
        this.grid.loadData(this);
      } else {
        this.sortRowRecordData();
      }
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Sorting capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public resetSorter() {
    if (this.grid.isSortingCapable) {
      this.grid.sorters = [];
      if (!this.grid.offline) {
        this.grid.loadData(this);
      } else {
        this.sortRowRecordData();
      }
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Sorting capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public selectionColumnSelectUnselectAll(element: HTMLInputElement) {
    if (this.grid.hasSelectionColumn) {
      for (const record of this.grid.filtered_records) {
        const checkBox = document.getElementById('uigrid-' + this.grid.id + '-uigrid-row-grid-record-' + record.id + '-uigrid-cell-select-box' + '-input-checkbox');
        if (checkBox) {
          (<HTMLInputElement>checkBox).checked = element.checked;
        }
      }
      this.grid.store.setAllRecordsSelectedOrUnSelected(element.checked);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have SelectionColumn',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public removeFilterFromColumn(column: Column) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const columnFilter = column.filter;
        column.isFiltered = false;
        columnFilter.nullifyFilterProperties();
        if (column.dataType === 'list') {
          column.filterOptions.forEach(filterOption => {
            filterOption.isSelected = false;
          });
        }
        this.hideShowRemoveFilterTab(column);
        return;
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Column does not have Filter capability',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Filter capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public hideColumn(column: Column) {
    if (column.hideable) {
      column.hidden = true;
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Column does not have Hide capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public columnFilteredTextChanged(column: Column, element: HTMLInputElement) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const filter = column.filter;
        filter.stringValue = element.value;
        column.isFiltered = (filter.stringValue && filter.stringValue.trim() !== '');
        this.hideShowRemoveFilterTab(column);
        return;
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Column does not have Filter capability',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Filter capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public toggleCaseSensitiveSearch(column: Column, caseSensitive: boolean) {
    column.filter.textCaseSensitiveSearch = caseSensitive;
  }

  public columnFilteredNumberChanged(column: Column, element: HTMLInputElement, field: string) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const filter: Filter = column.filter;
        const stringValue: string = element.value
        if (GridCommonFunctions.checkStringAvailability(stringValue)) {
          const numberValue: number = parseInt(stringValue);
          if (isNaN(numberValue)) {
            const myListener: AlertDialogEvent = {
              isSuccess: false,
              message: 'Please provide valid number in ' + field + ' filter for ' + column.headerName,
              onButtonClicked: () => {
              }
            };
            this.helperService.showAlertDialog(myListener);
            return;
          } else {
            if (field === 'GT') {
              filter.greaterThan = numberValue;
            } else if (field === 'EQ') {
              filter.equalTo = numberValue;
            } else if (field === 'LT') {
              filter.lessThan = numberValue;
            } 
          }          
        } else {
          if (field === 'GT') {
            filter.greaterThan = null;
          } else if (field === 'EQ') {
            filter.equalTo = null;
          } else if (field === 'LT') {
            filter.lessThan = null;
          } 
        }
        if (GridCommonFunctions.checkObjectAvailability(filter.greaterThan)
            || GridCommonFunctions.checkObjectAvailability(filter.equalTo)
            || GridCommonFunctions.checkObjectAvailability(filter.lessThan)) {
              column.isFiltered = true;
        } else {
          column.isFiltered = false;
        }
        this.hideShowRemoveFilterTab(column);
        return;  
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Column does not have Filter capability',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Filter capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public columnFilteredDateChanged(column: Column, datePickerValue: any, label: HTMLElement, field: string) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
        const filter: Filter = column.filter;
        const localTimezoneOffsetInMilliseconds: number = (new Date().getTimezoneOffset() * 60 * 1000);
        if (field === 'After') {
          filter.afterDate = date_value;
          filter.afterDateMillis = date_value.getTime() - localTimezoneOffsetInMilliseconds;
        } else if (field === 'On') {
          filter.onDate = date_value;
          filter.onDateMillis = date_value.getTime() - localTimezoneOffsetInMilliseconds;
        } else if (field === 'Before') {
          filter.beforeDate = date_value;
          filter.beforeDateMillis = date_value.getTime() - localTimezoneOffsetInMilliseconds;
        }        
        label.innerHTML = date_value.getDate() + '/' + (date_value.getMonth() + 1) + '/' + (date_value.getFullYear() % 100);
        column.isFiltered = true;
        this.hideShowRemoveFilterTab(column);
        return;
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Column does not have Filter capability',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Filter capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public addListFilterQuery(column: Column) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const filter = column.filter;
        filter.listValue = [];
        column.filterOptions.forEach((filterOption) => {
          if (filterOption.isSelected) {
            filter.listValue.push(filterOption.value);
          }
        });
        if (filter.listValue.length > 0) {
          column.isFiltered = true;
        } else {
          column.isFiltered = false;
        }
        this.hideShowRemoveFilterTab(column);
        return;
      }
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Column does not have Filter capability',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have Filter capability',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public selectionButtonCheckedUnchecked(record: GridRecord, element: HTMLInputElement) {
    if (this.grid.hasSelectionColumn) {
      if (record !== null) {
        record.selectionModelCheck = element.checked;
      }
      return;
    }
    const myListener: AlertDialogEvent = {
      isSuccess: false,
      message: 'Grid does not have SelectionColumn',
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
  }

  public refreshGridData() {
    this.grid.loadData(this);
  }

  /** REVIEW */
  public showMultiSelectFilter(column: Column, sourceButton: HTMLElement) {
    if (column.filterOptions === null || column.filterOptions.length === 0) {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Column does not have any FilterOptions for List Filter',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
      return;
    }
    const filterData: MultiSelectInputData = {
      operation: 'column_filter',
      meta_data: {
        columnId: column.id,
        sourceButton: sourceButton,
        title: column.headerName + LcpConstants.grid_column_list_filter_dialog_header_suffix
      },
      data: []
    };
    column.filterOptions.forEach((filterOption) => {
      filterData.data.push({
        label: filterOption.label,
        value: filterOption.value,
        enabled: true,
        selected: filterOption.isSelected
      });
    });
    this.showMulitSelectInput(filterData);
  }

  public showColumnHideComponentPopup() {
    const columnData: MultiSelectInputData = {
      operation: 'hide_show_column',
      meta_data: {
        title: 'Column Show/Hide'
      },
      data: []
    };
    for (const column of this.grid.columns) {
      columnData.data.push({
        label: column.headerName,
        value: column.id,
        enabled: column.hideable,
        selected: column.hidden
      });
    }
    this.showMulitSelectInput(columnData);
  }
  
  public closeMultiSelectInput() {
    document.getElementById('multi-select-' + this.idForModalPopUp + '-dialog').hidden = true;
  }  

  public showMulitSelectInput(data: MultiSelectInputData) {
    this.mulit_select_input_data = data;
    document.getElementById('multi-select-' + this.idForModalPopUp + '-dialog').hidden = false;
  }

  public displayRecordAsPopUp(titleText: string = 'Record Data', dialogData: any) {
    let data :any [] = [];
    for (const key in dialogData) {
      data.push({
        label: key,
        value: dialogData[key]
      });
    }
    const recordDisplayInput: RecordDisplayInputData = {
      titleText: titleText, 
      data: data
    };    
    this.showRecordDisplayPopUp(recordDisplayInput);
  }

  public dismissRecordDisplayPopUp() {
    document.getElementById('record-display-pop-up-' + this.idForModalPopUp + '-dialog').hidden = true;
  }

  public showRecordDisplayPopUp(recordDisplayInput: RecordDisplayInputData) {
    this.record_display_input_data = recordDisplayInput;
    document.getElementById('record-display-pop-up-' + this.idForModalPopUp + '-dialog').hidden = false;
  }

  public displayColumnExtraDataAsPopUp(titleText: string = 'Column Data', dataText: string, record: GridRecord, column: Column, hasClickEventHandlerAttached: boolean) {   
    const columnExtraDataDisplayInput: ColumnExtraDataDisplayInputData = {
      titleText: titleText, 
      dataText: dataText,
      column: column,
      record: record,
      multiList: column.multiList,
      hasClickEventHandlerAttached: hasClickEventHandlerAttached
    };    
    this.showColumnExtraDataDisplayPopUp(columnExtraDataDisplayInput);
  }

  public dismissColumnExtraDataDisplayPopUp() {
    document.getElementById('column-extra-data-display-pop-up-' + this.idForModalPopUp + '-dialog').hidden = true;
  }

  public showColumnExtraDataDisplayPopUp(columnExtraDataDisplayInput: ColumnExtraDataDisplayInputData) {
    this.column_extra_data_display_input = columnExtraDataDisplayInput;
    document.getElementById('column-extra-data-display-pop-up-' + this.idForModalPopUp + '-dialog').hidden = false;
  }

  public handleProceedWithEventOnColumnExtraDataPopUpDismiss(columnExtraDataDisplayInput: ColumnExtraDataDisplayInputData) {
    const column: Column = columnExtraDataDisplayInput.column;
    const record: GridRecord = columnExtraDataDisplayInput.record;   
    const hasClickEventHandlerAttached: boolean = columnExtraDataDisplayInput.hasClickEventHandlerAttached;   
    this.dismissColumnExtraDataDisplayPopUp();
    if (hasClickEventHandlerAttached) {
      if (column.eventHandler !== null) {
        column.eventHandler.clickEventColumn(record, column, this);
      }
    }
  }

  /** REVIEW */
  public handleMulitSelectApply(data: MultiSelectInputData) {
    switch (data.operation) {
      case 'column_filter': {
        let columnInstance: Column = null;
        const columnId = data.meta_data['columnId'];
        const selectedOptionsValue: string[] = [];
        //const sourceButton: HTMLElement = data.meta_data['sourceButton'];
        for (const column of this.grid.columns) {
          if (column.id === columnId) {
            columnInstance = column;
            break;
          }
        }
        if (columnInstance != null) {
          for (const element of data.data) {
            for (const option of columnInstance.filterOptions) {
              if (option['value'] === element['value']) {
                option['isSelected'] = element['selected'];
                if (option['isSelected']) {
                  selectedOptionsValue.push(option['label']);
                }
              }
            }
          }
        }
        //sourceButton.title = selectedOptionsValue.join(', ');
        this.addListFilterQuery(columnInstance);
        break;
      }
      case 'hide_show_column': {
        for (const data_element of data.data) {
          for (const column_element of this.grid.columns) {
            if (data_element['value'] === column_element.id) {
              column_element.hidden = data_element['selected'];
            }
          }
        }
        break;
      }
    }
    this.closeMultiSelectInput();
  }

  public lookupMultiRendererForValue(multivalueSplittedList: any [], lookupList: any []) {
    let columnFilterIconTitle: string = GridCommonFunctions.lookupMultiRendererForValue(multivalueSplittedList, lookupList, ', ');
    if (GridCommonFunctions.checkStringAvailability(columnFilterIconTitle)) {
      return columnFilterIconTitle;
    }
    return 'No filter selected';
  }

  /*
  * All Event Handlers
   */
  public actionColumnActionButtonClicked(record: GridRecord, button: ActionButton) {
    if (button.eventHandler !== null) {
      button.eventHandler.clickEventActionColumnButton(record, button, this);
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'No EventHandler defined for "' + button.label.toUpperCase() + '"',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
    }
  }

  public selectionColumnActionButtonClicked(button: ActionButton) {
    if (button.eventHandler !== null) {
      button.eventHandler.clickEventSelectionColumnMultipleActionButton(this.grid.getSelectedRecords(), button, this);
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'No EventHandler defined for "' + button.label.toUpperCase() + '"',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
    }
  }

  public columnClicked(record: GridRecord, column: Column) {
    if (column.lengthyData || column.multiList) {
      let data: string = this.defaultColumnValueRenderer(record, column, true);
      let hasClickEventHandlerAttached: boolean = false
      if (column.eventHandler !== null) {
        hasClickEventHandlerAttached = true;
      }
      if (
            GridCommonFunctions.checkStringAvailability(data) 
            && (
                  (column.multiList && (GridCommonFunctions.checkStringContainsText(data, ';') || data.length > GridConstants.LETTER_LENGTH_FOR_LENGTHY_DATA)) 
                  || (column.lengthyData && data.length > GridConstants.LETTER_LENGTH_FOR_LENGTHY_DATA)
                )
        ) {
        this.displayColumnExtraDataAsPopUp(column.headerName + ' - Complete Data', data, record, column, hasClickEventHandlerAttached);
      } else {
        if (column.eventHandler !== null) {
          column.eventHandler.clickEventColumn(record, column, this);
        }
      }
    } else {
      if (column.eventHandler !== null) {
        column.eventHandler.clickEventColumn(record, column, this);
      }
    }
  }

  /** Paint & Reset Functions */

  /**
   * Paint Filter Tabs
   */
  public defaultColumnValueRenderer(record: GridRecord, column: Column, returnCompleteData: boolean = false) {
    let data: string = '';
    if (column.uiRenderer === null) {
      data = column.getValueForColumn(record);
    } else {
      data = column.uiRenderer.renderColumn(record, column, this);
    }
    if (!returnCompleteData) {
      if (column.lengthyData || column.multiList) {
        data = data.substring(0, GridConstants.LETTER_LENGTH_FOR_LENGTHY_DATA);
      }
    }
    return data;
  }

  public showMoreLink(record: GridRecord, column: Column) {
    let data: string = this.defaultColumnValueRenderer(record, column, true);
    return data.length > GridConstants.LETTER_LENGTH_FOR_LENGTHY_DATA;
  }

  private hideShowRemoveFilterTab(column: Column = null) {
    if (column !== null) {
      const crossButton = document.getElementById('uigrid-' + this.grid.id + '-uigrid-column-header-toolbar-uigrid-row-column-name-bar-uigrid-cell-column-' + column.id + '-column-header-remove-filter');
      if (column.isFiltered) {
        crossButton.hidden = false;
      } else {
        crossButton.hidden = true;
        this.resetFilterInputs(column);
        this.resetFilterLabels(column);
      }
    } else {
      for (const column of this.grid.columns) {
        const crossButton = document.getElementById('uigrid-' + this.grid.id + '-uigrid-column-header-toolbar-uigrid-row-column-name-bar-uigrid-cell-column-' + column.id + '-column-header-remove-filter');
        if (crossButton) {
          if (column.isFiltered) {
            crossButton.hidden = false;
          } else {
            crossButton.hidden = true;
            this.resetFilterInputs(column);
            this.resetFilterLabels(column);
          }
        }
      }
    }
  }

  /** Reset Filter Inputs */
  private resetFilterInputs(column: Column = null) {
    let elements: HTMLCollectionOf<Element> = null;
    if (column !== null) {
      elements = document.getElementsByClassName(this.grid.id + '-grid-column-input-' + column.id);
    } else {
      elements = document.getElementsByClassName(this.grid.id + '-grid-input');
    }
    if (elements !== null) {
      for (let i = 0; i < elements.length; i++) {
        (<HTMLInputElement>elements.item(i)).value = '';
      }
    }
  }

  /** Reset Filter Labels */
  private resetFilterLabels(column: Column = null) {
    let elements_after: HTMLCollectionOf<Element> = null;
    let elements_on: HTMLCollectionOf<Element> = null;
    let elements_before: HTMLCollectionOf<Element> = null;
    if (column !== null) {
      elements_after = document.getElementsByClassName(this.grid.id + '-grid-column-label-after-' + column.id);
      elements_on = document.getElementsByClassName(this.grid.id + '-grid-column-label-on-' + column.id);
      elements_before = document.getElementsByClassName(this.grid.id + '-grid-column-label-before-' + column.id);
    } else {
      elements_after = document.getElementsByClassName(this.grid.id + '-grid-label-after');
      elements_on = document.getElementsByClassName(this.grid.id + '-grid-label-on');
      elements_before = document.getElementsByClassName(this.grid.id + '-grid-label-before');
    }
    if (elements_after !== null) {
      for (let i = 0; i < elements_after.length; i++) {
        (<HTMLElement>elements_after.item(i)).innerHTML = 'After';
      }
    }
    if (elements_on !== null) {
      for (let i = 0; i < elements_on.length; i++) {
        (<HTMLElement>elements_on.item(i)).innerHTML = 'On';
      }
    }
    if (elements_before !== null) {
      for (let i = 0; i < elements_before.length; i++) {
        (<HTMLElement>elements_before.item(i)).innerHTML = 'Before';
      }
    }
  }

  getColumnDisplayStyle(column) {
    return column.hidden ? 'none' : 'flex';
  }

  /** Offline Functions */

  /*
  * Offline Sorting
  */
  private sortRowRecordData() {
    this.grid.filtered_records.sort((a, b) => {
      for (const sorter of this.grid.sorters) {
        const propertyA = a.getProperty(sorter.mapping);
        const propertyB = b.getProperty(sorter.mapping);
        if (sorter.order === SortingOrder.ASC) {
          if (propertyA > propertyB) {
            return 1;
          }
          if (propertyA < propertyB) {
            return -1;
          }
        } else {
          if (propertyA > propertyB) {
            return -1;
          }
          if (propertyA < propertyB) {
            return 1;
          }
        }
      }
      return 0;
    });
  }

  /*
  * Offline Filtering
  */
  private filterRecords() {
    this.grid.filtered_records = [];
    for (let i = 0; i < this.grid.store.data.length; i++) {
      let rowMatchesQuery = true;
      const record_instance = this.grid.store.data[i];
      for (const element of this.grid.filters) {
        const cellValue = record_instance.getProperty(element.mapping);
        if (element.type === 'string') {
          if (!cellValue.includes(element.stringValue)) {
            rowMatchesQuery = false;
          }
        }
        if (element.type === 'number') {
          if (element.greaterThan != null) {
            if (!(cellValue > element.greaterThan)) {
              rowMatchesQuery = false;
            }
          }
          if (element.equalTo != null) {
            if (!(cellValue === element.equalTo)) {
              rowMatchesQuery = false;
            }
          }
          if (element.lessThan != null) {
            if (!(cellValue < element.lessThan)) {
              rowMatchesQuery = false;
            }
          }
        }
        if (element.type === 'date') {
          const cellValueInDate = new Date(cellValue);
          if (element.afterDate != null) {
            if (!(cellValueInDate > element.afterDate)) {
              rowMatchesQuery = false;
            }
          }
          if (element.onDate != null) {
            if (!(cellValueInDate.getTime() === element.onDate.getTime())) {
              rowMatchesQuery = false;
            }
          }
          if (element.beforeDate != null) {
            if (!(cellValueInDate < element.beforeDate)) {
              rowMatchesQuery = false;
            }
          }
        }
        if (element.type === 'list') {
          CommonUtilityFunctions.logOnConsole(element.listValue);
          CommonUtilityFunctions.logOnConsole(cellValue);
          CommonUtilityFunctions.logOnConsole(element.listValue.indexOf(cellValue));
          if (!(element.listValue.indexOf(cellValue) >= 0)) {
            rowMatchesQuery = false;
          }
        }
      }
      if (rowMatchesQuery) {
        this.grid.filtered_records.push(record_instance);
      }
    }
  }
}

export interface GridDataInterface {
  htmlDomElementId: string;
  hidden: boolean;
  grid: any;
}
