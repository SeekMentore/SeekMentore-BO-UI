import { EventHandler } from './event-handler';
import { Filter } from './filter';
import { FilterOption } from './filter-option';
import { Record } from './record';
import { UIRenderer } from './ui-renderer';

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
          sortable: boolean = true, 
          filterable: boolean = true, 
          hideable: boolean = true, 
          hidden: boolean = false,
          filterOptionsMetadata: Object[] = [],
          callback_renderColumn: any = null, 
          clickEvent: any = null
  ) {    
    this.id = id;
    this.headerName = headerName;
    this.dataType = dataType;
    this.mapping = mapping;
    this.sortable = sortable;
    this.filterable = filterable;
    this.filter = null;
    if (this.filterable) {
      this.filter = new Filter(this.id + '-Filter', this.dataType, this.mapping, this.id);
    }
    this.hideable = hideable;
    this.hidden = hidden;
    this.filterOptions = [];
    if (null !== filterOptionsMetadata && filterOptionsMetadata.length > 0) {
      for (var i = 0; i < filterOptionsMetadata.length; i++) {
        var filterOptionMetadata:any = filterOptionsMetadata[i];
        if (null !== filterOptionMetadata) {
          this.filterOptions.push(
            new FilterOption(this.id + '-FilterOption-' + filterOptionMetadata.value, filterOptionMetadata.label, filterOptionMetadata.value)
          );
        }
      }
    }
    this.uiRenderer = null;
    if (null !== callback_renderColumn) {
      this.uiRenderer = new UIRenderer(this.id + '-UIRenderer', callback_renderColumn);
    }
    this.eventHandler = null;
    if (null !== clickEvent) {
      this.eventHandler = new EventHandler(this.id + '-EventHandler', clickEvent);
    }        
  }

  public getValueForColumn(record: Record) {
    return record.getProperty(this.mapping);
  }
}
