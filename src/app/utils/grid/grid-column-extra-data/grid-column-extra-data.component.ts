import { Component, OnInit, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import { GridCommonFunctions } from '../grid-common-functions';
import { Column } from '../column';
import { GridRecord } from '../grid-record';

@Component({
  selector: 'app-grid-column-extra-data',
  templateUrl: './grid-column-extra-data.component.html',
  styleUrls: ['./grid-column-extra-data.component.css']
})
export class GridColumnExtraDataComponent implements OnInit {

  @Input('columnExtraDataDisplayInput')
  columnExtraDataDisplayInput: ColumnExtraDataDisplayInputData = null;

  @Output()
  close: EventEmitter<any> = new EventEmitter();

  @Output()
  proceedWithEvent: EventEmitter<any> = new EventEmitter();

  rowClasses : any = ['color-lightgray',''];

  listdata: string[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (GridCommonFunctions.checkObjectAvailability(propName)) {
        const changedProp = changes[propName];
        if (propName === 'columnExtraDataDisplayInput' && changedProp.currentValue !== null) {
          this.columnExtraDataDisplayInput = changedProp.currentValue;          
          if (this.columnExtraDataDisplayInput.multiList) {
            this.listdata = this.columnExtraDataDisplayInput.dataText.split('; ');
          }
        }
      }
    }
  }

  public proceedClicked() {
    this.proceedWithEvent.emit(this.columnExtraDataDisplayInput);
  }

  public dismissClicked() { 
    this.close.emit();
  }
}

export interface ColumnExtraDataDisplayInputData {
  titleText: string;
  dataText : string;
  column: Column;
  record: GridRecord;
  multiList: boolean;
  hasClickEventHandlerAttached: boolean;
}
