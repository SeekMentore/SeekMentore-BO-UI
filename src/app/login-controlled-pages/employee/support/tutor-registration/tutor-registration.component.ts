import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {HelperService} from 'src/app/utils/helper.service';
import {Column} from 'src/app/utils/grid/column';
import {AdminCommonFunctions} from 'src/app/utils/admin-common-functions';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {ActionButton} from 'src/app/utils/grid/action-button';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {LcpConstants} from 'src/app/utils/lcp-constants';
import {LcpRestUrls} from 'src/app/utils/lcp-rest-urls';

@Component({
  selector: 'app-tutor-registration',
  templateUrl: './tutor-registration.component.html',
  styleUrls: ['./tutor-registration.component.css']
})
export class TutorRegistrationComponent implements OnInit, AfterViewInit {

  @ViewChild('nonContactedBecomeTutorGrid')
  nonContactedBecomeTutorGridObject: GridComponent;
  nonContactedBecomeTutorGridMetaData: GridDataInterface;

  @ViewChild('nonVerifiedBecomeTutorGrid')
  nonVerifiedBecomeTutorGridObject: GridComponent;
  nonVerifiedBecomeTutorGridMetaData: GridDataInterface;

  @ViewChild('verifiedBecomeTutorGrid')
  verifiedBecomeTutorGridObject: GridComponent;
  verifiedBecomeTutorGridMetaData: GridDataInterface;

  @ViewChild('verificationFailedBecomeTutorGrid')
  verificationFailedBecomeTutorGridObject: GridComponent;
  verificationFailedBecomeTutorGridMetaData: GridDataInterface;

  @ViewChild('toBeReContactedBecomeTutorGrid')
  toBeReContactedBecomeTutorGridObject: GridComponent;
  toBeReContactedBecomeTutorGridMetaData: GridDataInterface;

  @ViewChild('selectedBecomeTutorGrid')
  selectedBecomeTutorGridObject: GridComponent;
  selectedBecomeTutorGridMetaData: GridDataInterface;

  @ViewChild('rejectedBecomeTutorGrid')
  rejectedBecomeTutorGridObject: GridComponent;
  rejectedBecomeTutorGridMetaData: GridDataInterface;

  @ViewChild('registeredBecomeTutorGrid')
  registeredBecomeTutorGridObject: GridComponent;
  registeredBecomeTutorGridMetaData: GridDataInterface;

  showTutorData = false;
  selectedTutorRecord: GridRecord = null;
  interimHoldSelectedTutorRecord: GridRecord = null;  
  tutorDataAccess: BecomeTutorDataAccess = null;
  selectedRecordGridType: string = null;

