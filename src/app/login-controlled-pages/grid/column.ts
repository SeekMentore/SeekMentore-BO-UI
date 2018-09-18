import {EventHandler} from './event-handler';
import {Renderer} from './renderer';
import {FilterOptions} from './filter-options';

export class Column {
  id: string;
  headerName: string;
  dataType: string;  // (listed values {number | string | date | list})
  mapping: string;
  sortable: boolean;
  filterable: boolean;
  hideable: boolean;
  hidden: boolean;
  toBeHidden: boolean;
  filterOptions: FilterOptions[]; // This is a JS definition which we defined
  renderer: Renderer; // This is a JS definition which we defined
  eventHandler: EventHandler; // This is a JS definition which we defined

  constructor(id, headerName, dataType, mapping, sortable, filterable, hideable, hidden, filterOptions, renderer, eventHandler) {
    this.id = id;
    this.headerName = headerName;
    this.dataType = dataType;
    this.mapping = mapping;
    this.sortable = sortable;
    this.filterable = filterable;
    this.hideable = hideable;
    this.hidden = hidden;
    this.filterOptions = filterOptions;
    this.renderer = renderer;
    this.eventHandler = eventHandler;
    /*
         * If headerName, dataType, mapping, sortable, filterable, hideable, filterOptions, renderer, eventHandler are Not Null
         * set values to class variables
         */
  }
}
