import {GridComponent} from "./grid.component";
import {GridRecord} from "./grid-record";
import {Grid} from "./grid";
import { GridCommonFunctions } from "./grid-common-functions";

export class Store {
  id: string;
  isStatic: boolean = true;
  responseError: boolean = false;
  responseErrorMessage: string;
  restURL: string;
  downloadURL: string;
  data: GridRecord[]; // Each Object here will have a property 'id'
  staticData: Object[]; // list of Objects that should be provided in static manner
  restData: Object[]; // list of Objects that should be fetched in REST call
  totalRecords: number = -1;
  totalRecordsOnThisPage: number = -1;
  extraParams: Object;
  private precall_load: any;
  private postcall_load: any;
  private precall_download: any;
  private postcall_download: any;

  constructor(
      id: string, 
      isStatic: boolean = true, 
      restURL: string = null, 
      downloadURL: string = null, 
      precall_load: any = null,
      postcall_load: any = null,
      precall_download: any = null,
      postcall_download: any = null
  ) {
    this.id = id;
    this.restURL = restURL;
    this.downloadURL = downloadURL;
    this.precall_load = precall_load;
    this.postcall_load = postcall_load;
    this.precall_download = precall_download;
    this.postcall_download = postcall_download;
    this.isStatic = isStatic;
    this.data = [];
    this.extraParams = {};
  }

  public load(grid: Grid, gridComponentObject: GridComponent) {
    this.setStandardExtraParams(grid, gridComponentObject);
    if (GridCommonFunctions.checkObjectAvailability(this.precall_load)) {
      this.precall_load(gridComponentObject);
    }
    if (this.isStatic) {
      // --> convert staticData into data using convertIntoRecordData
      this.convertIntoRecordData(this.getStaticData());
      grid.setData();
      if (GridCommonFunctions.checkObjectAvailability(this.postcall_load)) {
        this.postcall_load(gridComponentObject);
      }
    } else {
      // --> Make a rest call and store the response.data in restData
      const params = {
        start: (grid.isPagingCapable) ? grid.paginator.startRecordNumber : 1,
        limit: (grid.isPagingCapable) ? grid.paginator.numberOfRecordsPerPage : -1,
        otherParams: JSON.stringify(this.extraParams),
        sorters: (grid.isSortingCapable) ? JSON.stringify(grid.sorters) : null,
        filters: (grid.isFilterCapable) ? JSON.stringify(grid.filters) : null
      };
      gridComponentObject.showGridLoadingMask();
      gridComponentObject.utility_service.makeRequestWithoutResponseHandler(this.restURL, 'POST', gridComponentObject.utility_service.urlEncodeData(params), 'application/x-www-form-urlencoded').subscribe(
        result => {
          let response = result['response'];
          response = gridComponentObject.utility_service.decodeObjectFromJSON(response);
          if (response != null) {
            if (response['success'] === true) {
              this.responseError = false;
              this.responseErrorMessage = '';
              this.restData = response['data'];
              this.data = [];
              this.totalRecords = response['totalRecords'];
              this.convertIntoRecordData(this.getRestData());
              gridComponentObject.hideGridLoadingMask();
            } else {
              this.data = [];
              this.totalRecords = 0;
              this.responseError = false;
              this.responseErrorMessage = response['message'];
              gridComponentObject.hideGridLoadingMask();
            }
          } else {
            this.data = [];
            this.totalRecords = 0;
            this.responseError = false;
            this.responseErrorMessage = 'NULL response received from server, cannot load data.';
            gridComponentObject.hideGridLoadingMask();
          }
          grid.setData();
          if (GridCommonFunctions.checkObjectAvailability(this.postcall_load)) {
            this.postcall_load(gridComponentObject);
          }
        },
        error2 => {
          this.data = [];
          this.totalRecords = 0;
          this.responseError = true;
          this.responseErrorMessage = 'Communication failure!! Something went wrong.';
          gridComponentObject.hideGridLoadingMask();
          grid.setData();
          if (GridCommonFunctions.checkObjectAvailability(this.postcall_load)) {
            this.postcall_load(gridComponentObject);
          }          
        }
      );
    }    
  }

