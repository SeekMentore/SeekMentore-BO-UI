import { Component, Input, OnInit } from '@angular/core';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { BecomeTutorDataAccess } from 'src/app/login-controlled-pages/employee/support/tutor-registration/tutor-registration.component';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';

@Component({
  selector: 'app-become-tutor-data',
  templateUrl: './become-tutor-data.component.html',
  styleUrls: ['./become-tutor-data.component.css']
})
export class BecomeTutorDataComponent implements OnInit {

  @Input()
  tutorRecord: GridRecord = null;

  @Input()
  tutorDataAccess: BecomeTutorDataAccess = null;

  updatedTutorRecord = {};

  showEmployeeActionDetails = false;

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  applicationStatusFilterOptions = CommonFilterOptions.applicationStatusFilterOptions;
  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  primaryProfessionFilterOptions = CommonFilterOptions.primaryProfessionFilterOptions;
  transportModeFilterOptions = CommonFilterOptions.transportModeFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  selectedGenderOption: any[] = [];
  selectedQualificationOption: any[] = [];
  selectedProfessionOption: any[] = [];
  selectedTransportOption: any[] = [];
  selectedStudentGradeOptions: any[] = [];
  selectedSubjectOptions: any[] = [];
  selectedLocationOptions: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];
  selectedTeachingTypeOptions: any[] = [];  

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.selectedGenderOption = CommonUtilityFunctions.getSelectedFilterItems(this.genderFilterOptions, this.tutorRecord.getProperty('gender'));
    this.selectedQualificationOption = CommonUtilityFunctions.getSelectedFilterItems(this.qualificationFilterOptions, this.tutorRecord.getProperty('qualification'));
    this.selectedProfessionOption = CommonUtilityFunctions.getSelectedFilterItems(this.primaryProfessionFilterOptions, this.tutorRecord.getProperty('primaryProfession'));
    this.selectedTransportOption = CommonUtilityFunctions.getSelectedFilterItems(this.transportModeFilterOptions, this.tutorRecord.getProperty('transportMode'));
    this.selectedStudentGradeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.tutorRecord.getProperty('studentGrade'));
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.tutorRecord.getProperty('subjects'));
    this.selectedLocationOptions = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.tutorRecord.getProperty('locations'));
    this.selectedCallTimeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.tutorRecord.getProperty('preferredTimeToCall'));
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.tutorRecord.getProperty('reference'));
    this.selectedTeachingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTeachingTypeFilterOptions, this.tutorRecord.getProperty('preferredTeachingType'));    
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getDateForDateInputParam(value: any) {
    return CommonUtilityFunctions.getDateForDateInputParam(value);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);;
  }

  updateTutorProperty(key: string, value: string, data_type: string, event: any = null, deselected: boolean = false, isAllOPeration: boolean = false) {    
    CommonUtilityFunctions.updateRecordProperty(key, value, data_type, this.updatedTutorRecord, this.tutorRecord, event, deselected, isAllOPeration);    
  }

  updateTutorRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.updatedTutorRecord, this.tutorRecord.getProperty('tentativeTutorId'));
    this.utilityService.makerequest(this, this.onUpdateTutorRecord, LcpRestUrls.become_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateTutorRecord(context: any, data: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: data['success'],
      message: data['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (data['success']) {
      context.editRecordForm = false;
    } 
  }
}
