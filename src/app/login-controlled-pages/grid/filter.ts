export class Filter {
  id: string;
  type: string; // (listed values {number | string | date | list})
  mapping: string;
  columnName: string;
  columnId: string;
  lessThan: number;
  equalTo: number;
  greaterThan: number;
  stringValue: number;
  beforeDate: Date;
  onDate: Date;
  afterDate: Date;
  beforeDateMillis: number;
  onDateMillis: number;
  afterDateMillis: number;
  listValue: string[];

  constructor(id: string, type: string, mapping: string, columnName: string) {
    this.id = id;
    this.type = type;
    this.mapping = mapping;
    this.columnName = columnName;
    // Set values
  }
}
