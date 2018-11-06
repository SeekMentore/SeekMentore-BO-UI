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

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
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
    this.setUpGridMetaData();
  }

  ngOnInit() {
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
          mapping: 'firstName',
          renderer: (record: GridRecord, column: Column) => {
            return record.getProperty('firstName') + ' ' + record.getProperty('lastName');
          },
          clickEvent: (record: GridRecord, column: Column) => {
            // Open the Data view port
            this.interimHoldSelectedSubscriptionRecord = record;
            if (this.subscriptionDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.tutorDataAccess, 'POST');
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
          filterOptions: CommonFilterOptions.applicationStatusFilterOptions,
          mapping: 'applicationStatus'
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
                message: LcpConstants.tutor_grid_no_tutors_selected,
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
            const SubscriptionIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tentativeSubscriptionId');
            if (SubscriptionIdsList.length === 0) {
              this.helperService.showAlertDialog({
                isSuccess: false,
                message: LcpConstants.tutor_grid_no_record_selected_blacklist,
                onButtonClicked: () => {
                }
              });
            } else {
              const data = {
                tutorIdsList: SubscriptionIdsList.join(';'),
                comments: ''
              };
              this.utilityService.makerequest(this, this.handleBlackListRequest,
                LcpRestUrls.blackListRegisteredTutors, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            }
          }
        }]
      }
    }
    return grid;
  }

  public setUpGridMetaData() {
    this.nonContactedSubscriptionGridMetaData = {
      grid: this.getGridObject('nonContactedSubscriptionGrid', 'Non Contacted Subscriptions', '/rest/support/nonContactedSubscriptionsList'),
      htmlDomElementId: 'non-contacted-subscription-grid',
      hidden: false
    };

    this.nonVerifiedSubscriptionGridMetaData = {
      grid: this.getGridObject('nonVerifiedSubscriptionGrid', 'Non Verified Subscriptions', '/rest/support/nonVerifiedSubscriptionsList'),
      htmlDomElementId: 'non-verified-subscription-grid',
      hidden: false
    };

    this.verifiedSubscriptionGridMetaData = {
      grid: this.getGridObject('verifiedSubscriptionGrid', 'Verified Subscriptions', '/rest/support/verifiedSubscriptionsList'),
      htmlDomElementId: 'verified-subscription-grid',
      hidden: false
    };

    this.verificationFailedSubscriptionGridMetaData = {
      grid: this.getGridObject('verificationFailedSubscriptionGrid', 'Verification Failed Subscriptions', '/rest/support/verificationFailedSubscriptionsList'),
      htmlDomElementId: 'verification-failed-subscription-grid',
      hidden: false
    };

    this.toBeReContactedSubscriptionGridMetaData = {
      grid: this.getGridObject('toBeReContactedSubscriptionGrid', 'To Be Re-Contacted Subscriptions', '/rest/support/toBeReContactedSubscriptionsList'),
      htmlDomElementId: 'to-be-recontacted-subscription-grid',
      hidden: false
    };

    this.selectedSubscriptionGridMetaData = {
      grid: this.getGridObject('selectedSubscriptionGrid', 'Selected Subscriptions', '/rest/support/selectedSubscriptionsList'),
      htmlDomElementId: 'selected-subscription-grid',
      hidden: false
    };

    this.rejectedSubscriptionGridMetaData = {
      grid: this.getGridObject('rejectedSubscriptionGrid', 'Rejected Subscriptions', '/rest/support/rejectedSubscriptionsList'),
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

  handleBlackListRequest(context: any, response: any) {
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
