import {GridConstants} from './grid-constants';

export class Paginator {
  id: string;
  numberOfRecordsPerPage = GridConstants.DEFAULT_NUMBER_OF_RECORDS_PER_PAGE; // Should come from Constants file
  currentPage = -1;
  startRecordNumber = -1;
  totalPages = -1;

  constructor(id, numberOfRecordsPerPage = null) {
    /*
         * If numberOfRecordsPerPage is Not Null
         * set its value to class variable
         */
    this.id = id;
    if (numberOfRecordsPerPage != null) {
      this.numberOfRecordsPerPage = numberOfRecordsPerPage;
    }
  }

  public init() {
    /*
         * Whenver you change currentPage also set the startRecordNumber
         */
    this.currentPage = 1;
    this.startRecordNumber = ((this.currentPage - 1) * this.numberOfRecordsPerPage) + 1;
  }

  public getNextPage() {
    /*
         * Check if the currentPage is not the last Page
         * If true Increment the currentPage and return its value
         * Else return -1
         */
  }

  public getPreviousPage() {
    /*
         * Check if the currentPage is not the first Page
         * If true Decrement the currentPage and return its value
         * Else return -1
         */
  }

  public goToPage(pageNum) {
    /*
         * Check if pageNum is between 1 & totalPages
         * If true set currentPage to pageNum and return true
         * Else return false
         */
  }

  /**
   * All Getter Setter comes now
   */
}
