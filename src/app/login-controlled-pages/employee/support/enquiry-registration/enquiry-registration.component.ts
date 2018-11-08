import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';

@Component({
  selector: 'app-enquiry-registration',
  templateUrl: './enquiry-registration.component.html',
  styleUrls: ['./enquiry-registration.component.css']
})
export class EnquiryRegistrationComponent implements OnInit, AfterViewInit {

  @ViewChild('nonContactedEnquiryGrid')
  nonContactedEnquiryGridObject: GridComponent;
  nonContactedEnquiryGridMetaData: GridDataInterface;

  @ViewChild('nonVerifiedEnquiryGrid')
  nonVerifiedEnquiryGridObject: GridComponent;
  nonVerifiedEnquiryGridMetaData: GridDataInterface;

  @ViewChild('verifiedEnquiryGrid')
  verifiedEnquiryGridObject: GridComponent;
  verifiedEnquiryGridMetaData: GridDataInterface;

  @ViewChild('verificationFailedEnquiryGrid')
  verificationFailedEnquiryGridObject: GridComponent;
  verificationFailedEnquiryGridMetaData: GridDataInterface;

  @ViewChild('toBeReContactedEnquiryGrid')
  toBeReContactedEnquiryGridObject: GridComponent;
  toBeReContactedEnquiryGridMetaData: GridDataInterface;

  @ViewChild('selectedEnquiryGrid')
  selectedEnquiryGridObject: GridComponent;
  selectedEnquiryGridMetaData: GridDataInterface;

  @ViewChild('rejectedEnquiryGrid')
  rejectedEnquiryGridObject: GridComponent;
  rejectedEnquiryGridMetaData: GridDataInterface;

