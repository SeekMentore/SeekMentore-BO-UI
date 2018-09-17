export class Sorter {
  id: string;
  mapping: string;
  columnId: string;
  columnName: string;
  type: string; // (listed values {number | string | date | list})
  order: SortingOrder = SortingOrder.ASC;

  constructor(id, type, mapping, columnId, columnName) {
    this.id = id;
    this.type = type;
    this.mapping = mapping;
    this.columnId = columnId;
    this.columnName = columnName;
    // Set values
  }

}

export enum SortingOrder {
  'ASC' = 1,
  'DESC' = 2
}
