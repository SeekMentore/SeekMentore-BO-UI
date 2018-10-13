import { SelectionColumn } from "./selection-column";
import { ActionColumn } from "./action-column";
import { Paginator } from "./paginator";
import { Sorter } from "./sorter";
import { Filter } from "./filter";
import { Column } from "./column";
import { Store } from "./store";
import { Record } from './record';
import { GridComponent } from "./grid.component";

export class Grid {
    id: string;
    title: string;
    hasSelectionColumn: boolean;
    selectionColumn: SelectionColumn;
    hasActionColumn: boolean;
    actionColumn: ActionColumn;
    isPagingCapable: boolean;
    paginator: Paginator;
    isSortingCapable: boolean;
    sorters: Sorter[] = [];
    isFilterCapable: boolean;
    filters: Filter[] = [];
    columns: Column[];
    store: Store;
    filtered_records: Record[] = [];
    offline: boolean;
  
    constructor(
        id: string, 
        title: string, 
        store: Store,
        columns: Column[], 
        isPagingCapable: boolean = false,
        paginator: Paginator = null,
        isSortingCapable: boolean = false,
        isFilterCapable: boolean = false,        
        hasSelectionColumn: boolean = false, 
        selectionColumn: SelectionColumn = null, 
        hasActionColumn: boolean = false, 
        actionColumn: ActionColumn = null,
        offline: boolean = false
    ) {
      this.id = id;
      this.title = title;
      this.store = store;
      this.columns = columns;
      this.isPagingCapable = isPagingCapable;
      this.paginator = paginator;
      if (this.isPagingCapable) {
        paginator.init();
      }
      this.isSortingCapable = isSortingCapable;
      this.isFilterCapable = isFilterCapable;      
      this.hasSelectionColumn = hasSelectionColumn;
      this.selectionColumn = selectionColumn;
      this.hasActionColumn = hasActionColumn;
      this.actionColumn = actionColumn;
      this.offline = offline;      
    }

    public loadData(gridObject: GridComponent) {    
        this.store.load(this, gridObject);
    }

    public setData() {
        this.filtered_records = this.store.data;
        this.paginator.setTotalPages(this.store.totalRecords);
    }
}