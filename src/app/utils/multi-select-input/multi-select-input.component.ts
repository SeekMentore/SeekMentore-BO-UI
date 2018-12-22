import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { GridCommonFunctions } from '../grid/grid-common-functions';
import { CommonUtilityFunctions } from '../common-utility-functions';

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

  filteredListData: number[] = [];

  searchedValue: string = '';

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
          this.filteredListData = this.prepareFilteredListData();
          this.searchedValue = '';
        }
      }
    }
  }

  private prepareFilteredListData() {
    let searchedStringItemList: number[] = [];
    for(var index = 0; index < this.data.data.length; index++) {
      let data = this.data.data[index];
      searchedStringItemList.push(index);
    }
    return searchedStringItemList;
  }

  dataOptionToggled(iteration: number) {
    this.data.data[this.filteredListData[iteration]].selected = !(this.data.data[this.filteredListData[iteration]].selected);    
  }

  public dataSearched(element: HTMLInputElement) {
    this.searchedValue = element.value.trim();
    this.filteredListData = this.searchItemsInListThatHasLabelAsSearchedSubstring(this.searchedValue);
  }

  public searchItemsInListThatHasLabelAsSearchedSubstring(substring: string) {
    let searchedStringItemList: number[] = this.prepareFilteredListData();
    if (CommonUtilityFunctions.checkStringAvailability(substring)) {
      substring = substring.trim();
      searchedStringItemList = [];
      for(var index = 0; index < this.data.data.length; index++) {
        let dataItem: {
              label: string,
              value: string,
              enabled: boolean,
              selected: boolean
            } = this.data.data[index];
        if (CommonUtilityFunctions.checkObjectAvailability(dataItem)) {
          let label : string = dataItem.label;
          if (label.toUpperCase().indexOf(substring.toUpperCase()) !== -1) {
            searchedStringItemList.push(index);
          }
        }
      }
    }
    return searchedStringItemList;
  }

  selectUnselectAll(element: HTMLInputElement) {
    for (const index of this.filteredListData) {
      let dataItem: {
        label: string,
        value: string,
        enabled: boolean,
        selected: boolean
      } = this.data.data[index];
      if (dataItem.enabled === true) {
        dataItem.selected = element.checked;
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
    selected: boolean
  }[];
  meta_data: Object;
}
