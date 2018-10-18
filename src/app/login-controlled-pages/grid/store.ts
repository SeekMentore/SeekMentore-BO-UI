import {GridComponent} from './grid.component';
import {Record} from './record';
import {Grid} from './grid';

export class Store {
  id: string;
  isStatic: boolean = true;
  restURL: string;
  downloadURL: string;
  data: Record[]; // Each Object here will have a property 'id'
  staticData: Object[]; // list of Objects that should be provided in static manner
  restData: Object[]; // list of Objects that should be fetched in REST call
  totalRecords: number = -1;
  extraParams: Object;

  constructor(id: string, isStatic: boolean = true, restURL: string = null, downloadURL: string = null) {
    this.id = id;
    this.restURL = restURL;
    this.downloadURL = downloadURL;
    this.isStatic = isStatic;
    this.data = [];
  }

  public load(grid: Grid, gridObject: GridComponent) {
    if (this.isStatic) {
      // --> convert staticData into data using convertIntoRecordData
      this.convertIntoRecordData(this.getStaticData());
      grid.setData();
    } else {
      // --> Make a rest call and store the response.data in restData
      const params = {
        start: (grid.isPagingCapable) ? grid.paginator.startRecordNumber : 1,
        limit: (grid.isPagingCapable) ? grid.paginator.numberOfRecordsPerPage : -1,
        otherParams: JSON.stringify(this.extraParams),
        sorters: (grid.isSortingCapable) ? JSON.stringify(grid.sorters) : null,
        filters: (grid.isFilterCapable) ? JSON.stringify(grid.filters) : null
      };      
      const grid_mask_loader = document.getElementById('uigrid-' + grid.id + 'mask-loader');
      if (grid_mask_loader) {
        grid_mask_loader.hidden = false;
      }
      gridObject.utility_service.makeRequestWithoutResponseHandler(this.restURL, 'POST', JSON.stringify(params)).subscribe(
        result => {
          let response = result['response'];
          response = gridObject.utility_service.decodeObjectFromJSON(response);
          this.restData = response['data'];
          this.data = [];
          this.totalRecords = response['totalRecords'];
          this.convertIntoRecordData(this.getRestData());
          if (grid_mask_loader) {
            grid_mask_loader.hidden = true;
          }
          grid.setData();
        },
        error2 => {

        }
      );
    }
  }

  public downloadGridData(grid: Grid, gridObject: GridComponent) {
    if (this.isStatic) {
      return false;
    } else {
      /** Code to download data */
      return true;
    }
  }

  public convertIntoRecordData(objectList: Object[]) {
    const storeRecordIdentifierId = this.id + ((this.isStatic) ? '-Static' : '-Rest');
    objectList.forEach((value, index) => {
      const record = new Record(storeRecordIdentifierId + '-R-' + index.toString(), value);
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

  public setAllRecordsSelectedOrUnSelected(selected: boolean) {
    for (const record of this.data) {
      record.selectionModelCheck = selected;
    }
  }
}
