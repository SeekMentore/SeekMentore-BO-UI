import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent, GridDataInterface} from 'src/app/login-controlled-pages/grid/grid.component';
import {Column} from 'src/app/login-controlled-pages/grid/column';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {AdminCommonFunctions} from 'src/app/utils/admin-common-functions';
import {Record} from 'src/app/login-controlled-pages/grid/record';
import {ActionButton} from 'src/app/login-controlled-pages/grid/action-button';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {HelperService} from 'src/app/utils/helper.service';
import {LcpRestUrls} from 'src/app/utils/lcp-rest-urls';
import {LcpConstants} from "src/app/utils/lcp-constants";
import {GridCommonFunctions} from "src/app/login-controlled-pages/grid/grid-common-functions";

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
  selectedTutorRecord: Record = null;
  tutorDataAccess: RegisterTutorDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.registeredTutorGridMetaData = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
    this.showTutorData = false;
    this.selectedTutorRecord = null;
    this.tutorDataAccess = null;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.registeredTutorGridObject.init();
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
        columns: [{
          id: 'name',
          headerName: 'Name',
          dataType: 'string',
          mapping: 'name',
          clickEvent: (record: Record, column: Column) => {
            // Open the Data view port

            this.selectedTutorRecord = record;
            this.showTutorData = true;
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.tutorDataAccess, 'POST');
          }
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
          id: 'gender',
          headerName: 'Gender',
          dataType: 'list',
          filterOptions: CommonFilterOptions.genderFilterOptions,
          mapping: 'gender',
          renderer: AdminCommonFunctions.genderRenderer
        }, {
          id: 'qualification',
          headerName: 'Qualification',
          dataType: 'list',
          filterOptions: CommonFilterOptions.qualificationFilterOptions,
          mapping: 'qualification',
          renderer: AdminCommonFunctions.qualificationRenderer
        }, {
          id: 'primaryProfession',
          headerName: 'Primary Profession',
          dataType: 'list',
          filterOptions: CommonFilterOptions.primaryProfessionFilterOptions,
          mapping: 'primaryProfession',
          renderer: AdminCommonFunctions.primaryProfessionRenderer
        }, {
          id: 'transportMode',
          headerName: 'Transport Mode',
          dataType: 'list',
          filterOptions: CommonFilterOptions.transportModeFilterOptions,
          mapping: 'transportMode',
          renderer: AdminCommonFunctions.transportModeRenderer
        }, {
          id: 'teachingExp',
          headerName: 'Teaching Experience',
          dataType: 'number',
          mapping: 'teachingExp'
        }, {
          id: 'interestedStudentGrades',
          headerName: 'Interested Student Grades',
          dataType: 'list',
          filterOptions: CommonFilterOptions.interestedStudentGradesFilterOptions,
          mapping: 'interestedStudentGrades',
          renderer: AdminCommonFunctions.interestedStudentGradesMultiRenderer
        }, {
          id: 'interestedSubjects',
          headerName: 'Interested Subjects',
          dataType: 'list',
          filterOptions: CommonFilterOptions.interestedSubjectsFilterOptions,
          mapping: 'interestedSubjects',
          renderer: AdminCommonFunctions.interestedSubjectsMultiRenderer
        }, {
          id: 'comfortableLocations',
          headerName: 'Comfortable Locations',
          dataType: 'list',
          filterOptions: CommonFilterOptions.comfortableLocationsFilterOptions,
          mapping: 'comfortableLocations',
          renderer: AdminCommonFunctions.comfortableLocationsMultiRenderer
        }, {
          id: 'additionalDetails',
          headerName: 'Additional Details',
          dataType: 'string',
          mapping: 'additionalDetails'
        }],
        hasSelectionColumn: true,
        selectionColumn: {
          buttons: [{
            id: 'sendEmail',
            label: 'Send Email',
            clickEvent: (selectedRecords: Record[], button: ActionButton) => {
              // Refer document
              const selectedEmailsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'emailId');
              if (selectedEmailsList.length === 0) {
                this.helperService.showAlertDialog({
                  isSuccess: false,
                  message: LcpConstants.tutor_grid_no_mail_selected,
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
            clickEvent: (selectedRecords: Record[], button: ActionButton) => {
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
                  params: tutorIdsList.join(';'),
                  comments: ''
                };
                this.utilityService.makerequest(this, this.handleBlackListRequest,
                  LcpRestUrls.blackListRegisteredTutors, 'POST', data);
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
      context.tutorDataAccess = response;
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
