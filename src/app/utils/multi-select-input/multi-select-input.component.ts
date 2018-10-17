import {Component, Input, OnInit, SimpleChange, OnChanges, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-multi-select-input',
  templateUrl: './multi-select-input.component.html',
  styleUrls: ['./multi-select-input.component.css']
})
export class MultiSelectInputComponent implements OnInit, OnChanges {

  @Input('data')
  data: MultiSelectInputData = null;

  @Output()
  apply: EventEmitter<any> = new EventEmitter();

  @Output()
  close: EventEmitter<any> = new EventEmitter();

  title = '';

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (null !== propName) {
        const changedProp = changes[propName];
        if (propName === 'data' && changedProp.currentValue !== null) {
          this.data = changedProp.currentValue;
          this.title = this.data.meta_data['title'];
        }
      }
    }
  }

  dataOptionToggled(index: number) {
    this.data.data[index].selected = !(this.data.data[index].selected);
  }

  selectUnselectAll(element: HTMLInputElement) {
    for (const list_option of this.data.data) {
      if (list_option.enabled === true) {
        list_option.selected = element.checked;
      }
    }
  }

  applySelected() {
    this.apply.emit(this.data);
  }

  closeDialog() {
    this.close.emit();
  }


}

export interface MultiSelectInputData {
  operation: string;
  data: {
    label: string,
    value: string,
    enabled: boolean,
    selected: boolean,
  }[];
  meta_data: Object;
}