  private setStandardExtraParams(grid: Grid, gridComponentObject: GridComponent) {
    let hasActionButtons: boolean = (grid.hasActionColumn && grid.actionColumn.buttons.length > 0);
    gridComponentObject.addExtraParams('hasActionButtons', hasActionButtons);
    if (hasActionButtons) {
      gridComponentObject.addExtraParams('secureActionColumnButtons', grid.actionColumn.secureButtons);
    }
    let hasSelectionButtons: boolean = (grid.hasSelectionColumn && grid.selectionColumn.buttons.length > 0);
    gridComponentObject.addExtraParams('hasSelectionButtons', hasSelectionButtons);
    if (hasSelectionButtons) {
      gridComponentObject.addExtraParams('secureSelectionColumnButtons', grid.selectionColumn.secureButtons);
    }
  }

  public downloadGridData(grid: Grid, gridComponentObject: GridComponent) {
    if (this.isStatic) {
      return false;
    } else {
      if (GridCommonFunctions.checkStringAvailability(this.downloadURL)) {
        this.setStandardExtraParams(grid, gridComponentObject);
        if (GridCommonFunctions.checkObjectAvailability(this.precall_download)) {
          this.precall_download(gridComponentObject);
        }
        const start: HTMLInputElement = <HTMLInputElement>document.getElementById('gridDownload-start');
        const limit: HTMLInputElement = <HTMLInputElement>document.getElementById('gridDownload-limit');
        const otherParams: HTMLInputElement = <HTMLInputElement>document.getElementById('gridDownload-otherParams');
        const sorters: HTMLInputElement = <HTMLInputElement>document.getElementById('gridDownload-sorters');
        const filters: HTMLInputElement = <HTMLInputElement>document.getElementById('gridDownload-filters');
        start.value = '1';
        limit.value = '-1'; // No pagination while download
        otherParams.value = JSON.stringify(this.extraParams);
        sorters.value = (grid.stateExpanded && grid.downloadWithStatePreserved && grid.isSortingCapable) ? JSON.stringify(grid.sorters) : null;
        filters.value = (grid.stateExpanded && grid.downloadWithStatePreserved && grid.isFilterCapable) ? JSON.stringify(grid.filters) : null;
        gridComponentObject.utility_service.submitForm('gridDownloadForm', this.downloadURL, 'POST');
        if (GridCommonFunctions.checkObjectAvailability(this.postcall_download)) {
          this.postcall_download(gridComponentObject);
        }
        return true;
      }
      return false;
    }
  }

  public convertIntoRecordData(objectList: Object[]) {
    const storeRecordIdentifierId = this.id + ((this.isStatic) ? '-Static' : '-Rest');
    objectList.forEach((value, index) => {
      const record = new GridRecord(storeRecordIdentifierId + '-R-' + index.toString(), value);
      this.data.push(record);
    });
  }

  public setStaticData(objects: Object[]) {
    this.staticData = objects;
  }

  public getStaticData(): Object[] {
    return this.staticData;
  }

  public getRestData(): Object[] {
    return this.restData;
  }

  public getRecordById(id: string) {
    for (const record of this.data) {
      if (record.id === id) {
        return record;
      }
    }
    return null;
  }

  public setAllRecordsSelectedOrUnSelected(selectedState: boolean) {
    if (GridCommonFunctions.checkNonEmptyList(this.data)) {
      this.data.forEach((record) => {
        record.selectionModelCheck = selectedState;
      });    
    }
  }

  public addExtraParams(paramKey: string, paramValue: Object) {
    this.extraParams[paramKey] = paramValue;
  }
}
