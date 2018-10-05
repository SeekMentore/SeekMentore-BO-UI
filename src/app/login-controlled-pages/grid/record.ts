export class Record {
  id: string;
  property: Object;
  selectionModelCheck = false;

  constructor(id: string, property: Object) {
    this.id = id;
    this.property = property;
  }

  public getProperty(propertyName: string) {
    return this.property[propertyName];
  }

}
