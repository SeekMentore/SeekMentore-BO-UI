import { GridCommonFunctions } from './grid-common-functions';
export class GridRecord {
  id: string;
  property: Object;
  selectionModelCheck: boolean = false;

  constructor(id: string, property: Object) {
    this.id = id;
    this.property = property;
  }

  public getProperty(propertyName: string) {
    return GridCommonFunctions.checkObjectAvailability(this.property[propertyName]) ? this.property[propertyName] : '';
  }
}
