export class Sorter {
  id: string;
  mapping: string;
  columnId: string;
  columnName: string;
  type: string; // (listed values {number | string | date | list})
  order: SortingOrder = SortingOrder.ASC;

  constructor(id: string, type: string, mapping: string, columnId: string, columnName: string, order: SortingOrder) {
    this.id = id;
    this.type = type;
    this.mapping = mapping;
    this.columnId = columnId;
    this.columnName = columnName;
    this.order = order;
  }
}

export enum SortingOrder {
  'ASC' = 1,
  'DESC' = 2
}
