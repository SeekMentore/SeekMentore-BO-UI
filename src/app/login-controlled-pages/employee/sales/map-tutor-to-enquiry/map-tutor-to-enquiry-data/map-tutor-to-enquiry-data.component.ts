import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { EnquiryMappingDataAccess } from '../map-tutor-to-enquiry.component';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { Column } from 'src/app/utils/grid/column';

@Component({
  selector: 'app-map-tutor-to-enquiry-data',
  templateUrl: './map-tutor-to-enquiry-data.component.html',
  styleUrls: ['./map-tutor-to-enquiry-data.component.css']
})
export class MapTutorToEnquiryDataComponent implements OnInit, AfterViewInit {

  @ViewChild('allMappingEligibleTutorsGrid')
  allMappingEligibleTutorsGridObject: GridComponent;
  allMappingEligibleTutorsGridMetaData: GridDataInterface;

  @ViewChild('allMappedTutorsGrid')
  allMappedTutorsGridObject: GridComponent;
  allMappedTutorsGridMetaData: GridDataInterface;

  @Input()
  enquiryRecord: GridRecord = null;

  @Input()
  enquiryMappingDataAccess: EnquiryMappingDataAccess = null;

  showMapTutorToEnquiryMappedTutorData = false;
  selectedTutorMapperSerialId: string = null;
  interimHoldSelectedTutorMapperSerialId: string = null;
  tutorMapperDataAccess: TutorMapperDataAccess = null;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  mappingStatusFilterOptions = CommonFilterOptions.mappingStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  tutorEligibilityCriteria : {
    matchSubject: boolean,
    matchGrade: boolean,
    matchTeachingType: boolean,
    matchLocation: boolean
  } = {
    matchSubject : false,
    matchGrade: false,
    matchTeachingType: false,
    matchLocation: false
  };

