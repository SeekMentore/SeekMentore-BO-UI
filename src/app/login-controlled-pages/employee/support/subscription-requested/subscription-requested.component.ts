import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {HelperService} from 'src/app/utils/helper.service';
import {Column} from 'src/app/utils/grid/column';
import {LcpRestUrls} from 'src/app/utils/lcp-rest-urls';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {AdminCommonFunctions} from 'src/app/utils/admin-common-functions';
import {ActionButton} from 'src/app/utils/grid/action-button';
import {LcpConstants} from 'src/app/utils/lcp-constants';
import { Router } from '@angular/router';
import { BreadCrumbEvent } from 'src/app/login-controlled-pages/bread-crumb/bread-crumb.component';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';

@Component({
  selector: 'app-subscription-requested',
  templateUrl: './subscription-requested.component.html',
  styleUrls: ['./subscription-requested.component.css']
})
export class SubscriptionRequestedComponent implements OnInit, AfterViewInit {

  @ViewChild('nonContactedSubscriptionGrid')
  nonContactedSubscriptionGridObject: GridComponent;
  nonContactedSubscriptionGridMetaData: GridDataInterface;

  @ViewChild('nonVerifiedSubscriptionGrid')
  nonVerifiedSubscriptionGridObject: GridComponent;
  nonVerifiedSubscriptionGridMetaData: GridDataInterface;

  @ViewChild('verifiedSubscriptionGrid')
  verifiedSubscriptionGridObject: GridComponent;
  verifiedSubscriptionGridMetaData: GridDataInterface;

  @ViewChild('verificationFailedSubscriptionGrid')
  verificationFailedSubscriptionGridObject: GridComponent;
  verificationFailedSubscriptionGridMetaData: GridDataInterface;

  @ViewChild('toBeReContactedSubscriptionGrid')
  toBeReContactedSubscriptionGridObject: GridComponent;
  toBeReContactedSubscriptionGridMetaData: GridDataInterface;

  @ViewChild('selectedSubscriptionGrid')
  selectedSubscriptionGridObject: GridComponent;
  selectedSubscriptionGridMetaData: GridDataInterface;

  @ViewChild('rejectedSubscriptionGrid')
  rejectedSubscriptionGridObject: GridComponent;
  rejectedSubscriptionGridMetaData: GridDataInterface;

  showSubscriptionData = false;
  selectedSubscriptionRecord: GridRecord = null;
  interimHoldSelectedSubscriptionRecord: GridRecord = null;
  subscriptionDataAccess: SubscriptionDataAccess = null;
  selectedRecordGridType: string = null;