  showEnquiryData = false;
  selectedEnquiryRecord: GridRecord = null;
  interimHoldSelectedEnquiryRecord: GridRecord = null;
  enquiryDataAccess: EnquiryDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.nonContactedEnquiryGridMetaData = null;
    this.nonVerifiedEnquiryGridMetaData = null;
    this.verifiedEnquiryGridMetaData = null;
    this.verificationFailedEnquiryGridMetaData = null;
    this.toBeReContactedEnquiryGridMetaData = null;
    this.selectedEnquiryGridMetaData = null;
    this.rejectedEnquiryGridMetaData = null;
    this.showEnquiryData = false;
    this.selectedEnquiryRecord = null;
    this.enquiryDataAccess = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nonContactedEnquiryGridObject.init();
      this.nonVerifiedEnquiryGridObject.init();
      this.verifiedEnquiryGridObject.init();
      this.verificationFailedEnquiryGridObject.init();
      this.toBeReContactedEnquiryGridObject.init();
      this.selectedEnquiryGridObject.init();
      this.rejectedEnquiryGridObject.init();
    }, 0);

    setTimeout(() => {
      this.nonContactedEnquiryGridObject.refreshGridData();
      this.nonVerifiedEnquiryGridObject.refreshGridData();
      this.verifiedEnquiryGridObject.refreshGridData();
      this.verificationFailedEnquiryGridObject.refreshGridData();
      this.toBeReContactedEnquiryGridObject.refreshGridData();
      this.selectedEnquiryGridObject.refreshGridData();
      this.rejectedEnquiryGridObject.refreshGridData();
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
            this.interimHoldSelectedEnquiryRecord = record;
            if (this.enquiryDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.enquiry_request_data_access, 'POST');
            } else {
              this.selectedEnquiryRecord = this.interimHoldSelectedEnquiryRecord;
              this.toggleVisibilityEnquiryGrid();
            }
          }
        },
        {
          id: 'enquiryDate',
          headerName: 'Enquiry Date',
          dataType: 'date',
          mapping: 'enquiryDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        },
        {
          id: 'enquiryStatus',
          headerName: 'Enquiry Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.enquiryStatusFilterOptions,
          mapping: 'enquiryStatus'
        },
        {
          id: 'contactNumber',
          headerName: 'Contact Number',
          dataType: 'string',
          mapping: 'contactNumber'
        },
        {
          id: 'emailId',
          headerName: 'Email Id',
          dataType: 'string',
          mapping: 'emailId'
        },
        {
          id: 'studentGrade',
          headerName: 'Student Grades',
          dataType: 'list',
          filterOptions: CommonFilterOptions.studentGradesFilterOptions,
          mapping: 'studentGrade',
          renderer: AdminCommonFunctions.studentGradesRenderer
        },
        {
          id: 'subjects',
          headerName: 'Subjects',
          dataType: 'list',
          filterOptions: CommonFilterOptions.subjectsFilterOptions,
          mapping: 'subjects',
          renderer: AdminCommonFunctions.subjectsRenderer
        },
        {
          id: 'locations',
          headerName: 'Locations',
          dataType: 'list',
          filterOptions: CommonFilterOptions.locationsFilterOptions,
          mapping: 'locations',
          renderer: AdminCommonFunctions.locationsRenderer
        },
        {
          id: 'preferredTimeToCall',
          headerName: 'Preferred Time To Call',
          dataType: 'list',
          filterOptions: CommonFilterOptions.preferredTimeToCallFilterOptions,
          mapping: 'preferredTimeToCall',
          multiList: true,
          renderer: AdminCommonFunctions.preferredTimeToCallMultiRenderer
        },
        {
          id: 'additionalDetails',
          headerName: 'Additional Details',
          dataType: 'string',
          mapping: 'additionalDetails',
          lengthyData: true
        },
        {
          id: 'addressDetails',
          headerName: 'Address Details',
          dataType: 'string',
          mapping: 'addressDetails',
          lengthyData: true
        },
        {
          id: 'reference',
          headerName: 'Reference',
          dataType: 'list',
          filterOptions: CommonFilterOptions.referenceFilterOptions,
          mapping: 'reference',
          renderer: AdminCommonFunctions.referenceRenderer
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
        }, {
          id: 'blacklist',
          label: 'Blacklist',
          btnclass: 'btnReject',
          clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
            const enquiryIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'enquiryId');
            if (enquiryIdsList.length === 0) {
              this.helperService.showAlertDialog({
                isSuccess: false,
                message: LcpConstants.grid_generic_no_record_selected_error,
                onButtonClicked: () => {
                }
              });
            } else {
              const data = {
                allIdsList: enquiryIdsList.join(';'),
                comments: ''
              };
              this.utilityService.makerequest(this, this.handleBlackListRequest,
                LcpRestUrls.blackList_enquiry_requests, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            }
          }
        }]
      }
    }
    return grid;
  }

  public setUpGridMetaData() {
    this.nonContactedEnquiryGridMetaData = {
      grid: this.getGridObject('nonContactedEnquiryGrid', 'Non Contacted Enquiries', '/rest/support/nonContactedEnquirysList'),
      htmlDomElementId: 'non-contacted-enquiry-grid',
      hidden: false
    };

    this.nonVerifiedEnquiryGridMetaData = {
      grid: this.getGridObject('nonVerifiedEnquiryGrid', 'Non Verified Enquiries', '/rest/support/nonVerifiedEnquirysList'),
      htmlDomElementId: 'non-verified-enquiry-grid',
      hidden: false
    };

    this.verifiedEnquiryGridMetaData = {
      grid: this.getGridObject('verifiedEnquiryGrid', 'Verified Enquiries', '/rest/support/verifiedEnquirysList'),
      htmlDomElementId: 'verified-enquiry-grid',
      hidden: false
    };

    this.verificationFailedEnquiryGridMetaData = {
      grid: this.getGridObject('verificationFailedEnquiryGrid', 'Verification Failed Enquiries', '/rest/support/verificationFailedEnquirysList'),
      htmlDomElementId: 'verification-failed-enquiry-grid',
      hidden: false
    };

    this.toBeReContactedEnquiryGridMetaData = {
      grid: this.getGridObject('toBeReContactedEnquiryGrid', 'To Be Re-Contacted Enquiries', '/rest/support/toBeReContactedEnquirysList'),
      htmlDomElementId: 'to-be-recontacted-enquiry-grid',
      hidden: false
    };

    this.selectedEnquiryGridMetaData = {
      grid: this.getGridObject('selectedEnquiryGrid', 'Selected Enquiries', '/rest/support/selectedEnquirysList'),
      htmlDomElementId: 'selected-enquiry-grid',
      hidden: false
    };

    this.rejectedEnquiryGridMetaData = {
      grid: this.getGridObject('rejectedEnquiryGrid', 'Rejected Enquiries', '/rest/support/rejectedEnquirysList'),
      htmlDomElementId: 'rejected-enquiry-grid',
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
      context.enquiryDataAccess = {
        success: response.success,
        message: response.message,
        formDataEditAccess: response.formDataEditAccess
      };
      context.selectedEnquiryRecord = context.interimHoldSelectedEnquiryRecord;
      context.toggleVisibilityEnquiryGrid();
    }
  }

  handleBlackListRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.interimHoldSelectedEnquiryGridObject.refreshGridData();
    }
  }

  toggleVisibilityEnquiryGrid() {
    if (this.showEnquiryData === true) {
      this.showEnquiryData = false;
      this.selectedEnquiryRecord = null;
      setTimeout(() => {
        this.nonContactedEnquiryGridObject.init();
        this.nonVerifiedEnquiryGridObject.init();
        this.verifiedEnquiryGridObject.init();
        this.verificationFailedEnquiryGridObject.init();
        this.toBeReContactedEnquiryGridObject.init();
        this.selectedEnquiryGridObject.init();
        this.rejectedEnquiryGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.nonContactedEnquiryGridObject.refreshGridData();
        this.nonVerifiedEnquiryGridObject.refreshGridData();
        this.verifiedEnquiryGridObject.refreshGridData();
        this.verificationFailedEnquiryGridObject.refreshGridData();
        this.toBeReContactedEnquiryGridObject.refreshGridData();
        this.selectedEnquiryGridObject.refreshGridData();
        this.rejectedEnquiryGridObject.refreshGridData();
      }, 200);
    } else {
      this.showEnquiryData = true;
    }
  }

}

export interface EnquiryDataAccess {
  success: boolean;
  message: string;
  formDataEditAccess: boolean;
}
