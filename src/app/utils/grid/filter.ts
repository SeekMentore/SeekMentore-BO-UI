export class Filter {
  id: string;
  type: string; // (listed values {number | string | date | list})
  mapping: string;
  columnId: string;
  multiList: boolean;
  lessThan: number = null;
  equalTo: number = null;
  greaterThan: number = null;
  stringValue: string = null;
  textCaseSensitiveSearch: boolean = false;
  beforeDate: Date = null;
  onDate: Date = null;
  afterDate: Date = null;
  beforeDateMillis: number = null;
  onDateMillis: number = null;
  afterDateMillis: number = null;
  listValue: string[] = [];

  constructor(id: string, type: string, mapping: string, columnId: string, multiList: boolean) {
    this.id = id;
    this.type = type;
    this.mapping = mapping;
    this.columnId = columnId;
    this.multiList = multiList;
  }

  nullifyFilterProperties() {
    if (this.type === 'number') {
      this.lessThan = null;
      this.equalTo = null;
      this.greaterThan = null;
    } else if (this.type === 'string') {
      this.stringValue = null;
      this.textCaseSensitiveSearch = true;
    } else if (this.type === 'date') {
      this.beforeDate = null;
      this.onDate = null;
      this.afterDate = null;
      this.beforeDateMillis = null;
      this.onDateMillis = null;
      this.afterDateMillis = null;
    } else if (this.type === 'list') {
      this.listValue = []; // empty list
    }
  }

}
