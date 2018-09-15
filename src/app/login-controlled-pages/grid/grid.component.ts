import {Component, Input, OnInit} from '@angular/core';
import {SelectionColumn} from './selection-column';
import {ActionColumn} from './action-column';
import {Paginator} from './paginator';
import {Sorter, SortingOrder} from './sorter';
import {Filter} from './filter';
import {Column} from './column';
import {Store} from './store';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {


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

  filters: Filter[];

  columns: Column[];

  store: Store;

  showGrid = false;

  constructor() {
  }

  ngOnInit() {
  }


  public createGrid() {
    this.showGrid = true;
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
  }

  public loadData() {
    /*
         * Step 1 - Check Store.isStatic
         * Step 2 - If True call paintData() else call loadDynamicData
         */
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

  removeColumnFromSorterList(sorterId: string) {

  }

  selectionColumnSelectUnselectAll() {

  }

  getFilterByColumnId(columnId: string) {
    return true;
  }

  removeFilterFromColumn(columnId: string) {

  }

  hideColumn(columnId: string) {

  }

  sortColumn(columnId: string, sortOrder: SortingOrder) {

  }

  selectionButtonCheckedUnchecked(recordId: string) {

  }

  actionButtonClicked(recordId: string, buttonId: string) {

  }


}
