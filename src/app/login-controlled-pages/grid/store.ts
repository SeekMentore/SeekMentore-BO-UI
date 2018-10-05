import {Record} from './record';
import {GridComponent} from './grid.component';
import {Observable, of} from "rxjs/index";

export class Store {
  id: string;
  isStatic = false;
  restURL: string;
  downloadURL: string;
  data: Record[]; // Each Object here will have a property 'id'
  staticData: Object[]; // list of Objects that should be provided in static manner
  restData: Object[]; // list of Objects that should be fetched in REST call
  totalRecords = -1;
  extraParams: Object;

  constructor(id: string, isStatic: boolean = null, restURL: string = null, downloadURL: string = null) {
    this.id = id;
    this.restURL = restURL;
    this.downloadURL = downloadURL;
    if (isStatic != null) {
      this.isStatic = isStatic;
    }
    this.data = [];
    /*
         * If isStatic, restURL, downloadURL are Not Null
         * set values to class variables
         */
  }

  public load(gridObject: GridComponent) {
    if (this.isStatic) {
      // --> convert staticData into data using convertIntoRecordData
      this.convertIntoRecordData(this.getStaticData());
      gridObject.paintData();
    } else {
      // --> Make a rest call and store the response.data in restData
      const params = {
        start: null != gridObject.paginator ? gridObject.paginator.startRecordNumber : 1,
        limit: null != gridObject.paginator ? gridObject.paginator.numberOfRecordsPerPage : -1,
        otherParams: JSON.stringify(this.extraParams),
        sorter: gridObject.isSortingCapable ? gridObject.sorters : null,
        filter: gridObject.isFilterCapable ? gridObject.filters : null
      };
      // gridObject.utility_service.makeRequest1(this.restURL, 'POST', JSON.stringify(params)).subscribe(
      //   result => {
      //     let response = result['response'];
      //     response = gridObject.utility_service.decodeObjectFromJSON(response);
      //     console.log(response);
      //     this.restData = response['data'];
      //     this.convertIntoRecordData(this.getRestData());
      //     gridObject.paintData();
      //   },
      //   error2 => {
      //
      //   }
      // );
      console.log(JSON.stringify(params));
      this.simulateRestRequest().subscribe(
        result => {
          let response = result['response'];
          response = gridObject.utility_service.decodeObjectFromJSON(response);
          this.restData = response['data'];
          this.data = [];
          this.convertIntoRecordData(this.getRestData());
          gridObject.paintData();
        },
        error2 => {

        }
      );
    }
  }

  public simulateRestRequest(): Observable<any> {
    const response = {
      totalRecords: 2,
      success: true,
      message: '',
      data: [
        {name: 'Manjeet', age: 20, birth_date: '2018-09-20', gender: 'Male'},
        {name: 'Kumar', age: 25, birth_date: '2018-08-20', gender: 'Female'}
      ]
    };
    return of({response: JSON.stringify(response)});
  }


  public convertIntoRecordData(objectList: Object[]) {

    objectList.forEach((value, index) => {
      const record = new Record('R' + index.toString(), value);
      this.data.push(record);
    });

    // This function will be used to convert any object list into data object
    // this data object is painted on the Grid
    // Loop object in objectList
    // --> Logic to create new recordId - You can create as R + index (i.e. 0 / 1 / 2 so on)
    // Record record = new Record(R{index}, object);
    // data.add(record);
    // end loop
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

  public setAllRecordsToSelected() {
    for (const record of this.data) {
      record.selectionModelCheck = true;
    }
  }

  public setAllRecordsToUnselected() {
    for (const record of this.data) {
      record.selectionModelCheck = false;
    }
  }

}