  interimHoldSelectedSubscriptionGridObject: GridComponent = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) {
    this.nonContactedSubscriptionGridMetaData = null;
    this.nonVerifiedSubscriptionGridMetaData = null;
    this.verifiedSubscriptionGridMetaData = null;
    this.verificationFailedSubscriptionGridMetaData = null;
    this.toBeReContactedSubscriptionGridMetaData = null;
    this.selectedSubscriptionGridMetaData = null;
    this.rejectedSubscriptionGridMetaData = null;
    this.showSubscriptionData = false;
    this.selectedSubscriptionRecord = null;
    this.subscriptionDataAccess = null;
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
      this.nonContactedSubscriptionGridObject.init();
      this.nonVerifiedSubscriptionGridObject.init();
      this.verifiedSubscriptionGridObject.init();
      this.verificationFailedSubscriptionGridObject.init();
      this.toBeReContactedSubscriptionGridObject.init();
      this.selectedSubscriptionGridObject.init();
      this.rejectedSubscriptionGridObject.init();
    }, 0);

    setTimeout(() => {
      this.nonContactedSubscriptionGridObject.refreshGridData();
      this.nonVerifiedSubscriptionGridObject.refreshGridData();
      this.verifiedSubscriptionGridObject.refreshGridData();
      this.verificationFailedSubscriptionGridObject.refreshGridData();
      this.toBeReContactedSubscriptionGridObject.refreshGridData();
      this.selectedSubscriptionGridObject.refreshGridData();
      this.rejectedSubscriptionGridObject.refreshGridData();
    }, 0);
  }

  private getSelectionColumnBlacklistButton() {
    return {
      id: 'blacklist',
      label: 'Blacklist',
      btnclass: 'btnReject',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        this.interimHoldSelectedSubscriptionGridObject = gridComponentObject;
        const subscriptionIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tentativeSubscriptionId');
        if (subscriptionIdsList.length === 0) {
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
            placeholderText: 'Please provide your comments for blacklisting the subscriptions.',
            onOk: (message) => {
              const data = {
                allIdsList: subscriptionIdsList.join(';'),
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.blackList_subscription_request, 'POST', this.utilityService.urlEncodeData(data),
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
      columns: [
        {
          id: 'name',
          headerName: 'Name',
          dataType: 'string',
          mapping: 'firstName',
          renderer: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            return record.getProperty('firstName') + ' ' + record.getProperty('lastName');
          },
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            // Open the Data view port
            this.interimHoldSelectedSubscriptionRecord = record;
            this.selectedRecordGridType = gridComponentObject.grid.id;       
            if (this.subscriptionDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.subscription_request_data_access, 'POST', null, 'application/x-www-form-urlencoded');
            } else {
              this.selectedSubscriptionRecord = this.interimHoldSelectedSubscriptionRecord;
              this.toggleVisibilitySubscriptionGrid();
            }
          }
        },
        {
          id: 'applicationDate',
          headerName: 'Application Date',
          dataType: 'date',
          mapping: 'applicationDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        },
        {
          id: 'applicationStatus',
          headerName: 'Application Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.publicApplicationStatusFilterOptions,
          mapping: 'applicationStatus',
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
          multiList: true,
          renderer: AdminCommonFunctions.studentGradesMultiRenderer
        },
        {
          id: 'subjects',
          headerName: 'Subjects',
          dataType: 'list',
          filterOptions: CommonFilterOptions.subjectsFilterOptions,
          mapping: 'subjects',
          multiList: true,
          renderer: AdminCommonFunctions.subjectsMultiRenderer
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
        this.interimHoldSelectedSubscriptionGridObject = gridComponentObject;
        const subscriptionIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tentativeSubscriptionId');
        if (subscriptionIdsList.length === 0) {
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
                allIdsList: subscriptionIdsList.join(';'),
                button: actionText,
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.take_action_on_subscription, 'POST', this.utilityService.urlEncodeData(data),
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

    this.nonContactedSubscriptionGridMetaData = {
      grid: this.getGridObject('nonContactedSubscriptionGrid', 'Non Contacted Subscriptions', '/rest/support/nonContactedSubscriptionsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/nonContactedSubscriptionsList',
                              [this.getSelectionColumnBlacklistButton(), contactedButton, recontactButton, rejectButton]),
      htmlDomElementId: 'non-contacted-subscription-grid',
      hidden: false
    };

    this.nonVerifiedSubscriptionGridMetaData = {
      grid: this.getGridObject('nonVerifiedSubscriptionGrid', 'Non Verified Subscriptions', '/rest/support/nonVerifiedSubscriptionsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/nonVerifiedSubscriptionsList', 
                              [this.getSelectionColumnBlacklistButton(), verifyButton, failVerificationButton, rejectButton], true),
      htmlDomElementId: 'non-verified-subscription-grid',
      hidden: false
    };

    this.verifiedSubscriptionGridMetaData = {
      grid: this.getGridObject('verifiedSubscriptionGrid', 'Verified Subscriptions', '/rest/support/verifiedSubscriptionsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/verifiedSubscriptionsList', 
                              [this.getSelectionColumnBlacklistButton(), selectButton, rejectButton], true),
      htmlDomElementId: 'verified-subscription-grid',
      hidden: false
    };

    this.verificationFailedSubscriptionGridMetaData = {
      grid: this.getGridObject('verificationFailedSubscriptionGrid', 'Verification Failed Subscriptions', '/rest/support/verificationFailedSubscriptionsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/verificationFailedSubscriptionsList', 
                              [this.getSelectionColumnBlacklistButton(), reverifyButton, rejectButton], true),
      htmlDomElementId: 'verification-failed-subscription-grid',
      hidden: false
    };

    this.toBeReContactedSubscriptionGridMetaData = {
      grid: this.getGridObject('toBeReContactedSubscriptionGrid', 'To Be Re-Contacted Subscriptions', '/rest/support/toBeReContactedSubscriptionsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/toBeReContactedSubscriptionsList', 
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, rejectButton], true),
      htmlDomElementId: 'to-be-recontacted-subscription-grid',
      hidden: false
    };

    this.selectedSubscriptionGridMetaData = {
      grid: this.getGridObject('selectedSubscriptionGrid', 'Selected Subscriptions', '/rest/support/selectedSubscriptionsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/selectedSubscriptionsList', [], true),
      htmlDomElementId: 'selected-subscription-grid',
      hidden: false
    };

    this.rejectedSubscriptionGridMetaData = {
      grid: this.getGridObject('rejectedSubscriptionGrid', 'Rejected Subscriptions', '/rest/support/rejectedSubscriptionsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/rejectedSubscriptionsList', 
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, selectButton], true),
      htmlDomElementId: 'rejected-subscription-grid',
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
      context.subscriptionDataAccess = {
        success: response.success,
        message: response.message,
        formDataEditAccess: response.formDataEditAccess
      };
      context.selectedSubscriptionRecord = context.interimHoldSelectedSubscriptionRecord;
      context.toggleVisibilitySubscriptionGrid();
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
      context.interimHoldSelectedSubscriptionGridObject.refreshGridData();
    }
  }

  toggleVisibilitySubscriptionGrid() {
    if (this.showSubscriptionData === true) {
      this.showSubscriptionData = false;
      this.selectedSubscriptionRecord = null;
      setTimeout(() => {
        this.nonContactedSubscriptionGridObject.init();
        this.nonVerifiedSubscriptionGridObject.init();
        this.verifiedSubscriptionGridObject.init();
        this.verificationFailedSubscriptionGridObject.init();
        this.toBeReContactedSubscriptionGridObject.init();
        this.selectedSubscriptionGridObject.init();
        this.rejectedSubscriptionGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.nonContactedSubscriptionGridObject.refreshGridData();
        this.nonVerifiedSubscriptionGridObject.refreshGridData();
        this.verifiedSubscriptionGridObject.refreshGridData();
        this.verificationFailedSubscriptionGridObject.refreshGridData();
        this.toBeReContactedSubscriptionGridObject.refreshGridData();
        this.selectedSubscriptionGridObject.refreshGridData();
        this.rejectedSubscriptionGridObject.refreshGridData();
      }, 200);
    } else {
      this.showSubscriptionData = true;
    }
  }

}

export interface SubscriptionDataAccess {
  success: boolean;
  message: string;
  formDataEditAccess: boolean;
}
