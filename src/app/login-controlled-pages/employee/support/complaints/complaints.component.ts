import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {HelperService} from 'src/app/utils/helper.service';
import {Column} from 'src/app/utils/grid/column';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {ActionButton} from 'src/app/utils/grid/action-button';
import {LcpConstants} from 'src/app/utils/lcp-constants';
import {LcpRestUrls} from 'src/app/utils/lcp-rest-urls';
import {AdminCommonFunctions} from 'src/app/utils/admin-common-functions';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit, AfterViewInit {

  @ViewChild('customerComplaintGrid')
  customerComplaintGridObject: GridComponent;
  customerComplaintGridMetaData: GridDataInterface;

  @ViewChild('tutorComplaintGrid')
  tutorComplaintGridObject: GridComponent;
  tutorComplaintGridMetaData: GridDataInterface;

  @ViewChild('employeeComplaintGrid')
  employeeComplaintGridObject: GridComponent;
  employeeComplaintGridMetaData: GridDataInterface;

  @ViewChild('resolvedComplaintGrid')
  resolvedComplaintGridObject: GridComponent;
  resolvedComplaintGridMetaData: GridDataInterface;

  showComplaintData = false;
  selectedComplaintRecord: GridRecord = null;
  interimHoldSelectedComplaintRecord: GridRecord = null;
  complaintDataAccess: ComplaintDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.customerComplaintGridMetaData = null;
    this.tutorComplaintGridMetaData = null;
    this.employeeComplaintGridMetaData = null;
    this.resolvedComplaintGridMetaData = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.customerComplaintGridObject.init();
      this.tutorComplaintGridObject.init();
      this.employeeComplaintGridObject.init();
      this.resolvedComplaintGridObject.init();
    }, 0);
    setTimeout(() => {
      this.customerComplaintGridObject.refreshGridData();
      this.tutorComplaintGridObject.refreshGridData();
      this.employeeComplaintGridObject.refreshGridData();
      this.resolvedComplaintGridObject.refreshGridData();
    }, 0);
  }

  public getGridObject(id: string, title: string, restURL: string) {
    let grid = {
      id: id,
      title: title,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [
        {
          id: 'name',
          headerName: 'Name',
          dataType: 'string',
          mapping: 'name',
          clickEvent: (record: GridRecord, column: Column) => {
            // Open the Data view port
            this.interimHoldSelectedComplaintRecord = record;
            if (this.complaintDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.complaint_data_access, 'POST');
            } else {
              this.selectedComplaintRecord = this.interimHoldSelectedComplaintRecord;
              this.toggleVisibilityComplaintGrid();
            }
          }
        },
        {
          id: 'complaintFiledDate',
          headerName: 'Complaint Filed Date',
          dataType: 'date',
          mapping: 'complaintFiledDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        },
        {
          id: 'complaintStatus',
          headerName: 'Complaint Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.complaintStatusFilterOptions,
          mapping: 'complaintStatus'
        },
        {
          id: 'userId',
          headerName: 'User Id',
          dataType: 'string',
          mapping: 'userId'
        },
        {
          id: 'complaintDetails',
          headerName: 'Complaint Details',
          dataType: 'string',
          mapping: 'complaintDetails',
          lengthyData: true
        },
        {
          id: 'complaintResponse',
          headerName: 'Complaint Response',
          dataType: 'string',
          mapping: 'complaintResponse',
          lengthyData: true
        },
        {
          id: 'complaintUser',
          headerName: 'Complaint User',
          dataType: 'list',
          filterOptions: CommonFilterOptions.complaintUserFilterOptions,
          mapping: 'complaintUser',
          renderer: AdminCommonFunctions.complaintUserRenderer
        }
      ],
      hasSelectionColumn: true,
      selectionColumn: {
        buttons: [{
          id: 'sendEmail',
          label: 'Send Email',
          clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
            // Refer document
            const selectedEmailsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'emailId');
            if (selectedEmailsList.length === 0) {
              this.helperService.showAlertDialog({
                isSuccess: false,
                message: LcpConstants.grid_generic_no_record_selected_error,
                onButtonClicked: () => {
                }
              });
            } else {
              this.helperService.showEmailDialog(selectedEmailsList.join(';'));
            }
          }
        }]
      }
    }
    return grid;
  }

  public setUpGridMetaData() {
    this.customerComplaintGridMetaData = {
      grid: this.getGridObject('customerComplaintGrid', 'Customer Complaints', '/rest/support/customerComplaintList'),
      htmlDomElementId: 'customer-complaint-grid',
      hidden: false
    };

    this.tutorComplaintGridMetaData = {
      grid: this.getGridObject('tutorComplaintGrid', 'Tutor Complaints', '/rest/support/tutorComplaintList'),
      htmlDomElementId: 'tutor-complaint-grid',
      hidden: false
    };

    this.employeeComplaintGridMetaData = {
      grid: this.getGridObject('employeeComplaintGrid', 'Employee Complaints', '/rest/support/employeeComplaintList'),
      htmlDomElementId: 'employee-complaint-grid',
      hidden: false
    };

    this.resolvedComplaintGridMetaData = {
      grid: this.getGridObject('resolvedComplaintGrid', 'Resolved Complaints', '/rest/support/resolvedComplaintList'),
      htmlDomElementId: 'resolved-complaint-grid',
      hidden: false
    };
  }

  handleDataAccessRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.complaintDataAccess = {
        success: response.success,
        message: response.message,
        complaintAddressCapableAccess: response.complaintAddressCapableAccess
      };
      context.selectedComplaintRecord = context.interimHoldSelectedComplaintRecord;
      context.toggleVisibilityComplaintGrid();
    }
  }

  toggleVisibilityComplaintGrid() {
    if (this.showComplaintData === true) {
      this.showComplaintData = false;
      this.selectedComplaintRecord = null;
      setTimeout(() => {
        this.customerComplaintGridObject.init();
        this.tutorComplaintGridObject.init();
        this.employeeComplaintGridObject.init();
        this.resolvedComplaintGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.customerComplaintGridObject.refreshGridData();
        this.tutorComplaintGridObject.refreshGridData();
        this.employeeComplaintGridObject.refreshGridData();
        this.resolvedComplaintGridObject.refreshGridData();
      }, 200);
    } else {
      this.showComplaintData = true;
    }
  }

}

export interface ComplaintDataAccess {
  success: boolean;
  message: string;
  complaintAddressCapableAccess: boolean;
}
