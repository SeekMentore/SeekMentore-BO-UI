import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { GridCommonFunctions } from '../grid/grid-common-functions';

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

  filteredListData: {
                      label: string,
                      value: string,
                      enabled: boolean,
                      selected: boolean,
                    }[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (GridCommonFunctions.checkObjectAvailability(propName)) {
        const changedProp = changes[propName];
        if (propName === 'data' && changedProp.currentValue !== null) {
          this.data = changedProp.currentValue;
          this.title = this.data.meta_data['title'];
          this.filteredListData = this.data.data;
        }
      }
    }
  }

  dataOptionToggled(index: number) {
    this.data.data[index].selected = !(this.data.data[index].selected);
  }

  public dataSearched(element: HTMLInputElement) {
    //this.searchedValue = element.value.trim();
    //this.filteredListData = CommonUtilityFunctions.searchItemsInStringListThatHasSearchedSubstring(this.listdata, element.value);
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
