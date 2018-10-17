import { GridCommonFunctions } from './grid-common-functions';

export class SelectionColumn {
  id: string;
  attachMapping: boolean = false;
  mapping: string;

  constructor(id: string, mapping: string = null) {
    this.id = id;    
    this.mapping = mapping;
    if (GridCommonFunctions.checkObjectAvailability(this.mapping)) {
      this.attachMapping = true;
    }
  }
}
