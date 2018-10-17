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
        storeMetaData: any,
        columnsMetadata: Object[] = [], 
        isPagingCapable: boolean = false,
        numberOfRecordsPerPage: number = null,
        isSortingCapable: boolean = false,
        isFilterCapable: boolean = false,        
        hasSelectionColumn: boolean = false, 
        selectionColumnMetadata: any = null, 
        hasActionColumn: boolean = false, 
        actionColumnMetadata: any = null,
        offline: boolean = false
    ) {
        alert(1);
        alert(title);
      this.id = id;
      this.title = title;
      this.store = null;
      if (null !== storeMetaData) {
          this.store = new Store(this.id + '-Store', storeMetaData.isStatic, storeMetaData.restURL, storeMetaData.downloadURL);
      }
      this.isSortingCapable = isSortingCapable;
      this.isFilterCapable = isFilterCapable;  
      this.columns = [];
      if (null !== columnsMetadata && columnsMetadata.length > 0) {
          for (var i = 0; i < columnsMetadata.length; i++) {
              var columnMetadata:any = columnsMetadata[i];
              if (null !== columnMetadata) {
                    const columnSortable = this.isSortingCapable ? ((null !== columnMetadata.sortable) ? columnMetadata.sortable : true) : false;
                    const columnFilterable = this.isFilterCapable ? ((null !== columnMetadata.filterable) ? columnMetadata.filterable : true) : false                 
                    this.columns.push(new Column(
                                        this.id + '-Column-' + columnMetadata.id, 
                                        columnMetadata.headerName, 
                                        columnMetadata.dataType, 
                                        columnMetadata.mapping,
                                        columnSortable,
                                        columnFilterable,
                                        (null !== columnMetadata.hideable) ? columnMetadata.hideable : true,
                                        (null !== columnMetadata.hidden) ? columnMetadata.hidden : false,
                                        (null !== columnMetadata.filterOptions) ? columnMetadata.filterOptions : [],
                                        (null !== columnMetadata.renderer) ? columnMetadata.renderer : null,
                                        (null !== columnMetadata.clickEvent) ? columnMetadata.clickEvent : null,
                                ));
              }
          }
      }
      this.isPagingCapable = isPagingCapable;
      this.paginator = null;
      if (this.isPagingCapable) {
        if (null !== numberOfRecordsPerPage) {
            this.paginator = new Paginator(this.id + '-Paginator', numberOfRecordsPerPage);             
        } else {
            this.paginator = new Paginator(this.id + '-Paginator');
        }
        this.paginator.init();
      }          
      this.hasSelectionColumn = hasSelectionColumn;
      this.selectionColumn = null;
      if (this.hasSelectionColumn) {
        if (null !== selectionColumnMetadata) {
            if (null != selectionColumnMetadata.mapping) {
                this.selectionColumn = new SelectionColumn(this.id + '-SelectionColumn', selectionColumnMetadata.mapping);
            } else {
                this.selectionColumn = new SelectionColumn(this.id + '-SelectionColumn');
            }
        } else {
            this.selectionColumn = new SelectionColumn(this.id + '-SelectionColumn');
        }
      }
      this.hasActionColumn = hasActionColumn;
      this.actionColumn = null;
      if (this.hasActionColumn) {
        if (null !== actionColumnMetadata) {
            if (null !== actionColumnMetadata.label) {
                this.actionColumn = new ActionColumn(this.id + '-ActionColumn', actionColumnMetadata.buttons, actionColumnMetadata.label);
            } else {
                this.actionColumn = new ActionColumn(this.id + '-ActionColumn', actionColumnMetadata.buttons);
            }
        }
      }
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