  searchTutorExtraParam : any = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.allMappingEligibleTutorsGridMetaData = null;
    this.allMappedTutorsGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.enquiryMappingDataAccess.enquiryMappingAccess) {
        this.allMappingEligibleTutorsGridObject.init();
        this.allMappingEligibleTutorsGridObject.addExtraParams('enquiryId', this.enquiryRecord.getProperty('enquiryId'));
        // Remaining extra params from the form will also go

        this.allMappedTutorsGridObject.init();
        this.allMappedTutorsGridObject.addExtraParams('enquiryId', this.enquiryRecord.getProperty('enquiryId'));
      }
    }, 0);
    setTimeout(() => {
      if (this.enquiryMappingDataAccess.enquiryMappingAccess) {
        this.allMappingEligibleTutorsGridObject.refreshGridData();
        this.allMappedTutorsGridObject.refreshGridData();
      }
    }, 0);
  }  

  public setUpGridMetaData() {
    this.allMappingEligibleTutorsGridMetaData = {
      grid: {
        id: 'allMappingEligibleTutorsGrid',
        title: 'Eligible Tutors',
        store: {
          isStatic: false,
          restURL: '/rest/sales/allMappingEligibleTutorsList',
          preLoad: (gridComponentObject: GridComponent) => {
            gridComponentObject.addExtraParams('searchTutorExtraParam', this.searchTutorExtraParam);
          }
        },
        columns: [{
          id: 'name',
          headerName: 'Name',
          dataType: 'string',
          mapping: 'name'          
        },{
          id: 'contactNumber',
          headerName: 'Contact Number',
          dataType: 'string',
          mapping: 'contactNumber'
        },{
          id: 'emailId',
          headerName: 'Email Id',
          dataType: 'string',
          mapping: 'emailId'
        },{
          id: 'gender',
          headerName: 'Gender',
          dataType: 'list',
          filterOptions: CommonFilterOptions.genderFilterOptions,
          mapping: 'gender',
          renderer: AdminCommonFunctions.genderRenderer
        },{
          id: 'qualification',
          headerName: 'Qualification',
          dataType: 'list',
          filterOptions: CommonFilterOptions.qualificationFilterOptions,
          mapping: 'qualification',
          renderer: AdminCommonFunctions.qualificationRenderer
        },{
          id: 'primaryProfession',
          headerName: 'Primary Profession',
          dataType: 'list',
          filterOptions: CommonFilterOptions.primaryProfessionFilterOptions,
          mapping: 'primaryProfession',
          renderer: AdminCommonFunctions.primaryProfessionRenderer
        },{
          id: 'transportMode',
          headerName: 'Transport Mode',
          dataType: 'list',
          filterOptions: CommonFilterOptions.transportModeFilterOptions,
          mapping: 'transportMode',
          renderer: AdminCommonFunctions.transportModeRenderer
        },{
          id: 'teachingExp',
          headerName: 'Teaching Experience',
          dataType: 'number',
          mapping: 'teachingExp'
        },{
          id: 'interestedStudentGrades',
          headerName: 'Interested Student Grades',
          dataType: 'list',
          filterOptions: CommonFilterOptions.studentGradesFilterOptions,
          mapping: 'interestedStudentGrades',
          multiList: true,
          renderer: AdminCommonFunctions.studentGradesMultiRenderer
        },{
          id: 'interestedSubjects',
          headerName: 'Interested Subjects',
          dataType: 'list',
          filterOptions: CommonFilterOptions.subjectsFilterOptions,
          mapping: 'interestedSubjects',
          multiList: true,
          renderer: AdminCommonFunctions.subjectsMultiRenderer
        },{
          id: 'comfortableLocations',
          headerName: 'Comfortable Locations',
          dataType: 'list',
          filterOptions: CommonFilterOptions.locationsFilterOptions,
          mapping: 'comfortableLocations',
          multiList: true,
          renderer: AdminCommonFunctions.locationsMultiRenderer
        },{
          id: 'additionalDetails',
          headerName: 'Additional Details',
          dataType: 'string',
          mapping: 'additionalDetails',
          lengthyData: true
        }],
        hasSelectionColumn: true,
        selectionColumn: {
          buttons: [{
            id: 'mapTutors',
            label: 'Map Tutors',
            btnclass: 'btnReset',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              const tutorIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tutorId');
              if (tutorIdsList.length === 0) {
                this.helperService.showAlertDialog({
                  isSuccess: false,
                  message: LcpConstants.grid_generic_no_record_selected_error,
                  onButtonClicked: () => {
                  }
                });
              } else {
                this.helperService.showConfirmationDialog({
                  message: 'Please confirm if you want to map the selected tutors to the Enquiry',
                  onOk: () => {
                    const data = {
                      parentSerialId: this.enquiryRecord.getProperty('enquiryId'),
                      allIdsList: tutorIdsList.join(';')
                    };
                    this.utilityService.makerequest(this, this.handleMappingRequest,
                      LcpRestUrls.map_tutor_to_enquiry_map_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                      'application/x-www-form-urlencoded');
                  },
                  onCancel: () => {
                  }
                });
              }
            }
          }]
        },
        hasActionColumn: true,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'mapTutor',
            label: 'Map Tutor',
            btnclass: 'btnReset',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              this.helperService.showConfirmationDialog({
                message: 'Please confirm if you want to map this tutor to the Enquiry',
                onOk: () => {
                  const data = {
                    parentSerialId: this.enquiryRecord.getProperty('enquiryId'),
                    allIdsList: record.getProperty('tutorId')
                  };
                  this.utilityService.makerequest(this, this.handleMappingRequest,
                    LcpRestUrls.map_tutor_to_enquiry_map_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                    'application/x-www-form-urlencoded');
                },
                onCancel: () => {
                }
              });
            }
          }]
        }
      },
      htmlDomElementId: 'all-mapping-eligible-tutors-grid',
      hidden: false,
    };

    this.allMappedTutorsGridMetaData = {
      grid: {
        id: 'allMappedTutorsGrid',
        title: 'Mapped Tutors',
        store: {
          isStatic: false,
          restURL: '/rest/sales/currentEnquiryAllMappedTutorsList'
        },
        columns: [{
          id: 'tutorMapperSerialId',
          headerName: 'Serial Id',
          dataType: 'string',
          mapping: 'tutorMapperSerialId',
          clickEvent: (record: GridRecord, column: Column, gridComponentObject :GridComponent) => {
            this.interimHoldSelectedTutorMapperSerialId = record.getProperty('tutorMapperSerialId');
            if (this.tutorMapperDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.tutor_mapper_data_access, 'POST', null, 'application/x-www-form-urlencoded');
            } else {
              this.selectedTutorMapperSerialId = this.interimHoldSelectedTutorMapperSerialId;            
              this.toggleVisibilityMappedTutorGrid();
            }
          }
        },{
          id: 'tutorName',
          headerName: 'Tutor Name',
          dataType: 'string',
          mapping: 'tutorName'
        },{
          id: 'tutorEmail',
          headerName: 'Tutor Email',
          dataType: 'string',
          mapping: 'tutorEmail'
        },{
          id: 'tutorContactNumber',
          headerName: 'Tutor Contact Number',
          dataType: 'string',
          mapping: 'tutorContactNumber'
        },{
          id: 'isTutorContacted',
          headerName: 'Is Tutor Contacted',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isTutorContacted',
          renderer: GridCommonFunctions.yesNoRenderer
        },{
          id: 'isTutorAgreed',
          headerName: 'Is Tutor Agreed',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isTutorAgreed',
          renderer: GridCommonFunctions.yesNoRenderer
        },{
          id: 'isDemoScheduled',
          headerName: 'Is Demo Scheduled',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isDemoScheduled',
          renderer: GridCommonFunctions.yesNoRenderer
        },{
          id: 'mappingStatus',
          headerName: 'Mapping Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.mappingStatusFilterOptions,
          mapping: 'mappingStatus',
          renderer: AdminCommonFunctions.mappingStatusRenderer
        },{
          id: 'quotedTutorRate',
          headerName: 'Quoted Tutor Rate',
          dataType: 'number',
          mapping: 'quotedTutorRate'
        },{
          id: 'negotiatedRateWithTutor',
          headerName: 'Negotiated Rate With Tutor',
          dataType: 'number',
          mapping: 'negotiatedRateWithTutor'
        },{
          id: 'tutorNegotiationRemarks',
          headerName: 'Tutor Negotiation Remarks',
          dataType: 'string',
          mapping: 'tutorNegotiationRemarks',
          lengthyData: true
        }],
        hasSelectionColumn: false,
        hasActionColumn: true,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'unmapTutor',
            label: 'Un-map Tutor',
            btnclass: 'btnReject',
            securityMapping: {
              isSecured: true,
              visible: 'showUnMap',
              enabled: 'enableUnMap'              
            },
            clickEvent: (record: GridRecord, button: ActionButton, gridComponentObject :GridComponent) => {
              button.disable();
              this.helperService.showConfirmationDialog({
                message: 'Please confirm if you want to un-map this tutor from the Enquiry',
                onOk: () => {
                  const data = {
                    allIdsList: record.getProperty('tutorMapperSerialId')
                  };
                  this.utilityService.makerequest(this, this.handleMappingRequest,
                    LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                    'application/x-www-form-urlencoded');
                  button.enable();
                },
                onCancel: () => {
                  button.enable();
                }
              });
            }
          }]
        }
      },
      htmlDomElementId: 'all-mapped-tutors-grid',
      hidden: false,
    };
  }

  public selectUnselectEligibility(clause: string, element: HTMLInputElement) {
    this.tutorEligibilityCriteria[clause] = element.checked;
  }

  handleMappingRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.allMappingEligibleTutorsGridObject.refreshGridData();
      context.allMappedTutorsGridObject.refreshGridData();
    }
  }

  searchEligibleMappingTutors() {
    this.searchTutorExtraParam = this.tutorEligibilityCriteria;
    this.allMappingEligibleTutorsGridObject.refreshGridData();
  }

  resetSearchEligibleMappingTutors() {
    this.tutorEligibilityCriteria['matchSubject'] = false;
    this.tutorEligibilityCriteria['matchGrade'] = false;
    this.tutorEligibilityCriteria['matchTeachingType'] = false;
    this.tutorEligibilityCriteria['matchLocation'] = false;
    this.searchTutorExtraParam = null;
    let elements: HTMLCollectionOf<Element> = document.getElementsByClassName('tutor-grid-eligibilty-criteria-checkbox');
    for (let i = 0; i < elements.length; i++) {
      (<HTMLInputElement>elements.item(i)).checked = false;
    }
    this.allMappingEligibleTutorsGridObject.refreshGridData();
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
      context.tutorMapperDataAccess = {
        success: response.success,
        message: response.message,
        tutorMapperFormAccess: response.tutorMapperFormAccess,
        scheduleDemoFormAccess: response.scheduleDemoFormAccess
      };
      context.selectedTutorMapperSerialId = context.interimHoldSelectedTutorMapperSerialId;
      context.toggleVisibilityMappedTutorGrid();
    }
  }

  toggleVisibilityMappedTutorGrid() {
    if (this.showMapTutorToEnquiryMappedTutorData === true) {
      this.showMapTutorToEnquiryMappedTutorData = false;
      this.selectedTutorMapperSerialId = null;
      const backToEnquiriesListingButton: HTMLElement = document.getElementById('back-to-all-enquiries-listing-button'); 
      backToEnquiriesListingButton.classList.remove('noscreen');
      setTimeout(() => {
        this.allMappingEligibleTutorsGridObject.init();
        this.allMappingEligibleTutorsGridObject.addExtraParams('enquiryId', this.enquiryRecord.getProperty('enquiryId'));
        // Remaining extra params from the form will also go

        this.allMappedTutorsGridObject.init();
        this.allMappedTutorsGridObject.addExtraParams('enquiryId', this.enquiryRecord.getProperty('enquiryId'));
      }, 100);   
      setTimeout(() => {
        this.allMappingEligibleTutorsGridObject.refreshGridData();
        this.allMappedTutorsGridObject.refreshGridData();
      }, 200);
    } else {
      const backToEnquiriesListingButton: HTMLElement = document.getElementById('back-to-all-enquiries-listing-button'); 
      backToEnquiriesListingButton.classList.add('noscreen');     
      this.showMapTutorToEnquiryMappedTutorData = true;
    }
  }

}

export interface TutorMapperDataAccess {
  success: boolean;
  message: string;
  tutorMapperFormAccess: boolean;
  scheduleDemoFormAccess: boolean;
}