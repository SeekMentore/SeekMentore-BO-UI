import { SelectionColumn } from "./selection-column";
import { ActionColumn } from "./action-column";
import { Paginator } from "./paginator";
import { Sorter } from "./sorter";
import { Filter } from "./filter";
import { Column } from "./column";
import { GridCommonFunctions } from './grid-common-functions';
import { Store } from "./store";
import { GridRecord } from './grid-record';
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
    filteredRecords: GridRecord[] = [];
    downloadWithStatePreserved: boolean;
    offline: boolean;
    showDownload: boolean = false;
    showOfflineToggle: boolean = false;
    stateExpanded: boolean = true;
    isCollapsable: boolean = true;
    maskLoaderHidden: boolean = true;
    selectAllBoxChecked: boolean = false;    

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
        offline: boolean = false,
        showOfflineToggle: boolean = false,
        isCollapsable: boolean = true,
        collapsed: boolean = false
    ) {       
      this.id = id;
      this.title = title;
      this.store = null;
      if (GridCommonFunctions.checkObjectAvailability(storeMetaData)) {
          let downloadURL: string = null;
          let customDownloadTimer: number = null;
          let precall_load: any = null;
          let postcall_load: any = null;
          let precall_download: any = null;
          let postcall_download: any = null;
          if (GridCommonFunctions.checkObjectAvailability(storeMetaData.preLoad)) {
              precall_load = storeMetaData.preLoad;
          }
          if (GridCommonFunctions.checkObjectAvailability(storeMetaData.postLoad)) {
              postcall_load = storeMetaData.postLoad;
          }
          if (GridCommonFunctions.checkObjectAvailability(storeMetaData.download)) {
            downloadURL = storeMetaData.download.url;
            if (GridCommonFunctions.checkStringAvailability(downloadURL)) {
                this.showDownload = true;
            }
            if (GridCommonFunctions.checkNonNegativeNonZeroNumberAvailability(storeMetaData.download.timer)) {
                customDownloadTimer = storeMetaData.download.timer;
            }
            if (GridCommonFunctions.checkObjectAvailability(storeMetaData.download.preDownload)) {
                precall_download = storeMetaData.download.preDownload;
            }
            if (GridCommonFunctions.checkObjectAvailability(storeMetaData.download.postDownload)) {
                postcall_download = storeMetaData.download.postDownload;
            }
          }
          this.store = new Store(
                            this.id + '-Store', 
                            storeMetaData.isStatic, 
                            storeMetaData.restURL, 
                            downloadURL, 
                            customDownloadTimer,
                            precall_load,
                            postcall_load,
                            precall_download,
                            postcall_download
                        );
      }
      this.isSortingCapable = isSortingCapable;
      this.isFilterCapable = isFilterCapable;
      this.columns = [];
      if (GridCommonFunctions.checkObjectAvailability(columnsMetadata) && columnsMetadata.length > 0) {
          for (var i = 0; i < columnsMetadata.length; i++) {
              var columnMetadata:any = columnsMetadata[i];
              if (GridCommonFunctions.checkObjectAvailability(columnMetadata)) {
                    const columnSortable = this.isSortingCapable ? (GridCommonFunctions.checkObjectAvailability(columnMetadata.sortable) ? columnMetadata.sortable : true) : false;
                    const columnFilterable = this.isFilterCapable ? (GridCommonFunctions.checkObjectAvailability(columnMetadata.filterable) ? columnMetadata.filterable : true) : false;
                    const columnId = GridCommonFunctions.checkObjectAvailability(columnMetadata.id) ? columnMetadata.id : i.toString();
                    this.columns.push(new Column(
                                        this.id + '-Column-' + columnId,
                                        columnMetadata.headerName,
                                        columnMetadata.dataType,
                                        columnMetadata.mapping,
                                        columnSortable,
                                        columnFilterable,
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.hideable) ? columnMetadata.hideable : true,
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.hidden) ? columnMetadata.hidden : false,
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.lengthyData) ? columnMetadata.lengthyData : false,
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.multiList) ? columnMetadata.multiList : false,
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.filterOptions) ? columnMetadata.filterOptions : [],
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.renderer) ? columnMetadata.renderer : null,
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.clickEvent) ? columnMetadata.clickEvent : null,
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.clubbedMapping) ? columnMetadata.clubbedMapping : null,
                                        GridCommonFunctions.checkObjectAvailability(columnMetadata.clubbedProperties) ? columnMetadata.clubbedProperties : null
                                ));
              }
          }
      }
      this.isPagingCapable = isPagingCapable;
      this.paginator = null;
      if (this.isPagingCapable) {
        if (GridCommonFunctions.checkObjectAvailability(numberOfRecordsPerPage)) {
            this.paginator = new Paginator(this.id + '-Paginator', numberOfRecordsPerPage);
        } else {
            this.paginator = new Paginator(this.id + '-Paginator');
        }
        this.paginator.init();
      }
      this.hasSelectionColumn = hasSelectionColumn;
      this.selectionColumn = null;
      if (this.hasSelectionColumn) {
        if (GridCommonFunctions.checkObjectAvailability(selectionColumnMetadata)) {
            if (GridCommonFunctions.checkObjectAvailability(selectionColumnMetadata.mapping)) {
                this.selectionColumn = new SelectionColumn(this.id + '-SelectionColumn', selectionColumnMetadata.buttons, selectionColumnMetadata.mapping);
            } else {
                this.selectionColumn = new SelectionColumn(this.id + '-SelectionColumn', selectionColumnMetadata.buttons);
            }
        } else {
            this.selectionColumn = new SelectionColumn(this.id + '-SelectionColumn');
        }
      }
      this.hasActionColumn = hasActionColumn;
      this.actionColumn = null;
      if (this.hasActionColumn) {
        if (GridCommonFunctions.checkObjectAvailability(actionColumnMetadata)) {
            if (GridCommonFunctions.checkObjectAvailability(actionColumnMetadata.label)) {
                this.actionColumn = new ActionColumn(this.id + '-ActionColumn', actionColumnMetadata.buttons, actionColumnMetadata.label);
            } else {
                this.actionColumn = new ActionColumn(this.id + '-ActionColumn', actionColumnMetadata.buttons);
            }
        }
      }
      this.offline = offline;
      this.showOfflineToggle = showOfflineToggle;
      this.isCollapsable = isCollapsable;
      if (collapsed) {
          this.isCollapsable = true;
          this.stateExpanded = false;
      }
      this.downloadWithStatePreserved = false;
    }

    public loadData(gridComponentObject: GridComponent) {
        this.store.load(gridComponentObject);
    }

    public setData() {
        this.filteredRecords = this.store.data;
        this.paginator.setTotalPages(this.store.totalRecords);
        this.store.totalRecordsOnThisPage = this.store.totalRecords;
        if (this.paginator.totalPages > 0) {
            if (this.paginator.isLastPage) {
                this.store.totalRecordsOnThisPage = (this.store.totalRecords - ((this.paginator.currentPage - 1) * this.paginator.numberOfRecordsPerPage));
            } else {
                this.store.totalRecordsOnThisPage = this.paginator.numberOfRecordsPerPage;
            }
        }
    }

    public addExtraParams(paramKey: string, paramValue: Object) {
        this.store.addExtraParams(paramKey, paramValue);
    }

    public getSelectedRecords() {
        let selectedRecords: GridRecord[] = [];
        if (GridCommonFunctions.checkNonEmptyList(this.store.data)) {
            this.store.data.forEach((record) => {
                if (record.selectionModelCheck) {
                    selectedRecords.push(record);
                }
            });    
        }        
        return selectedRecords;
    }    
}
