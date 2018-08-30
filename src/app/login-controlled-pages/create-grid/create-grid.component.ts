import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-create-grid',
  templateUrl: './create-grid.component.html',
  styleUrls: ['./create-grid.component.css']
})
export class CreateGridComponent implements OnInit {

  @Input('columns-data')
  columnsData: GridColumnInterface[];

  @Input('meta-data')
  metaData: GridMetaDataInterface;

  @Input('grid-records')
  gridRecords: any[];

  checkBoxCellWidth: number;

  recordTitleCellWidth: number;
  recordCellWidth: number;

  actionTitleCellWidth: number;
  actionCellWidth: number;

  numberOfActionCells = 3;

  showGrid = false;

  numberOfRecordsToBeDisplayed: number;

  rowRecordData: any[][];
  filteredRowRecordData: any[][];

  filterQueries: { columnIndex: number, query: string }[];
  sortingQueries: { columnIndex: number, isAscending: boolean }[];

  constructor() {
  }


  ngOnInit() {
    console.log(this.metaData);
    console.log(this.columnsData);
    this.numberOfRecordsToBeDisplayed = this.gridRecords.length;
    const grid_width = 1200;
    this.checkBoxCellWidth = grid_width * 0.05; // 5 %
    this.actionTitleCellWidth = grid_width * 0.2; // 20 %
    this.actionCellWidth = this.actionTitleCellWidth / this.numberOfActionCells;
    this.recordTitleCellWidth = grid_width * 0.75 / this.columnsData.length;
    this.recordCellWidth = this.recordTitleCellWidth;
    this.filterQueries = [];
    this.sortingQueries = [];
    this.setRowRecordData();
    this.showGrid = true;
  }

  getFakeArray(size: number) {
    if (size < 0) {
      size = 0;
    }
    return new Array(size);
  }

  setRowRecordData() {
    this.rowRecordData = [];
    for (let i = 0; i < this.gridRecords.length; i++) {
      this.rowRecordData[i] = [];
      for (let j = 0; j < this.columnsData.length; j++) {
        this.rowRecordData[i][j] = this.gridRecords[i][this.columnsData[j]['mapping']];
      }
    }
    this.filteredRowRecordData = this.rowRecordData;
    // console.log(this.rowRecordData)
  }

  filterRowRecordData() {
    this.filteredRowRecordData = [];
    for (let i = 0; i < this.rowRecordData.length; i++) {
      let rowMatchesQuery = true;
      for (const element of this.filterQueries) {
        const cellValue = this.rowRecordData[i][element.columnIndex];
        if (typeof(cellValue) === 'string' && !cellValue.includes(element.query)) {
          rowMatchesQuery = false;
          break;
        }

        if (typeof(cellValue) === 'number') {
          if (cellValue !== parseInt(element.query, 10)) {
            rowMatchesQuery = false;
            break;
          }
        }
      }
      if (rowMatchesQuery) {
        this.filteredRowRecordData.push(this.rowRecordData[i]);
      }
    }
  }

  addFilterQuery(columnIndex: number, query: string) {

    let queryExistsForIndex = false;

    for (let i = 0; i < this.filterQueries.length; i++) {
      if (this.filterQueries[i].columnIndex === columnIndex) {
        if (query.trim() === '') {
          this.filterQueries.splice(i, 1);
        } else {
          this.filterQueries[i].query = query;
        }
        queryExistsForIndex = true;
        break;
      }
    }

    if (!queryExistsForIndex && query.trim() !== '') {
      this.filterQueries.push({columnIndex: columnIndex, query: query});
    }

    this.filterRowRecordData();
  }

  addSortingQuery(columnIndex: number, isAscending: boolean) {
    let queryExistsForIndex = false;

    for (let i = 0; i < this.sortingQueries.length; i++) {
      if (this.sortingQueries[i].columnIndex === columnIndex) {
        this.sortingQueries[i].isAscending = isAscending;
        queryExistsForIndex = true;
        // this.sortingQueries.splice(i, 1);
        break;
      }
    }

    if (!queryExistsForIndex) {
      this.sortingQueries.push({columnIndex: columnIndex, isAscending: isAscending});
    }

    this.sortRowRecordData();
  }

  sortRowRecordData() {
    this.filteredRowRecordData.sort((a, b) => {

      for (const element of this.sortingQueries) {

        if (element.isAscending) {
          if (a[element.columnIndex] > b[element.columnIndex]) {
            return 1;
          }
          if (a[element.columnIndex] < b[element.columnIndex]) {
            return -1;
          }
        } else {
          if (a[element.columnIndex] > b[element.columnIndex]) {
            return -1;
          }
          if (a[element.columnIndex] < b[element.columnIndex]) {
            return 1;
          }
        }

      }
      return 0;
    });
  }

  resetSortQuery() {
    this.sortingQueries = [];
    this.filterRowRecordData();
  }

  resetFilterQuery() {
    this.filterQueries = [];
    this.filterRowRecordData();
    this.sortRowRecordData();
  }

}

export interface GridColumnInterface {
  columnName: string;  // display name
  mapping: string; // name used for unique identification
  sortable: boolean;
  filterable: boolean;
}

export interface GridMetaDataInterface {
  title: string;
  recordPerPage: number;
  totalRecords: number;
  totalPageNumbers: number;
  currentPageNumber: number;
  paginationRequired: boolean;
}

export interface GridRecordCellInterface {
  data: string;
}

// export interface GridRowDataInterface {
//   rowId: number;
//   records: GridRecordCellInterface[];
// }
