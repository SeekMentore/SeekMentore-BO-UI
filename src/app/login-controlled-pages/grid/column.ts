import {EventHandler} from './event-handler';
import {UIRenderer} from './ui-renderer';
import {FilterOption} from './filter-option';
import {Filter} from './filter';

export class Column {
  id: string;
  headerName: string;
  dataType: string = 'string';  // (listed values {number | string | date | list})
  mapping: string;
  sortable: boolean = true;
  filterable: boolean = true;
  hideable: boolean = true;
  hidden: boolean = false;
  toBeHidden: boolean = false;
  filterOptions: FilterOption[]; 
  uiRenderer: UIRenderer;
  eventHandler: EventHandler;
  filter: Filter;
  isFiltered: boolean = false; // Do not set in constructor
  shouldHide: boolean = false; // Do not set in constructor


  constructor(
          id: string, 
          headerName: string, 
          dataType: string, 
          mapping: string, 
          sortable: boolean, 
          filterable: boolean, 
          hideable: boolean, 
          hidden: boolean, 
          filterOptions: FilterOption[] = [], 
          uiRenderer: UIRenderer = null, 
          eventHandler: EventHandler = null
  ) {
    this.id = id;
    this.headerName = headerName;
    this.dataType = dataType;
    this.mapping = mapping;
    this.sortable = sortable;
    this.filterable = filterable;
    this.hideable = hideable;
    this.hidden = hidden;
    this.filterOptions = filterOptions;
    this.uiRenderer = uiRenderer;
    this.eventHandler = eventHandler;
    this.filter = new Filter(this.id + '-filter', this.dataType, this.mapping, this.id);    
  }
}