  interimHoldSelectedTutorGridObject: GridComponent = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.nonContactedBecomeTutorGridMetaData = null;
    this.nonVerifiedBecomeTutorGridMetaData = null;
    this.verifiedBecomeTutorGridMetaData = null;
    this.verificationFailedBecomeTutorGridMetaData = null;
    this.toBeReContactedBecomeTutorGridMetaData = null;
    this.selectedBecomeTutorGridMetaData = null;
    this.rejectedBecomeTutorGridMetaData = null;
    this.registeredBecomeTutorGridMetaData = null;
    this.showTutorData = false;
    this.selectedTutorRecord = null;
    this.tutorDataAccess = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nonContactedBecomeTutorGridObject.init();
      this.nonVerifiedBecomeTutorGridObject.init();
      this.verifiedBecomeTutorGridObject.init();
      this.verificationFailedBecomeTutorGridObject.init();
      this.toBeReContactedBecomeTutorGridObject.init();
      this.selectedBecomeTutorGridObject.init();
      this.rejectedBecomeTutorGridObject.init();
      this.registeredBecomeTutorGridObject.init();
    }, 0);

    setTimeout(() => {
      this.nonContactedBecomeTutorGridObject.refreshGridData();
      this.nonVerifiedBecomeTutorGridObject.refreshGridData();
      this.verifiedBecomeTutorGridObject.refreshGridData();
      this.verificationFailedBecomeTutorGridObject.refreshGridData();
      this.toBeReContactedBecomeTutorGridObject.refreshGridData();
      this.selectedBecomeTutorGridObject.refreshGridData();
      this.rejectedBecomeTutorGridObject.refreshGridData();
      this.registeredBecomeTutorGridObject.refreshGridData();
    }, 0);
  }

  private getSelectionColumnBlacklistButton() {
    return {
      id: 'blacklist',
      label: 'Blacklist',
      btnclass: 'btnReject',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        this.interimHoldSelectedTutorGridObject = gridComponentObject;
        const tutorIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tentativeTutorId');
        if (tutorIdsList.length === 0) {
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
            placeholderText: 'Please provide your comments for blacklisting the tutors.',
            onOk: (message) => {                  
              const data = {
                allIdsList: tutorIdsList.join(';'),
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.blackList_become_tutors, 'POST', this.utilityService.urlEncodeData(data),
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
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
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
          mapping: 'firstName',
          clubbedMapping: true,
          clubbedProperties: ['firstName', 'lastName'],
          renderer: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            return record.getProperty('firstName') + ' ' + record.getProperty('lastName');
          },
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            // Open the Data view port
            this.interimHoldSelectedTutorRecord = record;
            this.selectedRecordGridType = gridComponentObject.grid.id;           
            if (this.tutorDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.become_tutor_data_access, 'POST', null, 'application/x-www-form-urlencoded');
            } else {
              this.selectedTutorRecord = this.interimHoldSelectedTutorRecord;
              this.toggleVisibilityBecomeTutorGrid();
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
          mapping: 'applicationStatus',
          renderer: AdminCommonFunctions.applicationStatusRenderer
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
          id: 'gender',
          headerName: 'Gender',
          dataType: 'list',
          filterOptions: CommonFilterOptions.genderFilterOptions,
          mapping: 'gender',
          renderer: AdminCommonFunctions.genderRenderer
        },
        {
          id: 'qualification',
          headerName: 'Qualification',
          dataType: 'list',
          filterOptions: CommonFilterOptions.qualificationFilterOptions,
          mapping: 'qualification',
          renderer: AdminCommonFunctions.qualificationRenderer
        },
        {
          id: 'primaryProfession',
          headerName: 'Primary Profession',
          dataType: 'list',
          filterOptions: CommonFilterOptions.primaryProfessionFilterOptions,
          mapping: 'primaryProfession',
          renderer: AdminCommonFunctions.primaryProfessionRenderer
        },
        {
          id: 'transportMode',
          headerName: 'Transport Mode',
          dataType: 'list',
          filterOptions: CommonFilterOptions.transportModeFilterOptions,
          mapping: 'transportMode',
          renderer: AdminCommonFunctions.transportModeRenderer
        },
        {
          id: 'teachingExp',
          headerName: 'Teaching Experience',
          dataType: 'number',
          mapping: 'teachingExp'
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
          multiList: true,
          renderer: AdminCommonFunctions.locationsMultiRenderer
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
        },
        {
          id: 'preferredTeachingType',
          headerName: 'Preferred Teaching Type',
          dataType: 'list',
          filterOptions: CommonFilterOptions.preferredTeachingTypeFilterOptions,
          mapping: 'preferredTeachingType',
          multiList: true,
          renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
        },
        {
          id: 'reApplied',
          headerName: 'Re-applied',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'reApplied',
          renderer: GridCommonFunctions.yesNoRenderer
        }
      ],
      hasSelectionColumn: true,
      selectionColumn: {
        buttons: this.getSelectionColumnBaseButton().concat(customSelectionButtons)
      }
    };
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
        this.interimHoldSelectedTutorGridObject = gridComponentObject;
        const tutorIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tentativeTutorId');
        if (tutorIdsList.length === 0) {
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
                allIdsList: tutorIdsList.join(';'),
                button: actionText,
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.take_action_on_become_tutor, 'POST', this.utilityService.urlEncodeData(data),
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

    this.nonContactedBecomeTutorGridMetaData = {
      grid: this.getGridObject('nonContactedBecomeTutorGrid', 'Non Contacted Tutors', '/rest/support/nonContactedBecomeTutorsList', '/rest/support/downloadAdminReportBecomeTutorList', '/nonContactedBecomeTutorsList',
                              [this.getSelectionColumnBlacklistButton(), contactedButton, recontactButton, rejectButton]),
      htmlDomElementId: 'non-contacted-become-tutor-grid',
      hidden: false
    };

    this.nonVerifiedBecomeTutorGridMetaData = {
      grid: this.getGridObject('nonVerifiedBecomeTutorGrid', 'Non Verified Tutors', '/rest/support/nonVerifiedBecomeTutorsList', '/rest/support/downloadAdminReportBecomeTutorList', '/nonVerifiedBecomeTutorsList',
                              [this.getSelectionColumnBlacklistButton(), verifyButton, failVerificationButton, rejectButton], true),
      htmlDomElementId: 'non-verified-become-tutor-grid',
      hidden: false
    };

    this.verifiedBecomeTutorGridMetaData = {
      grid: this.getGridObject('verifiedBecomeTutorGrid', 'Verified Tutors', '/rest/support/verifiedBecomeTutorsList', '/rest/support/downloadAdminReportBecomeTutorList', '/verifiedBecomeTutorsList',
                              [this.getSelectionColumnBlacklistButton(), selectButton, rejectButton], true),
      htmlDomElementId: 'verified-become-tutor-grid',
      hidden: false
    };

    this.verificationFailedBecomeTutorGridMetaData = {
      grid: this.getGridObject('verificationFailedBecomeTutorGrid', 'Verification Failed Tutors', '/rest/support/verificationFailedBecomeTutorsList', '/rest/support/downloadAdminReportBecomeTutorList', '/verificationFailedBecomeTutorsList',
                              [this.getSelectionColumnBlacklistButton(), reverifyButton, rejectButton], true),
      htmlDomElementId: 'verification-failed-become-tutor-grid',
      hidden: false
    };

    this.toBeReContactedBecomeTutorGridMetaData = {
      grid: this.getGridObject('toBeReContactedBecomeTutorGrid', 'To Be Re-Contacted Tutors', '/rest/support/toBeReContactedBecomeTutorsList', '/rest/support/downloadAdminReportBecomeTutorList', '/toBeReContactedBecomeTutorsList',
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, rejectButton], true),
      htmlDomElementId: 'to-be-recontacted-become-tutor-grid',
      hidden: false
    };

    this.selectedBecomeTutorGridMetaData = {
      grid: this.getGridObject('selectedBecomeTutorGrid', 'Selected Tutors', '/rest/support/selectedBecomeTutorsList', '/rest/support/downloadAdminReportBecomeTutorList', '/selectedBecomeTutorsList', [], true),
      htmlDomElementId: 'selected-become-tutor-grid',
      hidden: false
    };

    this.rejectedBecomeTutorGridMetaData = {
      grid: this.getGridObject('rejectedBecomeTutorGrid', 'Rejected Tutors', '/rest/support/rejectedBecomeTutorsList', '/rest/support/downloadAdminReportBecomeTutorList', '/rejectedBecomeTutorsList',
                            [this.getSelectionColumnBlacklistButton(), recontactedButton, selectButton], true),
      htmlDomElementId: 'rejected-become-tutor-grid',
      hidden: false
    };

    this.registeredBecomeTutorGridMetaData = {
      grid: this.getGridObject('registeredBecomeTutorGrid', 'Registered Tutors', '/rest/support/registeredBecomeTutorsList', '/rest/support/downloadAdminReportBecomeTutorList', '/registeredBecomeTutorsList', [], true),
      htmlDomElementId: 'registered-become-tutor-grid',
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
      context.tutorDataAccess = {
        success: response.success,
        message: response.message,
        formDataEditAccess: response.formDataEditAccess
      };
      context.selectedTutorRecord = context.interimHoldSelectedTutorRecord;
      context.toggleVisibilityBecomeTutorGrid();
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
      context.interimHoldSelectedTutorGridObject.refreshGridData();
    }
  }

  toggleVisibilityBecomeTutorGrid() {
    if (this.showTutorData === true) {
      this.showTutorData = false;
      this.selectedTutorRecord = null;
      setTimeout(() => {
        this.nonContactedBecomeTutorGridObject.init();
        this.nonVerifiedBecomeTutorGridObject.init();
        this.verifiedBecomeTutorGridObject.init();
        this.verificationFailedBecomeTutorGridObject.init();
        this.toBeReContactedBecomeTutorGridObject.init();
        this.selectedBecomeTutorGridObject.init();
        this.rejectedBecomeTutorGridObject.init();
        this.registeredBecomeTutorGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.nonContactedBecomeTutorGridObject.refreshGridData();
        this.nonVerifiedBecomeTutorGridObject.refreshGridData();
        this.verifiedBecomeTutorGridObject.refreshGridData();
        this.verificationFailedBecomeTutorGridObject.refreshGridData();
        this.toBeReContactedBecomeTutorGridObject.refreshGridData();
        this.selectedBecomeTutorGridObject.refreshGridData();
        this.rejectedBecomeTutorGridObject.refreshGridData();
        this.registeredBecomeTutorGridObject.refreshGridData();
      }, 200);
    } else {
      this.showTutorData = true;
    }
  }

}

export interface BecomeTutorDataAccess {
  success: boolean;
  message: string;
  formDataEditAccess: boolean;
}
