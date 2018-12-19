export class Sorter {
  id: string;
  mapping: string;
  columnId: string;
  columnName: string;
  type: string; // (listed values {number | string | date | list})
  order: SortingOrder = SortingOrder.ASC;
  clubbedSorterMapping: boolean = false;
  clubbedSorterProperties: string[] = [];

  constructor (
        id: string, 
        type: string, 
        mapping: string, 
        columnId: string, 
        columnName: string, 
        order: SortingOrder,
        clubbedSorterMapping: boolean = false,
        clubbedSorterProperties: string[] = []
  ) {
    this.id = id;
    this.type = type;
    this.mapping = mapping;
    this.columnId = columnId;
    this.columnName = columnName;
    this.order = order;
    this.clubbedSorterMapping = clubbedSorterMapping;
    if (this.clubbedSorterMapping) {
      this.clubbedSorterProperties = clubbedSorterProperties;
    }
  }
}

export enum SortingOrder {
  'ASC' = 1,
  'DESC' = 2
}
