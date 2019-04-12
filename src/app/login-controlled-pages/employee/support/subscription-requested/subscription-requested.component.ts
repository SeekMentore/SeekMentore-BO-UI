import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-subscription-requested',
  templateUrl: './subscription-requested.component.html',
  styleUrls: ['./subscription-requested.component.css']
})
export class SubscriptionRequestedComponent implements OnInit, AfterViewInit {

  @ViewChild('nonContactedSubscribeWithUsGrid')
  nonContactedSubscribeWithUsGridObject: GridComponent;
  nonContactedSubscribeWithUsGridMetaData: GridDataInterface;

  @ViewChild('nonVerifiedSubscribeWithUsGrid')
  nonVerifiedSubscribeWithUsGridObject: GridComponent;
  nonVerifiedSubscribeWithUsGridMetaData: GridDataInterface;

  @ViewChild('verifiedSubscribeWithUsGrid')
  verifiedSubscribeWithUsGridObject: GridComponent;
  verifiedSubscribeWithUsGridMetaData: GridDataInterface;

  @ViewChild('verificationFailedSubscribeWithUsGrid')
  verificationFailedSubscribeWithUsGridObject: GridComponent;
  verificationFailedSubscribeWithUsGridMetaData: GridDataInterface;

  @ViewChild('toBeReContactedSubscribeWithUsGrid')
  toBeReContactedSubscribeWithUsGridObject: GridComponent;
  toBeReContactedSubscribeWithUsGridMetaData: GridDataInterface;

  @ViewChild('selectedSubscribeWithUsGrid')
  selectedSubscribeWithUsGridObject: GridComponent;
  selectedSubscribeWithUsGridMetaData: GridDataInterface;

  @ViewChild('rejectedSubscribeWithUsGrid')
  rejectedSubscribeWithUsGridObject: GridComponent;
  rejectedSubscribeWithUsGridMetaData: GridDataInterface;

