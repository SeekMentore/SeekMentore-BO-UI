import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SelectionColumn} from './selection-column';
import {ActionColumn} from './action-column';
import {Paginator} from './paginator';
import {Sorter, SortingOrder} from './sorter';
import {Filter} from './filter';
import {Column} from './column';
import {Store} from './store';
import {Record} from './record';
import {MultiSelectInputData} from '../../utils/multi-select-input/multi-select-input.component';
import {AppUtilityService} from '../../utils/app-utility.service';

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

  showGrid = false;

  filtered_records: Record[] = [];

  mulit_select_input_data: MultiSelectInputData = null;

  online: boolean;

  @Input()
  gridMetaData: GridDataInterface;


  constructor(public utility_service: AppUtilityService) {
  }

  ngOnInit() {
    console.log(this.gridMetaData);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.hideShowRemoveFilterTab();
    }, 100);
  }


  public createGrid() {
    this.loadData();
    /*
         * function to create grid on UI
         *
         * 1) Print the Title on the Grid
         * 2) If isPagingCapable = true - Paint the Paging Toolbar with values
         * 3) If isSortingCapable = true - Paint the Sorter Toolbar
         * 4) If isFilterCapable = true - Paint the Filter Toolbar and Filter Buttons
         * 5) If hasSelectionColumn = true - Paint the Selection Column
         * 6) If hasActionColumn = true - Paint the Action Column
         * 7) Iterate and paint all Columns
         * 8) If column has filterable true paint the Filter column
         * 9) If column.datatype = list, paint the Filter using filterOptions in column
         */
  }

  public init() {
    /*
         * Init all values
         */
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
    this.online = true;
  }

  public loadData() {
    /*
         * Step 1 - Check Store.isStatic
         * Step 2 - If True call paintData() else call loadDynamicData
         */

    this.store.load(this);
  }

  public loadDynamicData() {

  }

  public removeData() {
    /*
         * Remove all the records before painting new records
         */
    // In grid-template this will remove everything from <record-section>
  }

  public paintData() {
    this.removeData();
    this.filtered_records = this.store.data;
    this.showGrid = true;
    // In grid-template <record-section> this section will be painted now
    // The logic on how to paint the section is written in grid-template.html
  }

  public loadNextPage() {
    this.paginator.getNextPage();
    this.loadData();
  }

  public loadPreviousPage() {
    this.paginator.getPreviousPage();
    this.loadData();
  }

  public loadPage(pageNum) {
    this.paginator.goToPage(pageNum);
    this.loadData();
  }


  public applyFilter() {
    if (this.online === true) {
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
  }

  public resetFilter() {
    this.filters = [];
    for (const column of this.columns) {
      column.isFiltered = false;
    }
    this.hideShowRemoveFilterTab();
  }

  public toggleRemoteLoad(event: any) {
    if (event === 'ONLINE') {
      this.online = true;
    } else {
      this.online = false;
    }
  }

  public removeColumnFromSorterList(sorterId: string) {
    for (let i = 0; i < this.sorters.length; i++) {
      if (this.sorters[i].id === sorterId) {
        this.sorters.splice(i, 1);
      }
    }
    this.sortRowRecordData();
  }

  public applySorter() {
    if (this.online === true) {
      this.store.load(this);

    } else {
      this.sortRowRecordData();
    }
  }

  public resetSorter() {
    this.sorters = [];
  }

  public selectionColumnSelectUnselectAll(element: HTMLInputElement) {
    for (const record of this.filtered_records) {
      const checkBox = document.getElementById(this.id + 'checkbox' + record.id);
      if (checkBox) {
        (<HTMLInputElement>checkBox).checked = element.checked;
      }
    }

    if (element.checked === true) {
      this.store.setAllRecordsToSelected();
    } else {
      this.store.setAllRecordsToUnselected();
    }
  }


  //
  // public clearTextForColumn(columnId: string) {
  //   if (this.label_fields[columnId]) {
  //     this.label_fields[columnId].forEach((element) => {
  //       element.title = '';
  //     });
  //   }
  //   if (this.input_fields[columnId]) {
  //     this.input_fields[columnId].forEach((element) => {
  //       element.value = '';
  //     });
  //   }
  // }

  public removeFilterFromColumn(column: Column) {

    const columnFilter = column.filter;
    column.isFiltered = false;
    columnFilter.nullifyFilterProperties();
    this.hideShowRemoveFilterTab(column);
    // for (let i = 0; i < this.filters.length; i++) {
    //   if (this.filters[i].columnId === columnId) {
    //     this.filters.splice(i, 1);
    //     i = i - 1;
    //     if (i < 0) {
    //       i = 0;
    //     }
    //     // this.removeFilterFromColumn(columnId);
    //   }
    // }
    // this.applyFilter();
  }

  public hideColumn(column: Column) {
    column.hidden = true;
    this.showGrid = false;
    this.showGrid = true;
  }

  public sortColumn(column: Column, sortOrder: SortingOrder) {
    let sorterExists = false;
    this.sorters.forEach(value => {
      if (value.columnId === column.id) {
        sorterExists = true;
      }
    });

    if (sorterExists) {
      return;
    }

    const sorterObject = new Sorter(column.id + '-sorter', column.dataType, column.mapping, column.id, column.headerName);
    sorterObject.order = sortOrder;
    this.sorters.push(sorterObject);
    // this.sortRowRecordData();
  }

  public columnFilteredTextChanged(column: Column, element: HTMLInputElement) {
    const colFilter = column.filter;
    colFilter.stringValue = element.value;
    if (colFilter.stringValue && colFilter.stringValue.trim() !== '') {
      column.isFiltered = true;
    } else {
      column.isFiltered = false;
    }
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredGreaterNumberChanged(column: Column, element: HTMLInputElement) {
    const colFilter = column.filter;
    const parsedValue = parseInt(element.value, 10);
    if (isNaN(parsedValue)) {
      return;
    }
    if (element.value && element.value.trim() !== '') {
      colFilter.greaterThan = parsedValue;
      column.isFiltered = true;
    } else {
      column.isFiltered = false;
    }
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredEqualNumberChanged(column: Column, element: HTMLInputElement) {
    const colFilter = column.filter;
    const parsedValue = parseInt(element.value, 10);
    if (element.value && element.value.trim() !== '' && !isNaN(parsedValue)) {
      colFilter.equalTo = parsedValue;
      column.isFiltered = true;
    } else {
      column.isFiltered = false;
    }
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredLowerNumberChanged(column: Column, element: HTMLInputElement) {
    const colFilter = column.filter;
    const parsedValue = parseInt(element.value, 10);
    if (element.value && element.value.trim() !== '' && !isNaN(parsedValue)) {
      colFilter.lessThan = parsedValue;
      column.isFiltered = true;
    } else {
      column.isFiltered = false;
    }
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredBeforeDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
    const colFilter = column.filter;
    colFilter.beforeDate = date_value;
    colFilter.beforeDateMillis = date_value.getTime();
    label.title = date_value.toDateString();
    column.isFiltered = true;
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredAfterDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
    const colFilter = column.filter;
    colFilter.afterDate = date_value;
    colFilter.afterDateMillis = date_value.getTime();
    label.title = date_value.toDateString();
    column.isFiltered = true;
    this.hideShowRemoveFilterTab(column);
  }

  public columnFilteredOnDateChanged(column: Column, datePickerValue: any, label: HTMLElement) {
    const date_value = new Date(datePickerValue.year, datePickerValue.month - 1, datePickerValue.day);
    const colFilter = column.filter;
    colFilter.onDate = date_value;
    colFilter.onDateMillis = date_value.getTime();
    label.title = date_value.toDateString();
    column.isFiltered = true;
    this.hideShowRemoveFilterTab(column);
  }


  public selectionButtonCheckedUnchecked(recordId: string, element: HTMLInputElement) {
    const record = this.store.getRecordById(recordId);
    if (record !== null) {
      record.selectionModelCheck = element.checked;
    }

  }

  public actionButtonClicked(recordId: string, buttonId: string) {

  }

  public refreshGridData() {

  }

  public goToPageNumber(pageNumber: number) {

  }


  sortRowRecordData() {
    this.filtered_records.sort((a, b) => {

      for (const element of this.sorters) {
        const propertyA = a.getProperty(element.mapping);
        const propertyB = b.getProperty(element.mapping);
        if (element.order === SortingOrder.ASC) {

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

  public filterRecords() {
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
    this.hideShowRemoveFilterTab();
  }


  // public filterValueExistsForComparisionType(filter: Filter, comparision_type: string): boolean {
  //   if (comparision_type === 'gt' && filter.greaterThan != null) {
  //     return true;
  //   }
  //   if (comparision_type === 'et' && filter.equalTo != null) {
  //     return true;
  //   }
  //   if (comparision_type === 'lt' && filter.lessThan != null) {
  //     return true;
  //   }
  //   return false;
  // }

  // public filterAsignValueForComparisionType(filter: Filter, comparision_type: string, value: number, data_type: string) {
  //   switch (data_type) {
  //     case 'number':
  //       switch (comparision_type) {
  //         case 'gt':
  //           filter.greaterThan = value;
  //           break;
  //         case 'et':
  //           filter.equalTo = value;
  //           break;
  //         case 'lt':
  //           filter.lessThan = value;
  //           break;
  //       }
  //       break;
  //     case 'date':
  //       const date_value = new Date(value);
  //       switch (comparision_type) {
  //         case 'gt':
  //           filter.afterDate = date_value;
  //           break;
  //         case 'et':
  //           filter.onDate = date_value;
  //           break;
  //         case 'lt':
  //           filter.beforeDate = date_value;
  //           break;
  //       }
  //   }
  //
  // }
  //
  // public addNumberOrDateFilterQuery(columnId: string, mapping: string, comparision_type: string,
  // value: any, data_type: string, target: HTMLInputElement = null) {
  //   let queryExistsForIndex = false;
  //   let query_value = null;
  //   switch (data_type) {
  //     case 'number':
  //       query_value = parseInt(value, 10);
  //       break;
  //     case 'date':
  //       query_value = new Date(value.year, value.month - 1, value.day);
  //       break;
  //   }
  //   if (query_value == null) {
  //     return;
  //   }
  //   for (let i = 0; i < this.filters.length; i++) {
  //     if (this.filters[i].columnId === columnId) {
  //       if (data_type === 'number' && value.trim() === '') {
  //         this.filters.splice(i, 1);
  //       } else {
  //         this.filterAsignValueForComparisionType(this.filters[i], comparision_type, query_value, data_type);
  //       }
  //       queryExistsForIndex = true;
  //       break;
  //     }
  //   }
  //
  //   if (!queryExistsForIndex) {
  //     const filter_object = new Filter(this.id + columnId, data_type, mapping, columnId);
  //     this.filterAsignValueForComparisionType(filter_object, comparision_type, query_value, data_type);
  //     this.filters.push(filter_object);
  //   }
  //
  //   if (target && data_type === 'date') {
  //     target.title = query_value.toDateString();
  //   }
  //   console.log(this.filters);
  //
  //   // this.filterRecords();
  //
  // }

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
    // console.log(filter_object)
    // this.filterRecords();
  }


  public hideShowRemoveFilterTab(column: Column = null) {
    /*
    hide remove-filter element of those columns which do not contain any filter
     */
    if (column !== null) {
      const crossButton = document.getElementById(this.id + column.id + 'remove-filter');
      if (column.isFiltered) {
        crossButton.hidden = false;
      } else {
        crossButton.hidden = true;
        this.resetFilterInputs(column);
        this.resetFilterLabels(column);
      }
    } else {
      for (const element of this.columns) {
        const crossButton = document.getElementById(this.id + element.id + 'remove-filter');
        if (crossButton) {
          if (element.isFiltered) {
            crossButton.hidden = false;
          } else {
            crossButton.hidden = true;
          }
        }
      }
      this.resetFilterInputs();
      this.resetFilterLabels();
    }


    // const columns_ids: string[] = [];
    // this.columns.forEach((column) => {
    //   columns_ids.push(column.id);
    // });
    // this.filters.forEach((value) => {
    //   const index = columns_ids.indexOf(value.columnId);
    //   if (index > -1) {
    //     columns_ids.splice(index, 1);
    //     const element = document.getElementById(this.id + value.columnId + 'remove-filter');
    //     if (element) {
    //       element.hidden = false;
    //     }
    //   }
    // });
    // // console.log(columns_ids);
    // columns_ids.forEach(id => {
    //   // console.log(this.id + id + 'remove-filter');
    //   const element = document.getElementById(this.id + id + 'remove-filter');
    //   // console.log(element);
    //   if (element) {
    //     element.hidden = true;
    //   }
    // });
  }

  public resetFilterInputs(column: Column = null) {
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

  public resetFilterLabels(column: Column = null) {
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


  public showMultiSelectFilter(column: Column, sourceButton: HTMLElement) {
    if (column.filterOptions === null || column.filterOptions.length === 0) {
      return;
    }
    const tempData: MultiSelectInputData = {
      operation: 'column_filter',
      meta_data: {
        columnId: column.id,
        sourceButton: sourceButton
      },
      data: []
    };

    column.filterOptions.forEach((value) => {
      tempData.data.push({
        label: value.label,
        value: value.value,
        enabled: true,
        selected: value.isSelected
      });
    });

    this.showMulitSelectInput(tempData);

  }

  public closeMultiSelectInput() {
    document.getElementById(this.id + 'multi-select').hidden = true;
    console.log('close multi-select-input');
  }

  public showMulitSelectInput(data: MultiSelectInputData) {
    this.mulit_select_input_data = data;
    document.getElementById(this.id + 'multi-select').hidden = false;
    console.log('show multi-select-input');

  }

  public handleMulitSelectApply(data: MultiSelectInputData) {
    switch (data.operation) {
      case 'column_filter':
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
    }
    document.getElementById(this.id + 'multi-select').hidden = true;
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
