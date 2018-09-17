export class Filter {
  id: string;
  type: string; // (listed values {number | string | date | list})
  mapping: string;
  // columnName: string;
  columnId: string;
  lessThan: number = null;
  equalTo: number = null;
  greaterThan: number = null;
  stringValue: string = null;
  beforeDate: Date = null;
  onDate: Date = null;
  afterDate: Date = null;
  beforeDateMillis: number = null;
  onDateMillis: number = null;
  afterDateMillis: number = null;
  listValue: string[] = [];

  constructor(id: string, type: string, mapping: string, columnId: string) {
    this.id = id;
    this.type = type;
    this.mapping = mapping;
    this.columnId = columnId;
    // Set values
  }
}