  showSubscribeWithUsData = false;
  selectedSubscribeWithUsSerialId: string = null;
  interimHoldSelectedSubscribeWithUsSerialId: string = null;
  subscribeWithUsDataAccess: SubscribeWithUsDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) {
    this.nonContactedSubscribeWithUsGridMetaData = null;
    this.nonVerifiedSubscribeWithUsGridMetaData = null;
    this.verifiedSubscribeWithUsGridMetaData = null;
    this.verificationFailedSubscribeWithUsGridMetaData = null;
    this.toBeReContactedSubscribeWithUsGridMetaData = null;
    this.selectedSubscribeWithUsGridMetaData = null;
    this.rejectedSubscribeWithUsGridMetaData = null;
    this.showSubscribeWithUsData = false;
    this.selectedSubscribeWithUsSerialId = null;
    this.subscribeWithUsDataAccess = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
    this.helperService.setBreadCrumb({
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nonContactedSubscribeWithUsGridObject.init();
      this.nonVerifiedSubscribeWithUsGridObject.init();
      this.verifiedSubscribeWithUsGridObject.init();
      this.verificationFailedSubscribeWithUsGridObject.init();
      this.toBeReContactedSubscribeWithUsGridObject.init();
      this.selectedSubscribeWithUsGridObject.init();
      this.rejectedSubscribeWithUsGridObject.init();
    }, 100);

    setTimeout(() => {
      this.nonContactedSubscribeWithUsGridObject.refreshGridData();
      this.nonVerifiedSubscribeWithUsGridObject.refreshGridData();
      this.verifiedSubscribeWithUsGridObject.refreshGridData();
      this.verificationFailedSubscribeWithUsGridObject.refreshGridData();
      this.toBeReContactedSubscribeWithUsGridObject.refreshGridData();
      this.selectedSubscribeWithUsGridObject.refreshGridData();
      this.rejectedSubscribeWithUsGridObject.refreshGridData();
    }, 100);
  }

  expandAllGrids() {
    this.nonContactedSubscribeWithUsGridObject.expandGrid();
    this.nonVerifiedSubscribeWithUsGridObject.expandGrid();
    this.verifiedSubscribeWithUsGridObject.expandGrid();
    this.verificationFailedSubscribeWithUsGridObject.expandGrid();
    this.toBeReContactedSubscribeWithUsGridObject.expandGrid();
    this.selectedSubscribeWithUsGridObject.expandGrid();
    this.rejectedSubscribeWithUsGridObject.expandGrid();
  }

  collapseAllGrids() {
    this.nonContactedSubscribeWithUsGridObject.collapseGrid();
    this.nonVerifiedSubscribeWithUsGridObject.collapseGrid();
    this.verifiedSubscribeWithUsGridObject.collapseGrid();
    this.verificationFailedSubscribeWithUsGridObject.collapseGrid();
    this.toBeReContactedSubscribeWithUsGridObject.collapseGrid();
    this.selectedSubscribeWithUsGridObject.collapseGrid();
    this.rejectedSubscribeWithUsGridObject.collapseGrid();
  }

  private getSelectionColumnBlacklistButton() {
    return {
      id: 'blacklist',
      label: 'Blacklist',
      btnclass: 'btnReject',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        const subscribeWithUsSerialIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'subscribeWithUsSerialId');
        if (subscribeWithUsSerialIdsList.length === 0) {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: LcpConstants.grid_generic_no_record_selected_error,
            onButtonClicked: () => {
            }
          });
        } else {
          let extraContextProperties: {
            action: string,
            button: ActionButton,
            gridComponentObject: GridComponent
          } = {
            action: 'Blacklist',
            button: button,
            gridComponentObject: gridComponentObject
          };
          button.disable();
          gridComponentObject.showGridLoadingMask();
          this.helperService.showPromptDialog({
            required: true,
            titleText: 'Enter comments to Blacklist',
            placeholderText: 'Please provide your comments for blacklisting the subscriptions.',
            onOk: (message) => {
              const data = {
                allIdsList: subscribeWithUsSerialIdsList.join(';'),
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.blackList_subscribe_with_us, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded', false, null, extraContextProperties);
            },
            onCancel: () => {
              button.enable();
              gridComponentObject.hideGridLoadingMask();
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
          id: 'subscribeWithUsSerialId',
          headerName: 'Subscribe With Us Serial Id',
          dataType: 'string',
          mapping: 'subscribeWithUsSerialId',
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            this.interimHoldSelectedSubscribeWithUsSerialId = column.getValueForColumn(record);
            if (this.subscribeWithUsDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.subscribe_with_us_data_access, 'POST', null, 'application/x-www-form-urlencoded');
            } else {
              this.selectedSubscribeWithUsSerialId = this.interimHoldSelectedSubscribeWithUsSerialId;
              this.toggleVisibilitySubscribeWithUsGrid();
            }
          }
        }, {
          id: 'name',
          headerName: 'Name',
          dataType: 'string',
          mapping: 'firstName',
          clubbedMapping: true,
          clubbedProperties: ['firstName', 'lastName'],
          renderer: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            return record.getProperty('firstName') + ' ' + record.getProperty('lastName');
          }
        }, {
          id: 'applicationDate',
          headerName: 'Application Date',
          dataType: 'date',
          mapping: 'applicationDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        }, {
          id: 'applicationStatus',
          headerName: 'Application Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.publicApplicationStatusFilterOptions,
          mapping: 'applicationStatus',
          renderer: AdminCommonFunctions.publicApplicationStatusRenderer
        }, {
          id: 'contactNumber',
          headerName: 'Contact Number',
          dataType: 'string',
          mapping: 'contactNumber'
        }, {
          id: 'emailId',
          headerName: 'Email Id',
          dataType: 'string',
          mapping: 'emailId'
        }, {
          id: 'studentGrade',
          headerName: 'Student Grades',
          dataType: 'list',
          filterOptions: CommonFilterOptions.studentGradesFilterOptions,
          mapping: 'studentGrade',
          multiList: true,
          renderer: AdminCommonFunctions.studentGradesMultiRenderer
        }, {
          id: 'subjects',
          headerName: 'Subjects',
          dataType: 'list',
          filterOptions: CommonFilterOptions.subjectsFilterOptions,
          mapping: 'subjects',
          multiList: true,
          renderer: AdminCommonFunctions.subjectsMultiRenderer
        }, {
          id: 'location',
          headerName: 'Location',
          dataType: 'list',
          filterOptions: CommonFilterOptions.locationsFilterOptions,
          mapping: 'location',
          renderer: AdminCommonFunctions.locationsRenderer
        }, {
          id: 'preferredTimeToCall',
          headerName: 'Preferred Time To Call',
          dataType: 'list',
          filterOptions: CommonFilterOptions.preferredTimeToCallFilterOptions,
          mapping: 'preferredTimeToCall',
          multiList: true,
          renderer: AdminCommonFunctions.preferredTimeToCallMultiRenderer
        }, {
          id: 'additionalDetails',
          headerName: 'Additional Details',
          dataType: 'string',
          mapping: 'additionalDetails',
          lengthyData: true
        }, {
          id: 'addressDetails',
          headerName: 'Address Details',
          dataType: 'string',
          mapping: 'addressDetails',
          lengthyData: true
        }, {
          id: 'reference',
          headerName: 'Reference',
          dataType: 'list',
          filterOptions: CommonFilterOptions.referenceFilterOptions,
          mapping: 'reference',
          renderer: AdminCommonFunctions.referenceRenderer
        }],
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
        const subscriptionIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tentativeSubscriptionId');
        if (subscriptionIdsList.length === 0) {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: LcpConstants.grid_generic_no_record_selected_error,
            onButtonClicked: () => {
            }
          });
        } else {
          let extraContextProperties: {
            action: string,
            button: ActionButton,
            gridComponentObject: GridComponent
          } = {
            action: actionText,
            button: button,
            gridComponentObject: gridComponentObject
          };
          button.disable();
          gridComponentObject.showGridLoadingMask();
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
                LcpRestUrls.take_action_on_subscribe_with_us, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded', false, null, extraContextProperties);
            },
            onCancel: () => {
              button.enable();
              gridComponentObject.hideGridLoadingMask();
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

    this.nonContactedSubscribeWithUsGridMetaData = {
      grid: this.getGridObject('nonContactedSubscribeWithUsGrid', 'Non Contacted Subscriptions', '/rest/support/nonContactedSubscribeWithUsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/nonContactedSubscribeWithUsList',
                              [this.getSelectionColumnBlacklistButton(), contactedButton, recontactButton, rejectButton]),
      htmlDomElementId: 'non-contacted-subscribe-with-us-grid',
      hidden: false
    };
    this.nonVerifiedSubscribeWithUsGridMetaData = {
      grid: this.getGridObject('nonVerifiedSubscribeWithUsGrid', 'Non Verified Subscriptions', '/rest/support/nonVerifiedSubscribeWithUsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/nonVerifiedSubscribeWithUsList', 
                              [this.getSelectionColumnBlacklistButton(), verifyButton, failVerificationButton, rejectButton], true),
      htmlDomElementId: 'non-verified-subscribe-with-us-grid',
      hidden: false
    };
    this.verifiedSubscribeWithUsGridMetaData = {
      grid: this.getGridObject('verifiedSubscribeWithUsGrid', 'Verified Subscriptions', '/rest/support/verifiedSubscribeWithUsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/verifiedSubscribeWithUsList', 
                              [this.getSelectionColumnBlacklistButton(), selectButton, rejectButton], true),
      htmlDomElementId: 'verified-subscribe-with-us-grid',
      hidden: false
    };
    this.verificationFailedSubscribeWithUsGridMetaData = {
      grid: this.getGridObject('verificationFailedSubscribeWithUsGrid', 'Verification Failed Subscriptions', '/rest/support/verificationFailedSubscribeWithUsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/verificationFailedSubscribeWithUsList', 
                              [this.getSelectionColumnBlacklistButton(), reverifyButton, rejectButton], true),
      htmlDomElementId: 'verification-failed-subscribe-with-us-grid',
      hidden: false
    };
    this.toBeReContactedSubscribeWithUsGridMetaData = {
      grid: this.getGridObject('toBeReContactedSubscribeWithUsGrid', 'To Be Re-Contacted Subscriptions', '/rest/support/toBeReContactedSubscribeWithUsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/toBeReContactedSubscribeWithUsList', 
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, rejectButton], true),
      htmlDomElementId: 'to-be-recontacted-subscribe-with-us-grid',
      hidden: false
    };
    this.selectedSubscribeWithUsGridMetaData = {
      grid: this.getGridObject('selectedSubscribeWithUsGrid', 'Selected Subscriptions', '/rest/support/selectedSubscribeWithUsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/selectedSubscribeWithUsList', [], true),
      htmlDomElementId: 'selected-subscribe-with-us-grid',
      hidden: false
    };
    this.rejectedSubscribeWithUsGridMetaData = {
      grid: this.getGridObject('rejectedSubscribeWithUsGrid', 'Rejected Subscriptions', '/rest/support/rejectedSubscribeWithUsList', '/rest/support/downloadAdminReportSubscribeWithUsList', '/rejectedSubscribeWithUsList', 
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, selectButton], true),
      htmlDomElementId: 'rejected-subscribe-with-us-grid',
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
      context.subscribeWithUsDataAccess = {
        success: response.success,
        message: response.message,
        subscribeWithUsFormDataEditAccess: response.subscribeWithUsFormDataEditAccess
      };
      context.selectedSubscribeWithUsSerialId = context.interimHoldSelectedSubscribeWithUsSerialId;
      context.toggleVisibilitySubscribeWithUsGrid();
    }
  }

  handleSelectionActionRequest(context: any, response: any, extraContextProperties: Object) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      if (CommonUtilityFunctions.checkObjectAvailability(extraContextProperties)) {
        let action: string = extraContextProperties['action'];
        let button: ActionButton = extraContextProperties['button'];
        let gridComponentObject: GridComponent = extraContextProperties['gridComponentObject'];
        button.enable();
        gridComponentObject.hideGridLoadingMask();
        gridComponentObject.refreshGridData();
        switch(action) {
          case 'contacted' : {
            context.nonVerifiedSubscribeWithUsGridObject.refreshGridData();
            break;
          }
          case 'recontact' : {
            context.toBeReContactedSubscribeWithUsGridObject.refreshGridData();
            break;
          }
          case 'verify' : {
            context.verifiedSubscribeWithUsGridObject.refreshGridData();
            break;
          }
          case 'reverify' : {
            context.verifiedSubscribeWithUsGridObject.refreshGridData();
            break;
          }
          case 'recontacted' : {
            context.nonVerifiedSubscribeWithUsGridObject.refreshGridData();
            break;
          }
          case 'select' : {
            context.selectedSubscribeWithUsGridObject.refreshGridData();
            break;
          }
          case 'failverify' : {
            context.verificationFailedSubscribeWithUsGridObject.refreshGridData();
            break;
          }
          case 'reject' : {
            context.rejectedSubscribeWithUsGridObject.refreshGridData();
            break;
          }
        }
      } else {
        context.helperService.showAlertDialog({
          isSuccess: false,
          message: 'Extra properties got damaged in the process, please refresh the page',
          onButtonClicked: () => {
          }
        });
      }
    }
  }

  toggleVisibilitySubscribeWithUsGrid() {
    if (this.showSubscribeWithUsData === true) {
      this.showSubscribeWithUsData = false;
      this.selectedSubscribeWithUsSerialId = null;
      setTimeout(() => {
        this.nonContactedSubscribeWithUsGridObject.init();
        this.nonVerifiedSubscribeWithUsGridObject.init();
        this.verifiedSubscribeWithUsGridObject.init();
        this.verificationFailedSubscribeWithUsGridObject.init();
        this.toBeReContactedSubscribeWithUsGridObject.init();
        this.selectedSubscribeWithUsGridObject.init();
        this.rejectedSubscribeWithUsGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.nonContactedSubscribeWithUsGridObject.refreshGridData();
        this.nonVerifiedSubscribeWithUsGridObject.refreshGridData();
        this.verifiedSubscribeWithUsGridObject.refreshGridData();
        this.verificationFailedSubscribeWithUsGridObject.refreshGridData();
        this.toBeReContactedSubscribeWithUsGridObject.refreshGridData();
        this.selectedSubscribeWithUsGridObject.refreshGridData();
        this.rejectedSubscribeWithUsGridObject.refreshGridData();
      }, 200);
    } else {
      this.showSubscribeWithUsData = true;
    }
  }
}

export interface SubscribeWithUsDataAccess {
  success: boolean;
  message: string;
  subscribeWithUsFormDataEditAccess: boolean;
}
