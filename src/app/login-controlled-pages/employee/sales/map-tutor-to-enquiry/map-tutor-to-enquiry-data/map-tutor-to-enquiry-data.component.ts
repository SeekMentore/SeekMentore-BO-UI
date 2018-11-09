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

@Component({
  selector: 'app-map-tutor-to-enquiry-data',
  templateUrl: './map-tutor-to-enquiry-data.component.html',
  styleUrls: ['./map-tutor-to-enquiry-data.component.css']
})
export class MapTutorToEnquiryDataComponent implements OnInit, AfterViewInit {

  @ViewChild('allMappingEligibleTutorsGrid')
  allMappingEligibleTutorsGridObject: GridComponent;
  allMappingEligibleTutorsGridMetaData: GridDataInterface;

  @ViewChild('allMappingEligibleTutorsGrid')
  allMappedTutorsGridObject: GridComponent;
  allMappedTutorsGridMetaData: GridDataInterface;

  @Input()
  enquiryRecord: GridRecord = null;

  @Input()
  enquiryMappingDataAccess: EnquiryMappingDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.allMappingEligibleTutorsGridMetaData = null;
    this.allMappedTutorsGridMetaData = null;
  }

  ngOnInit() {
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
          restURL: '/rest/sales/allMappingEligibleTutorsList'
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
                const data = {
                  allIdsList: tutorIdsList.join(';')
                };
                this.utilityService.makerequest(this, this.handleMappingRequest,
                  LcpRestUrls.map_tutor_to_enquiry_map_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                  'application/x-www-form-urlencoded');
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
            clickEvent: (record: GridRecord, button: ActionButton) => {
              const data = {
                tutorId: record.getProperty('tutorId')
              };
              this.utilityService.makerequest(this, this.handleMappingRequest,
                LcpRestUrls.map_tutor_to_enquiry_map_registered_tutor, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
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
          restURL: '/rest/sales/allMappedTutorsList'
        },
        columns: [{
          id: 'tutorName',
          headerName: 'Tutor Name',
          dataType: 'string',
          mapping: 'tutorName'          
        },{
          id: 'tutorContactNumber',
          headerName: 'Tutor Contact Number',
          dataType: 'string',
          mapping: 'tutorContactNumber'
        },{
          id: 'tutorEmail',
          headerName: 'Tutor Email Id',
          dataType: 'string',
          mapping: 'tutorEmail'
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
          mapping: 'mappingStatus'
        }],
        hasSelectionColumn: true,
        selectionColumn: {
          buttons: [{
            id: 'unmapTutors',
            label: 'Un-map Tutors',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              const tutorMapperIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tutorMapperId');
              if (tutorMapperIdsList.length === 0) {
                this.helperService.showAlertDialog({
                  isSuccess: false,
                  message: LcpConstants.grid_generic_no_record_selected_error,
                  onButtonClicked: () => {
                  }
                });
              } else {
                const data = {
                  allIdsList: tutorMapperIdsList.join(';')
                };
                this.utilityService.makerequest(this, this.handleMappingRequest,
                  LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
                  'application/x-www-form-urlencoded');
              }
            }
          }]
        },
        hasActionColumn: true,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'unmapTutor',
            label: 'Un-map Tutor',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              const data = {
                tutorMapperId: record.getProperty('tutorMapperId')
              };
              this.utilityService.makerequest(this, this.handleMappingRequest,
                LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutor, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            }
          }]
        }
      },
      htmlDomElementId: 'all-mapped-tutors-grid',
      hidden: false,
    };
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

}