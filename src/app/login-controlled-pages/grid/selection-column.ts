export class SelectionColumn {
  id: string;
  attachMapping: boolean;
  mapping: string;

  constructor(id: string, attachMapping: boolean = false, mapping: string = null) {
    this.id = id;
    this.attachMapping = attachMapping;
    this.mapping = mapping;
  }
}
