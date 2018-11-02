import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AdminCommonFunctions} from 'src/app/utils/admin-common-functions';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {ActionButton} from 'src/app/utils/grid/action-button';
import {Column} from 'src/app/utils/grid/column';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {HelperService} from 'src/app/utils/helper.service';
import {LcpConstants} from "src/app/utils/lcp-constants";
import {LcpRestUrls} from 'src/app/utils/lcp-rest-urls';

@Component({
  selector: 'app-registered-tutor',
  templateUrl: './registered-tutor.component.html',
  styleUrls: ['./registered-tutor.component.css']
})
export class RegisteredTutorComponent implements OnInit, AfterViewInit {

  @ViewChild('registeredTutorGrid')
  registeredTutorGridObject: GridComponent;
  registeredTutorGridMetaData: GridDataInterface;

  showTutorData = false;
  selectedTutorRecord: GridRecord = null;
  interimHoldSelectedTutorRecord: GridRecord = null;
  tutorDataAccess: RegisterTutorDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.registeredTutorGridMetaData = null;
    this.showTutorData = false;
    this.selectedTutorRecord = null;
    this.tutorDataAccess = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
    console.log('Registered Tutor');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.registeredTutorGridObject.init();
    }, 0);

    setTimeout(() => {
      this.registeredTutorGridObject.refreshGridData();
    }, 0);
  }

  public setUpGridMetaData() {
    this.registeredTutorGridMetaData = {
      grid: {
        id: 'registeredTutorGrid',
        title: 'Registered Tutors',
        store: {
          isStatic: false,
          restURL: '/rest/admin/registeredTutorsList'
        },
        columns: [
          {
            id: 'name',
            headerName: 'Name',
            dataType: 'string',
            mapping: 'name',
            clickEvent: (record: GridRecord, column: Column) => {
              // Open the Data view port
              this.interimHoldSelectedTutorRecord = record;
              if (this.tutorDataAccess === null) {
                this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.tutorDataAccess, 'POST');
              } else {
                this.selectedTutorRecord = this.interimHoldSelectedTutorRecord;
                this.toggleVisibilityRegisterTutorGrid();
              }
            }
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
            id: 'interestedStudentGrades',
            headerName: 'Interested Student Grades',
            dataType: 'list',
            filterOptions: CommonFilterOptions.studentGradesFilterOptions,
            mapping: 'interestedStudentGrades',
            multiList: true,
            renderer: AdminCommonFunctions.studentGradesMultiRenderer
          },
          {
            id: 'interestedSubjects',
            headerName: 'Interested Subjects',
            dataType: 'list',
            filterOptions: CommonFilterOptions.subjectsFilterOptions,
            mapping: 'interestedSubjects',
            multiList: true,
            renderer: AdminCommonFunctions.subjectsMultiRenderer
          },
          {
            id: 'comfortableLocations',
            headerName: 'Comfortable Locations',
            dataType: 'list',
            filterOptions: CommonFilterOptions.locationsFilterOptions,
            mapping: 'comfortableLocations',
            multiList: true,
            renderer: AdminCommonFunctions.locationsMultiRenderer
          },
          {
            id: 'additionalDetails',
            headerName: 'Additional Details',
            dataType: 'string',
            mapping: 'additionalDetails',
            lengthyData: true
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
              const tutorIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tutorId');
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
      },
      htmlDomElementId: 'registered-tutor-grid',
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
        documentViewAccess: response.documentViewAccess,
        documentHandleAccess: response.documentHandleAccess,
        bankViewAccess: response.bankViewAccess,
        bankHandleAccess: response.bankHandleAccess,
        formDataEditAccess: response.formDataEditAccess,
        activePackageViewAccess: response.activePackageViewAccess,
        historyPackagesViewAccess: response.historyPackagesViewAccess,
      };

      context.selectedTutorRecord = context.interimHoldSelectedTutorRecord;
      context.toggleVisibilityRegisterTutorGrid();
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
      context.registeredTutorGridObject.refreshGridData();
    }
  }

  toggleVisibilityRegisterTutorGrid() {
    // console.log("toogle visiibilty", this.showTutorData);
    if (this.showTutorData === true) {
      this.showTutorData = false;
      this.selectedTutorRecord = null;
      setTimeout(() => {
        this.registeredTutorGridObject.init();

      }, 0);
      setTimeout(() => {
        this.registeredTutorGridObject.refreshGridData();
      }, 0);

    } else {
      this.showTutorData = true;
    }

  }
}

export interface RegisterTutorDataAccess {
  success: boolean;
  message: string;
  documentViewAccess: boolean;
  documentHandleAccess: boolean;
  bankViewAccess: boolean;
  bankHandleAccess: boolean;
  formDataEditAccess: boolean;
  activePackageViewAccess: boolean;
  historyPackagesViewAccess: boolean;
}
