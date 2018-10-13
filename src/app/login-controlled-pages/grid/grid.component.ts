import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AppUtilityService } from '../../utils/app-utility.service';
import { MultiSelectInputData } from '../../utils/multi-select-input/multi-select-input.component';
import { ActionColumn } from './action-column';
import { Column } from './column';
import { Filter } from './filter';
import { Paginator } from './paginator';
import { Record } from './record';
import { SelectionColumn } from './selection-column';
import { Sorter, SortingOrder } from './sorter';
import { Store } from './store';
import { ActionButton } from './action-button';
import { HelperService, AlertDialogEvent } from 'src/app/utils/helper.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, AfterViewInit {

  id: string;
  title: string;
  htmlDomElementId: string;
  hasSelectionColumn: boolean;
  selectionColumn: SelectionColumn;
  hasActionColumn: boolean;
  actionColumn: ActionColumn;
  isPagingCapable: boolean;
  paginator: Paginator;
  isSortingCapable: boolean;
  sorters: Sorter[];
  isFilterCapable: boolean;
  filters: Filter[] = null;
  columns: Column[];
  store: Store;
  hidden: boolean = true;
  filtered_records: Record[] = [];
  mulit_select_input_data: MultiSelectInputData = null;
  offline: boolean;

  @Input()
  gridMetaData: GridDataInterface;

  constructor(public utility_service: AppUtilityService, private helperService: HelperService,) {
  }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.hideShowRemoveFilterTab();
    }, 100);
  }

  public createGrid() {
    this.loadData();    
  }

  public init() {   
    this.id = this.gridMetaData.id;
    this.title = this.gridMetaData.title;
    this.htmlDomElementId = this.gridMetaData.htmlDomElementId;
    this.hasSelectionColumn = this.gridMetaData.hasSelectionColumn;
    this.selectionColumn = this.gridMetaData.selectionColumn;
    this.hasActionColumn = this.gridMetaData.hasActionColumn;
    this.actionColumn = this.gridMetaData.actionColumn;
    this.isPagingCapable = this.gridMetaData.isPagingCapable;
    this.paginator = this.gridMetaData.paginator;
    this.isSortingCapable = this.gridMetaData.isSortingCapable;
    this.isFilterCapable = this.gridMetaData.isFilterCapable;
    this.columns = this.gridMetaData.columns;
    this.store = this.gridMetaData.store;
    if (this.isPagingCapable) {
      this.paginator.init();
    }
    if (this.filters == null) {
      this.filters = [];
    }
    if (this.sorters == null) {
      this.sorters = [];
    }
    this.offline = false;
  }

  public loadData() {    
    this.store.load(this);
  }

  private removeData() {}

  public paintData() {
    this.removeData();
    this.filtered_records = this.store.data;
    this.paginator.setTotalPages(this.store.totalRecords);
    this.hidden = false;
  }

  public loadNextPage() {
    if (this.paginator.navigateNextPage()) {
      this.loadData();
    }      
  }

  public loadPreviousPage() {
    if (this.paginator.navigatePreviousPage()) {
      this.loadData();
    }

  }

  public goToPageNumber(pageNum) {
    if (this.paginator.navigateToPage(pageNum)) {
      this.loadData();
    }
  }

  public applyFilter() {
    if (!this.offline) {
      this.filters = [];
      for (const column of this.columns) {
        if (column.isFiltered) {
          this.filters.push(column.filter);
        }
      }
      this.store.load(this);
    } else {
      this.filterRecords();
    }
    this.hideShowRemoveFilterTab();
  }

  public resetFilter() {
    this.filters = [];
    for (const column of this.columns) {
      column.isFiltered = false;
    }
    if (!this.offline) {
      this.store.load(this);
    } else {
      this.filterRecords();
    }
    this.hideShowRemoveFilterTab();
  }

  public toggleRemoteLoad(event: any) {
    if (event === 'ONLINE') {
      this.offline = false;
    } else {
      this.offline = true;
    }
  }

  public sortToggle(sorter: Sorter, sortOrder: SortingOrder) {
    sorter.order = sortOrder;    
  }

  public sortColumn(column: Column, sortOrder: SortingOrder) {
    let sorterExists = false;
    this.sorters.forEach(sorter => {
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
    this.sorters.push(new Sorter(column.id + '-sorter', column.dataType, column.mapping, column.id, column.headerName, sortOrder));
  }

  public removeColumnFromSorterList(sorterId: string) {
    for (let i = 0; i < this.sorters.length; i++) {
      if (this.sorters[i].id === sorterId) {
        this.sorters.splice(i, 1);
      }
    }    
  }

  public applySorter() {
    if (!this.offline) {
      this.store.load(this);
    } else {
      this.sortRowRecordData();
    }
  }

  public resetSorter() {
    this.sorters = [];
    if (!this.offline) {
      this.store.load(this);
    } else {
      this.sortRowRecordData();
    }    
  }

  public selectionColumnSelectUnselectAll(element: HTMLInputElement) {
    for (const record of this.filtered_records) {      
      const checkBox = document.getElementById('uigrid-'+this.id+'-uigrid-row-grid-record-'+record.id+'-uigrid-cell-select-box'+'-input-checkbox');
      if (checkBox) {
        (<HTMLInputElement>checkBox).checked = element.checked;
      }
    }
    this.store.setAllRecordsSelectedOrUnSelected(element.checked);    
  }  

  public removeFilterFromColumn(column: Column) {
    const columnFilter = column.filter;
    column.isFiltered = false;
    columnFilter.nullifyFilterProperties();
    this.hideShowRemoveFilterTab(column);    
  }

  /**REVIEW */
  public hideColumn(column: Column) {
    column.hidden = true;
    this.hidden = true;
    this.hidden = false;
  } 

  /**REVIEW */
  public columnFilteredTextChanged(column: Column, element: HTMLInputElement) {
    const filter = column.filter;
    filter.stringValue = element.value;
    column.isFiltered = (filter.stringValue && filter.stringValue.trim() !== '');
    this.hideShowRemoveFilterTab(column);
  }

  /**REVIEW */
  public columnFilteredGreaterNumberChanged(column: Column, element: HTMLInputElement) {
    const filter = column.filter;
    const parsedValue = parseInt(element.value, 10);
    if (isNaN(parsedValue)) {
      /** Show error tip there that this is not number and erase the content in the textbox */
      return;
    }
    if (element.value && element.value.trim() !== '') {
      filter.greaterThan = parsedValue;
      column.isFiltered = true;
    } else {
      column.isFiltered = false;
    }
    this.hideShowRemoveFilterTab(column);
  }

  /**REVIEW */
  public columnFilteredEqualNumberChanged(column: Column, element: HTMLInputElement) {
    const filter = column.filter;
    const parsedValue = parseInt(element.value, 10);
    if (isNaN(parsedValue)) {
      /** Show error tip there that this is not number and erase the content in the textbox */
      return;
    }
    if (element.value && element.value.trim() !== '') {
      filter.equalTo = parsedValue;
      column.isFiltered = true;
    } else {
      column.isFiltered = false;
    }
    this.hideShowRemoveFilterTab(column);
  }

  /**REVIEW */
  public columnFilteredLowerNumberChanged(column: Column, element: HTMLInputElement) {
    const filter = column.filter;
    const parsedValue = parseInt(element.value, 10);
    if (isNaN(parsedValue)) {
      /** Show error tip there that this is not number and erase the content in the textbox */
      return;
    }
    if (element.value && element.value.trim() !== '') {
      filter.lessThan = parsedValue;
      column.isFiltered = true;
    } else {
      column.isFiltered = false;
    }
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredBeforeDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
    const filter = column.filter;
    filter.beforeDate = date_value;
    filter.beforeDateMillis = date_value.getTime();
    label.title = date_value.toDateString();
    column.isFiltered = true;
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredAfterDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
    const filter = column.filter;
    filter.afterDate = date_value;
    filter.afterDateMillis = date_value.getTime();
    label.title = date_value.toDateString();
    column.isFiltered = true;
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredOnDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
    const filter = column.filter;
    filter.onDate = date_value;
    filter.onDateMillis = date_value.getTime();
    label.title = date_value.toDateString();
    column.isFiltered = true;
    this.hideShowRemoveFilterTab(column);
  }

  public selectionButtonCheckedUnchecked(record: Record, element: HTMLInputElement) {
    if (record !== null) {
      record.selectionModelCheck = element.checked;
    }
  } 

  public refreshGridData() {
    this.loadData();
  }  

  /** REVIEW */
  public addListFilterQuery(column: Column) {
    // Remove previous filter for this column
    const colFilter = column.filter;
    colFilter.listValue = [];
    // Add new filters for this column filterOptions
    column.filterOptions.forEach((value) => {
      if (value.isSelected) {
        colFilter.listValue.push(value.label);
      }
    });
    if (colFilter.listValue.length > 0) {
      column.isFiltered = true;
    } else {
      column.isFiltered = false;
    }
  }

  /** REVIEW */
  public showMultiSelectFilter(column: Column, sourceButton: HTMLElement) {
    if (column.filterOptions === null || column.filterOptions.length === 0) {
      return;
    }
    const filterData: MultiSelectInputData = {
      operation: 'column_filter',
      meta_data: {
        columnId: column.id,
        sourceButton: sourceButton
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

  /** REVIEW */
  public showColumnHideComponentPopup() {
    const columnData: MultiSelectInputData = {
      operation: 'hide_show_column',
      meta_data: null,
      data: []
    };
    for (const column of this.columns) {
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
    document.getElementById('multi-select-'+this.id+'-dialog').hidden = true;
  }

  public showMulitSelectInput(data: MultiSelectInputData) {
    this.mulit_select_input_data = data;
    document.getElementById('multi-select-'+this.id+'-dialog').hidden = false;
  }

  /** REVIEW */
  public handleMulitSelectApply(data: MultiSelectInputData) {
    switch (data.operation) {
      case 'column_filter': {
        let columnInstance = null;
        const columnId = data.meta_data['columnId'];
        const selectedOptionsValue: string[] = [];
        const sourceButton: HTMLElement = data.meta_data['sourceButton'];
        for (const column of this.columns) {
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
          for (const column_element of this.columns) {
            if (data_element['value'] === column_element.id) {
              column_element.hidden = data_element['selected'];
            }
          }
        }
        this.hidden = true;
        this.hidden = false;
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
      button.eventHandler.clickEvent(record);
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'No EventHandler defined for "'+button.label.toUpperCase()+'"',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);
    }
  }

  /** Paint & Reset Functions */

  /**
   * Paint Filter Tabs
   */
  private hideShowRemoveFilterTab(column: Column = null) {    
    if (column !== null) {      
      const crossButton = document.getElementById('uigrid-'+this.id+'-uigrid-column-header-toolbar-uigrid-row-column-name-bar-uigrid-cell-column-'+column.id+'-column-header-remove-filter');
      if (column.isFiltered) {
        crossButton.hidden = false;
      } else {
        crossButton.hidden = true;
        this.resetFilterInputs(column);
        this.resetFilterLabels(column);
      }
    } else {
      for (const column of this.columns) {
        const crossButton = document.getElementById('uigrid-'+this.id+'-uigrid-column-header-toolbar-uigrid-row-column-name-bar-uigrid-cell-column-'+column.id+'-column-header-remove-filter');
        if (crossButton) {
          if (column.isFiltered) {
            crossButton.hidden = false;
          } else {
            crossButton.hidden = true;
          }
        }
      }
      this.resetFilterInputs();
      this.resetFilterLabels();
    }
  }

  /** Reset Filter Inputs */
  private resetFilterInputs(column: Column = null) {
    let elements: HTMLCollectionOf<Element> = null;
    if (column !== null) {
      elements = document.getElementsByClassName(this.id + 'grid_column_input' + column.id);
    } else {
      elements = document.getElementsByClassName(this.id + 'grid_input');
    }
    if (elements !== null) {
      for (let i = 0; i < elements.length; i++) {
        (<HTMLInputElement>elements.item(i)).value = '';
      }
    }
  }

  /** Reset Filter Labels */
  private resetFilterLabels(column: Column = null) {
    let elements: HTMLCollectionOf<Element> = null;
    if (column !== null) {
      elements = document.getElementsByClassName(this.id + 'grid_column_label' + column.id);
    } else {
      elements = document.getElementsByClassName(this.id + 'grid_label');
    }
    if (elements !== null) {
      for (let i = 0; i < elements.length; i++) {
        (<HTMLElement>elements.item(i)).title = '';
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
    this.filtered_records.sort((a, b) => {
      for (const sorter of this.sorters) {
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
    this.filtered_records = [];
    for (let i = 0; i < this.store.data.length; i++) {
      let rowMatchesQuery = true;
      const record_instance = this.store.data[i];
      for (const element of this.filters) {
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
        this.filtered_records.push(record_instance);
      }
    }    
  } 
}

export interface GridDataInterface {
  id: string;
  title: string;
  htmlDomElementId: string;
  hasSelectionColumn: boolean;
  selectionColumn: SelectionColumn;
  hasActionColumn: boolean;
  actionColumn: ActionColumn;
  isPagingCapable: boolean;
  paginator: Paginator;
  isSortingCapable: boolean;
  isFilterCapable: boolean;
  columns: Column[];
  store: Store;
}
