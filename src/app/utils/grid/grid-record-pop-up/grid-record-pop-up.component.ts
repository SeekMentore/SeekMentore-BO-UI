import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { GridCommonFunctions } from '../grid-common-functions';

@Component({
  selector: 'app-grid-record-pop-up',
  templateUrl: './grid-record-pop-up.component.html',
  styleUrls: ['./grid-record-pop-up.component.css']
})
export class GridRecordPopUpComponent implements OnInit {

  @Input('recordDisplayInput')
  recordDisplayInput: RecordDisplayInputData = null;

  @Output()
  close: EventEmitter<any> = new EventEmitter();

  rowClasses : any = ['color-lightgray',''];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (GridCommonFunctions.checkObjectAvailability(propName)) {
        const changedProp = changes[propName];
        if (propName === 'recordDisplayInput' && changedProp.currentValue !== null) {
          this.recordDisplayInput = changedProp.currentValue;
        }
      }
    }
  }

  public dismissClicked() { 
    this.close.emit();
  }
}

export interface RecordDisplayInputData {
  titleText: string;
  data: {
    value : string,
    label : string
  }[];
}
