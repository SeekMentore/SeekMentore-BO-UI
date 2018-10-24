import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AppUtilityService } from '../../utils/app-utility.service';
import { AlertDialogEvent, HelperService } from '../../utils/helper.service';
import { LcpConstants } from "../../utils/lcp-constants";
import { MultiSelectInputData } from '../../utils/multi-select-input/multi-select-input.component';
import { ActionButton } from './action-button';
import { Column } from './column';
import { Grid } from './grid';
import { GridCommonFunctions } from './grid-common-functions';
import { Record } from './record';
import { Sorter, SortingOrder } from './sorter';

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
  grid: Grid;

  @Input()
  gridMetaData: GridDataInterface;

  constructor(public utility_service: AppUtilityService,
              private helperService: HelperService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hideShowRemoveFilterTab();
    }, 100);
  }

  public createGrid() {
    this.grid.loadData(this);
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
        GridCommonFunctions.checkObjectAvailability(this.gridMetaData.grid.offline) ? this.gridMetaData.grid.offline : false
      );
    }
    this.hidden = this.gridMetaData.hidden;
    this.idForModalPopUp = this.grid.id;

    this.createGrid();
  }

  public addExtraParams(paramKey: string, paramValue: Object) {
      this.grid.addExtraParams(paramKey, paramValue);
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
      }
      if (!this.grid.offline) {
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
        this.grid.sorters.push(new Sorter(column.id + '-sorter', column.dataType, column.mapping, column.id, column.headerName, sortOrder));
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

  /**REVIEW */
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
    // console.log("My Input", column);
  }

  /**REVIEW */
  public columnFilteredGreaterNumberChanged(column: Column, element: HTMLInputElement) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const filter = column.filter;
        const parsedValue = parseInt(element.value, 10);
        if (isNaN(parsedValue)) {
          /**Validation */
          return;
        }
        if (element.value && element.value.toString().trim() !== '') {
          filter.greaterThan = parsedValue;
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

  /**REVIEW */
  public columnFilteredEqualNumberChanged(column: Column, element: HTMLInputElement) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const filter = column.filter;
        const parsedValue = parseInt(element.value, 10);
        if (isNaN(parsedValue)) {
          /**Validation */
          return;
        }
        if (element.value && element.value.toString().trim() !== '') {
          filter.equalTo = parsedValue;
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

  /**REVIEW */
  public columnFilteredLowerNumberChanged(column: Column, element: HTMLInputElement) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const filter = column.filter;
        const parsedValue = parseInt(element.value, 10);
        if (isNaN(parsedValue)) {
          /**Validation */
          return;
        }
        if (element.value && element.value.toString().trim() !== '') {
          filter.lessThan = parsedValue;
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

  public columnFilteredBeforeDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
        const filter = column.filter;
        filter.beforeDate = date_value;
        filter.beforeDateMillis = date_value.getTime();
        label.innerHTML = date_value.getDate() + '/' + (date_value.getMonth() + 1) + '/' + (date_value.getUTCFullYear() % 100);
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

  public columnFilteredAfterDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
        const filter = column.filter;
        filter.afterDate = date_value;
        filter.afterDateMillis = date_value.getTime();
        label.innerHTML = date_value.getDate() + '/' + (date_value.getMonth() + 1) + '/' + (date_value.getUTCFullYear() % 100);
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

  public columnFilteredOnDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    if (this.grid.isFilterCapable) {
      if (column.filterable) {
        const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
        const filter = column.filter;
        filter.onDate = date_value;
        filter.onDateMillis = date_value.getTime();
        label.innerHTML = date_value.getDate() + '/' + (date_value.getMonth() + 1) + '/' + (date_value.getUTCFullYear() % 100);
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

  public selectionButtonCheckedUnchecked(record: Record, element: HTMLInputElement) {
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

  /** REVIEW */
  public handleMulitSelectApply(data: MultiSelectInputData) {
    switch (data.operation) {
      case 'column_filter': {
        let columnInstance = null;
        const columnId = data.meta_data['columnId'];
        const selectedOptionsValue: string[] = [];
        const sourceButton: HTMLElement = data.meta_data['sourceButton'];
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
                  selectedOptionsValue.push(option['value']);
                }
              }
            }
          }
        }
        sourceButton.title = selectedOptionsValue.join(', ');
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

  /*
  * All Event Handlers
   */
  public actionButtonClicked(record: Record, button: ActionButton) {
    if (button.eventHandler !== null) {
      button.eventHandler.clickEventButton(record, button);
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

  public columnClicked(record: Record, column: Column) {
    if (column.eventHandler !== null) {
      column.eventHandler.clickEventColumn(record, column);
    }
  }

  /** Paint & Reset Functions */

  /**
   * Paint Filter Tabs
   */
  public defaultColumnValueRenderer(record: Record, column: Column) {
    if (column.uiRenderer === null) {
      return column.getValueForColumn(record);
    }
    return column.uiRenderer.renderColumn(record, column);
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
          console.log(element.listValue, cellValue);
          console.log(element.listValue.indexOf(cellValue));
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
