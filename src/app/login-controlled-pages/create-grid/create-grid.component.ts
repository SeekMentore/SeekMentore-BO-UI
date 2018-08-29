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

  gridRecords: any[];

  checkBoxCellWidth: number;

  recordTitleCellWidth: number;
  recordCellWidth: number;

  actionTitleCellWidth: number;
  actionCellWidth: number;

  numberOfActionCells = 3;

  showGrid = false;

  numberOfRecordsToBeDisplayed: number;

  rowRecordData: string[][];

  constructor() {
  }


  ngOnInit() {
    console.log(this.metaData);
    console.log(this.columnsData);
    this.gridRecords = [
      {
        firstColumn: 'cell 1',
        secondColumn: 'cell 2',
        thirdColumn: 'cell 3'
      },
      {
        firstColumn: 'cell 4',
        secondColumn: 'cell 5',
        thirdColumn: 'cell 6'
      }
    ];
    this.numberOfRecordsToBeDisplayed = this.gridRecords.length;
    let grid_width = 1200;
    this.checkBoxCellWidth = grid_width * 0.05; // 5 %
    this.actionTitleCellWidth = grid_width * 0.2; // 20 %
    this.actionCellWidth = this.actionTitleCellWidth / this.numberOfActionCells;
    this.recordTitleCellWidth = grid_width * 0.75 / this.columnsData.length;
    this.recordCellWidth = this.recordTitleCellWidth;
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
    // console.log(this.rowRecordData)
  }

  filterRowRecordData(columnIndex: number, query: string) {
    console.log(columnIndex, query);
  }

}

export interface GridColumnInterface {
  columnName: string;  // display name
  mapping: string; // name used for unique identification
  datatype: string;
  sortable: boolean;
  filterable: boolean;
}

export interface GridMetaDataInterface {
  title: string;
  recordPerPage: number;
  totalRecords: number;
  totalPageNumbers: number;
  currentPageNumber: number;
}

export interface GridRecordCellInterface {
  data: string;
}

// export interface GridRowDataInterface {
//   rowId: number;
//   records: GridRecordCellInterface[];
// }
