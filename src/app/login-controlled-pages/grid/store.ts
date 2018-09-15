import {Record} from './record';

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
    if (isStatic != null) {
      this.isStatic = isStatic;
    }
    this.data = [];
    /*
         * If isStatic, restURL, downloadURL are Not Null
         * set values to class variables
         */
  }

  public load(gridObject) {
    if (this.isStatic) {
      // --> convert staticData into data using convertIntoRecordData
      gridObject.paintData();
    } else {
      // --> Make a rest call and store the response.data in restData
      // const params = {
      //   start: null != gridObject.paginator ? gridObject.paginator.startRecordNumber : 1,
      //   limit: null != gridObject.paginator ? gridObject.paginator.numberOfRecordsPerPage : -1,
      //   otherParams: JSON_encode(extraParams),
      //   sorter: gridObject.isSortingCapable ? gridObject.sorter : null,
      //   filter: gridObject.isFilterCapable ? gridObject.filter : null
      // };
      // makeHttpRequest(restURL, JSON_encode($params)).subscribe(){
      //   // --> convert restData into data using convertIntoRecordData
      //   gridObject.paintData();
      // }
      // error(){
      //   // Alert Message - Common alert of Utils
      // }
    }
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

}
