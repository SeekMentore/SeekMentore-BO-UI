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
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            // Open the Data view port
            this.interimHoldSelectedTutorRecord = record;            
            if (this.tutorDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.tutorDataAccess, 'POST');
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
          clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
            const tutorIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tentativeTutorId');
            if (tutorIdsList.length === 0) {
              this.helperService.showAlertDialog({
                isSuccess: false,
                message: LcpConstants.tutor_grid_no_record_selected_blacklist,
                onButtonClicked: () => {
                }
              });
            } else {
              const data = {
                tutorIdsList: tutorIdsList.join(';'),
                comments: ''
              };
              this.utilityService.makerequest(this, this.handleBlackListRequest,
                LcpRestUrls.blackListRegisteredTutors, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            }
          }
        }]
      }
    };
    return grid;
  }

  public setUpGridMetaData() {
    this.nonContactedBecomeTutorGridMetaData = {
      grid: this.getGridObject('nonContactedBecomeTutorGrid', 'Non Contacted Tutors', '/rest/support/nonContactedBecomeTutorsList'),
      htmlDomElementId: 'non-contacted-become-tutor-grid',
      hidden: false
    };

    this.nonVerifiedBecomeTutorGridMetaData = {
      grid: this.getGridObject('nonVerifiedBecomeTutorGrid', 'Non Verified Tutors', '/rest/support/nonVerifiedBecomeTutorsList'),
      htmlDomElementId: 'non-verified-become-tutor-grid',
      hidden: false
    };

    this.verifiedBecomeTutorGridMetaData = {
      grid: this.getGridObject('verifiedBecomeTutorGrid', 'Verified Tutors', '/rest/support/verifiedBecomeTutorsList'),
      htmlDomElementId: 'verified-become-tutor-grid',
      hidden: false
    };

    this.verificationFailedBecomeTutorGridMetaData = {
      grid: this.getGridObject('verificationFailedBecomeTutorGrid', 'Verification Failed Tutors', '/rest/support/verificationFailedBecomeTutorsList'),
      htmlDomElementId: 'verification-failed-become-tutor-grid',
      hidden: false
    };

    this.toBeReContactedBecomeTutorGridMetaData = {
      grid: this.getGridObject('toBeReContactedBecomeTutorGrid', 'To Be Re-Contacted Tutors', '/rest/support/toBeReContactedBecomeTutorsList'),
      htmlDomElementId: 'to-be-recontacted-become-tutor-grid',
      hidden: false
    };

    this.selectedBecomeTutorGridMetaData = {
      grid: this.getGridObject('selectedBecomeTutorGrid', 'Selected Tutors', '/rest/support/selectedBecomeTutorsList'),
      htmlDomElementId: 'selected-become-tutor-grid',
      hidden: false
    };

    this.rejectedBecomeTutorGridMetaData = {
      grid: this.getGridObject('rejectedBecomeTutorGrid', 'Rejected Tutors', '/rest/support/rejectedBecomeTutorsList'),
      htmlDomElementId: 'rejected-become-tutor-grid',
      hidden: false
    };

    this.registeredBecomeTutorGridMetaData = {
      grid: this.getGridObject('registeredBecomeTutorGrid', 'Registered Tutors', '/rest/support/registeredBecomeTutorsList'),
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

  handleBlackListRequest(context: any, response: any) {
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
