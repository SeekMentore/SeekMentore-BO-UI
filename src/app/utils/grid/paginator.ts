import { GridConstants } from './grid-constants';

export class Paginator {
  id: string;
  numberOfRecordsPerPage: number = GridConstants.DEFAULT_NUMBER_OF_RECORDS_PER_PAGE;
  currentPage: number = -1;
  startRecordNumber: number = -1;
  totalPages: number = -1;
  isFirstPage: boolean = false;
  isLastPage: boolean = false;

  constructor(id: string, numberOfRecordsPerPage: number = GridConstants.DEFAULT_NUMBER_OF_RECORDS_PER_PAGE) {    
    this.id = id;
    this.numberOfRecordsPerPage = numberOfRecordsPerPage;    
  }

  public init() {    
    this.currentPage = 1;
    this.computeStartRecordNumber();
  }

  public navigateNextPage() {    
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this.computeStartRecordNumber();
      return true;
    }
    return false;
  }

  public navigatePreviousPage() {    
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.computeStartRecordNumber();  
      return true;   
    }
    return false;
  }

  public navigateToPage(pageNum: number) {    
    if (pageNum >= 1 && pageNum <= this.totalPages ) {
      this.currentPage = pageNum;
      this.computeStartRecordNumber();  
      return true;    
    }
    return false;
  }

  public navigateToFirstPage() {    
    this.currentPage = 1;
    this.computeStartRecordNumber();  
  }

  private computeStartRecordNumber() {
    this.startRecordNumber = ((this.currentPage - 1) * this.numberOfRecordsPerPage) + 1;
  }

  public setTotalPages(totalRecords: number) {
    this.totalPages = Math.ceil(totalRecords / this.numberOfRecordsPerPage);
    this.isFirstPage = this.currentPage === 1;
    this.isLastPage = this.currentPage === this.totalPages;
    this.computeStartRecordNumber();
  }

  /**
   * All Getter Setter comes now
   */
}
