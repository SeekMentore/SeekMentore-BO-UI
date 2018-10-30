import { EventHandler } from './event-handler';
import { Filter } from './filter';
import { FilterOption } from './filter-option';
import { GridCommonFunctions } from './grid-common-functions';
import { GridRecord } from './grid-record';
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
  lengthyData: boolean = false;
  uiRenderer: UIRenderer;
  eventHandler: EventHandler;
  filter: Filter;
  isFiltered: boolean = false; // Do not set in constructor
  shouldHide: boolean = false; // Do not set in constructor
  appliedClassNames: string = ''; // Do not set in constructor


  constructor(
          id: string, 
          headerName: string, 
          dataType: string, 
          mapping: string, 
          sortable: boolean = true, 
          filterable: boolean = true, 
          hideable: boolean = true, 
          hidden: boolean = false,
          lengthyData: boolean = false,
          filterOptionsMetadata: Object[] = [],
          renderer: any = null, 
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
    this.lengthyData = lengthyData;
    if (this.lengthyData) {
      this.appliedClassNames = this.appliedClassNames + ' ' + 'column-pointer';
    }
    this.filterOptions = [];
    if (GridCommonFunctions.checkObjectAvailability(filterOptionsMetadata) && filterOptionsMetadata.length > 0) {
      for (var i = 0; i < filterOptionsMetadata.length; i++) {
        var filterOptionMetadata:any = filterOptionsMetadata[i];
        if (GridCommonFunctions.checkObjectAvailability(filterOptionMetadata)) {
          const filterId = GridCommonFunctions.checkObjectAvailability(filterOptionMetadata.id) ? filterOptionMetadata.id : i.toString();
          this.filterOptions.push(
            new FilterOption(this.id + '-FilterOption-' + filterId, filterOptionMetadata.label, filterOptionMetadata.value)
          );
        }
      }
    }
    this.uiRenderer = null;
    if (GridCommonFunctions.checkObjectAvailability(renderer)) {
      this.uiRenderer = new UIRenderer(this.id + '-UIRenderer', renderer);
    }
    this.eventHandler = null;
    if (GridCommonFunctions.checkObjectAvailability(clickEvent)) {
      this.eventHandler = new EventHandler(this.id + '-EventHandler', clickEvent);
      this.appliedClassNames = this.appliedClassNames + ' ' + 'column-pointer';
      this.appliedClassNames = this.appliedClassNames + ' ' + 'text-color-blue';
    }        
  }

  public getValueForColumn(record: GridRecord) {
    return record.getProperty(this.mapping);
  }
}
