export class SelectionColumn {
  id: string;
  attachMapping: boolean = false;
  mapping: string;

  constructor(id: string, mapping: string = null) {
    this.id = id;    
    this.mapping = mapping;
    if (null !== this.mapping) {
      this.attachMapping = true;
    }
  }
}
