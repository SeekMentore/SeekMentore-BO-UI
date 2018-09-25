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

  constructor(public utility_servive: AppUtilityService) {
  }

  ngOnInit() {

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
    if (this.isPagingCapable) {
      this.paginator.init();
    }
    if (this.filters == null) {
      this.filters = [];
    }
    if (this.sorters == null) {
      this.sorters = [];
    }
    this.filtered_records = this.store.data;
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


  public selectionColumnSelectUnselectAll() {

  }

  public getFilterByColumnId(columnId: string) {
    return true;
  }

  public removeFilterFromColumn(columnId: string) {
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].columnId === columnId) {
        this.filters.splice(i, 1);
        i = i - 1;
        if (i < 0) {
          i = 0;
        }
        // this.removeFilterFromColumn(columnId);
      }
    }
    this.filterRecords();
  }

  public hideColumn(columnId: string) {

  }

  public selectionButtonCheckedUnchecked(recordId: string) {

  }

  public actionButtonClicked(recordId: string, buttonId: string) {

  }

  public refreshGridData() {

  }

  public goToPageNumber(pageNumber: number) {

  }

  public removeColumnFromSorterList(sorterId: string) {
    for (let i = 0; i < this.sorters.length; i++) {
      if (this.sorters[i].id === sorterId) {
        this.sorters.splice(i, 1);
      }
    }
    this.sortRowRecordData();
  }


  public sortColumn(columnId: string, sortOrder: SortingOrder) {
    let columnObject = null;
    this.columns.forEach(value => {
      if (value.id === columnId) {
        columnObject = value;
      }
    });
    if (columnObject == null) {
      return;
    }
    let sorterExists = false;
    this.sorters.forEach(value => {
      if (value.columnId === columnId) {
        sorterExists = true;
      }
    });

    if (sorterExists) {
      return;
    }

    const sorterObject = new Sorter(this.id + columnId + 'sorter', columnObject.dataType, columnObject.mapping, columnId, columnObject.headerName);
    sorterObject.order = sortOrder;
    this.sorters.push(sorterObject);
    this.sortRowRecordData();
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

  public addStringFilterQuery(columnId: string, mapping: string, value: string) {
    let queryExistsForIndex = false;

    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].columnId === columnId) {
        if (value.trim() === '') {
          this.filters.splice(i, 1);
        } else {
          this.filters[i].stringValue = value;
        }
        queryExistsForIndex = true;
        break;
      }
    }

    if (!queryExistsForIndex && value.trim() !== '') {
      const filter_object = new Filter(this.id + columnId, 'string', mapping, columnId);
      filter_object.stringValue = value;
      this.filters.push(filter_object);
    }

    this.filterRecords();

  }

  public filterValueExistsForComparisionType(filter: Filter, comparision_type: string): boolean {
    if (comparision_type === 'gt' && filter.greaterThan != null) {
      return true;
    }
    if (comparision_type === 'et' && filter.equalTo != null) {
      return true;
    }
    if (comparision_type === 'lt' && filter.lessThan != null) {
      return true;
    }
    return false;
  }

  public filterAsignValueForComparisionType(filter: Filter, comparision_type: string, value: number, data_type: string) {
    switch (data_type) {
      case 'number':
        switch (comparision_type) {
          case 'gt':
            filter.greaterThan = value;
            break;
          case 'et':
            filter.equalTo = value;
            break;
          case 'lt':
            filter.lessThan = value;
            break;
        }
        break;
      case 'date':
        const date_value = new Date(value);
        switch (comparision_type) {
          case 'gt':
            filter.afterDate = date_value;
            break;
          case 'et':
            filter.onDate = date_value;
            break;
          case 'lt':
            filter.beforeDate = date_value;
            break;
        }
    }

  }

  public addNumberOrDateFilterQuery(columnId: string, mapping: string, comparision_type: string, value: string, data_type: string, target: HTMLInputElement = null) {
    let queryExistsForIndex = false;

    let query_value = null;
    switch (data_type) {
      case 'number':
        query_value = parseInt(value, 10);
        break;
      case 'date':
        query_value = new Date(value);
        break;
    }
    if (query_value == null) {
      return;
    }
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].columnId === columnId) {
        if (value.trim() === '') {
          this.filters.splice(i, 1);
        } else {
          this.filterAsignValueForComparisionType(this.filters[i], comparision_type, query_value, data_type);
        }
        queryExistsForIndex = true;
        break;
      }
    }

    if (!queryExistsForIndex && value.trim() !== '') {
      const filter_object = new Filter(this.id + columnId, data_type, mapping, columnId);
      this.filterAsignValueForComparisionType(filter_object, comparision_type, query_value, data_type);
      this.filters.push(filter_object);
    }

    if(target && data_type === 'date') {
      target.title = query_value.getDate() + '';
    }

    this.filterRecords();

  }

  public addListFilterQuery(column: Column) {
    // Remove previous filter for this column
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].columnId === column.id) {
        this.filters.splice(i, 1);
        break;
      }
    }
    const filter_object = new Filter(this.id + column.id, column.dataType, column.mapping, column.id);
    // Add new filters for this column filterOptions
    column.filterOptions.forEach((value) => {
      if (value.isSelected) {
        filter_object.listValue.push(value.label);
      }
    });
    if (filter_object.listValue.length > 0) {
      this.filters.push(filter_object);
    }
    // console.log(filter_object)
    this.filterRecords();
  }


  public hideShowRemoveFilterTab() {
    /*
    hide remove-filter element of those columns which do not contain any filter
     */
    const columns_ids: string[] = [];
    this.columns.forEach((column) => {
      columns_ids.push(column.id);
    });
    this.filters.forEach((value) => {
      const index = columns_ids.indexOf(value.columnId);
      if (index > -1) {
        columns_ids.splice(index, 1);
        const element = document.getElementById(this.id + value.columnId + 'remove-filter');
        if (element) {
          element.hidden = false;
        }
      }
    });
    // console.log(columns_ids);
    columns_ids.forEach(id => {
      // console.log(this.id + id + 'remove-filter');
      const element = document.getElementById(this.id + id + 'remove-filter');
      // console.log(element);
      if (element) {
        element.hidden = true;
      }
    });
  }

  public showMultiSelectFilter(column: Column) {
    if (column.filterOptions === null || column.filterOptions.length === 0) {
      return;
    }
    const tempData: MultiSelectInputData = {
      operation: 'column_filter',
      meta_data: {
        columnId: column.id
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
              }
            }
          }
        }
        this.addListFilterQuery(columnInstance);
    }
    document.getElementById(this.id + 'multi-select').hidden = true;
  }


}