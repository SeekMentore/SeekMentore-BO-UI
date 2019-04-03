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
import { Router } from '@angular/router';
import { BreadCrumbEvent } from 'src/app/login-controlled-pages/bread-crumb/bread-crumb.component';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';

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
  selectedRecordGridType: string = null;

  interimHoldSelectedEnquiryGridObject: GridComponent = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) {
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
  }

  ngOnInit() {
    this.setUpGridMetaData();
    const breadCrumb: BreadCrumbEvent = {
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    };
    this.helperService.setBreadCrumb(breadCrumb);
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

  private getSelectionColumnBlacklistButton() {
    return {
      id: 'blacklist',
      label: 'Blacklist',
      btnclass: 'btnReject',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        this.interimHoldSelectedEnquiryGridObject = gridComponentObject;
        const enquiryIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'enquiryId');
        if (enquiryIdsList.length === 0) {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: LcpConstants.grid_generic_no_record_selected_error,
            onButtonClicked: () => {
            }
          });
        } else {
          this.helperService.showPromptDialog({
            required: true,
            titleText: 'Enter comments to Blacklist',
            placeholderText: 'Please provide your comments for blacklisting the enquiries.',
            onOk: (message) => {
              const data = {
                allIdsList: enquiryIdsList.join(';'),
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.blackList_enquiry_requests, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            },
            onCancel: () => {
            }
          });              
        }
      }
    };
  }

  private getSelectionColumnBaseButton() {
    return [{
      id: 'sendEmail',
      label: 'Send Email',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
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
    }];
  }

  public getGridObject(id: string, title: string, restURL: string, downloadURL: string, gridExtraParam: string, customSelectionButtons: any[], collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL,
        download: {
          url: downloadURL,
          preDownload: (gridComponentObject: GridComponent) => {
            gridComponentObject.addExtraParams('grid', gridExtraParam);
          }
        }
      },
      columns: [{
          id: 'name',
          headerName: 'Name',
          dataType: 'string',
          mapping: 'name',
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            this.interimHoldSelectedEnquiryRecord = record;
            this.selectedRecordGridType = gridComponentObject.grid.id;    
            if (this.enquiryDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.enquiry_request_data_access, 'POST', null, 'application/x-www-form-urlencoded');
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
          filterOptions: CommonFilterOptions.publicApplicationStatusFilterOptions,
          mapping: 'enquiryStatus',
          renderer: AdminCommonFunctions.publicApplicationStatusRenderer
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
          id: 'location',
          headerName: 'Location',
          dataType: 'list',
          filterOptions: CommonFilterOptions.locationsFilterOptions,
          mapping: 'location',
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
        buttons: this.getSelectionColumnBaseButton().concat(customSelectionButtons)
      }
    }
    return grid;
  }

  private getCustomButton (
      id:string, 
      label: string, 
      btnclass: string = 'btnSubmit', 
      actionText: string, 
      commentsRequired: boolean = false,
      titleText: string,
      placeholderText: string
  ) {
    return {
      id: id,
      label: label,
      btnclass: btnclass,
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        this.interimHoldSelectedEnquiryGridObject = gridComponentObject;
        const enquiryIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'enquiryId');
        if (enquiryIdsList.length === 0) {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: LcpConstants.grid_generic_no_record_selected_error,
            onButtonClicked: () => {
            }
          });
        } else {
          this.helperService.showPromptDialog({
            required: commentsRequired,
            titleText: titleText,
            placeholderText: placeholderText,
            onOk: (message) => {                  
              const data = {
                allIdsList: enquiryIdsList.join(';'),
                button: actionText,
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.take_action_on_find_tutor, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            },
            onCancel: () => {
            }
          });
        }
      }
    };
  }

  public setUpGridMetaData() {
    let contactedButton = this.getCustomButton('contacted', 'Contacted', 'btnSubmit', 'contacted', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let recontactButton = this.getCustomButton('recontact', 'To Be Re-Contacted', 'btnReset', 'recontact', true, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let verifyButton = this.getCustomButton('verify', 'Verify', 'btnSubmit', 'verify', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let reverifyButton = this.getCustomButton('reverify', 'Re-Verify', 'btnSubmit', 'reverify', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let recontactedButton = this.getCustomButton('recontacted', 'Re-Contacted', 'btnReset', 'recontacted', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let selectButton = this.getCustomButton('select', 'Select', 'btnSubmit', 'select', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let failVerificationButton = this.getCustomButton('failverify', 'Fail Verify', 'btnReject', 'failverify', true, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let rejectButton = this.getCustomButton('reject', 'Reject', 'btnReject', 'reject', true, 'Enter comments for action', 'Please provide your comments for taking the action.');

    this.nonContactedEnquiryGridMetaData = {
      grid: this.getGridObject('nonContactedEnquiryGrid', 'Non Contacted Enquiries', '/rest/support/nonContactedEnquiriesList', '/rest/support/downloadAdminReportFindTutorList', '/nonContactedEnquiriesList',
                              [this.getSelectionColumnBlacklistButton(), contactedButton, recontactButton, rejectButton]),
      htmlDomElementId: 'non-contacted-enquiry-grid',
      hidden: false
    };

    this.nonVerifiedEnquiryGridMetaData = {
      grid: this.getGridObject('nonVerifiedEnquiryGrid', 'Non Verified Enquiries', '/rest/support/nonVerifiedEnquiriesList', '/rest/support/downloadAdminReportFindTutorList', '/nonVerifiedEnquiriesList', 
                              [this.getSelectionColumnBlacklistButton(), verifyButton, failVerificationButton, rejectButton], true),
      htmlDomElementId: 'non-verified-enquiry-grid',
      hidden: false
    };

    this.verifiedEnquiryGridMetaData = {
      grid: this.getGridObject('verifiedEnquiryGrid', 'Verified Enquiries', '/rest/support/verifiedEnquiriesList', '/rest/support/downloadAdminReportFindTutorList', '/verifiedEnquiriesList', 
                              [this.getSelectionColumnBlacklistButton(), selectButton, rejectButton], true),
      htmlDomElementId: 'verified-enquiry-grid',
      hidden: false
    };

    this.verificationFailedEnquiryGridMetaData = {
      grid: this.getGridObject('verificationFailedEnquiryGrid', 'Verification Failed Enquiries', '/rest/support/verificationFailedEnquiriesList', '/rest/support/downloadAdminReportFindTutorList', '/verificationFailedEnquiriesList', 
                              [this.getSelectionColumnBlacklistButton(), reverifyButton, rejectButton], true),
      htmlDomElementId: 'verification-failed-enquiry-grid',
      hidden: false
    };

    this.toBeReContactedEnquiryGridMetaData = {
      grid: this.getGridObject('toBeReContactedEnquiryGrid', 'To Be Re-Contacted Enquiries', '/rest/support/toBeReContactedEnquiriesList', '/rest/support/downloadAdminReportFindTutorList', '/toBeReContactedEnquiriesList', 
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, rejectButton], true),
      htmlDomElementId: 'to-be-recontacted-enquiry-grid',
      hidden: false
    };

    this.selectedEnquiryGridMetaData = {
      grid: this.getGridObject('selectedEnquiryGrid', 'Selected Enquiries', '/rest/support/selectedEnquiriesList', '/rest/support/downloadAdminReportFindTutorList', '/selectedEnquiriesList', [], true),
      htmlDomElementId: 'selected-enquiry-grid',
      hidden: false
    };

    this.rejectedEnquiryGridMetaData = {
      grid: this.getGridObject('rejectedEnquiryGrid', 'Rejected Enquiries', '/rest/support/rejectedEnquiriesList', '/rest/support/downloadAdminReportFindTutorList', '/rejectedEnquiriesList', 
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, selectButton], true),
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

  handleSelectionActionRequest(context: any, response: any) {
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
