export class Record {
  id: string;
  property: Object;
  selectionModelCheck: boolean = false;

  constructor(id: string, property: Object) {
    this.id = id;
    this.property = property;
  }

  public getProperty(propertyName: string) {
    return (null !== this.property[propertyName] || undefined !== this.property[propertyName]) ? this.property[propertyName] : '';
  }
}
