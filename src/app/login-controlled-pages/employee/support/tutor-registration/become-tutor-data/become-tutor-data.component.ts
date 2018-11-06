import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { BecomeTutorDataAccess } from '../tutor-registration.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';
import {AppUtilityService} from "../../../../../utils/app-utility.service";
import {HelperService} from "../../../../../utils/helper.service";
import {LcpRestUrls} from "../../../../../utils/lcp-rest-urls";
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

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

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptions;

  multiSelectOptions = CommonFilterOptions.multiSelectOptions;

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

  selectedApplicationStatus: any[] = [];
  selectedGenderOption: any[] = [];
  selectedQualificationOption: any[] = [];
  selectedProfessionOption: any[] = [];
  selectedTransportOption: any[] = [];
  selectedStudentGradeOptions: any[] = [];
  selectedSubjectOptions: any[] = [];
  selectedLocationOptions: any[] = [];
  selectedCallTimeOption: any[] = [];
  selectedReferenceOption: any[] = [];
  selectedTeachingTypeOptions: any[] = [];
  selectedReAppliedOptions: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.selectedApplicationStatus = CommonFilterOptions.getSelectedFilterItems(this.applicationStatusFilterOptions, this.tutorRecord.getProperty('applicationStatus'));
    this.selectedGenderOption = CommonFilterOptions.getSelectedFilterItems(this.genderFilterOptions, this.tutorRecord.getProperty('gender'));
    this.selectedQualificationOption = CommonFilterOptions.getSelectedFilterItems(this.qualificationFilterOptions, this.tutorRecord.getProperty('qualification'));
    this.selectedProfessionOption = CommonFilterOptions.getSelectedFilterItems(this.primaryProfessionFilterOptions, this.tutorRecord.getProperty('primaryProfession'));
    this.selectedTransportOption = CommonFilterOptions.getSelectedFilterItems(this.transportModeFilterOptions, this.tutorRecord.getProperty('transportMode'));
    this.selectedStudentGradeOptions = CommonFilterOptions.getSelectedFilterItems(this.studentGradesFilterOptions, this.tutorRecord.getProperty('studentGrade'));
    this.selectedSubjectOptions = CommonFilterOptions.getSelectedFilterItems(this.subjectsFilterOptions, this.tutorRecord.getProperty('subjects'));
    this.selectedLocationOptions = CommonFilterOptions.getSelectedFilterItems(this.locationsFilterOptions, this.tutorRecord.getProperty('locations'));
    this.selectedCallTimeOption = CommonFilterOptions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.tutorRecord.getProperty('preferredTimeToCall'));
    this.selectedReferenceOption = CommonFilterOptions.getSelectedFilterItems(this.referenceFilterOptions, this.tutorRecord.getProperty('reference'));
    this.selectedTeachingTypeOptions = CommonFilterOptions.getSelectedFilterItems(this.preferredTeachingTypeFilterOptions, this.tutorRecord.getProperty('preferredTeachingType'));
    this.selectedReAppliedOptions = CommonFilterOptions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorRecord.getProperty('reApplied'));
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  updateTutorProperty(key: string, value: string, data_type: string) {
    CommonFilterOptions.updateRecordProperty(key, value, data_type, this.updatedTutorRecord, this.tutorRecord);
  }

  updateTutorRecord() {
    const data = this.helperService.encodedGridFormData(this.updatedTutorRecord, this.tutorRecord.getProperty('tutorId'));
    this.utilityService.makerequest(this, this.onUpdateTutorRecord, LcpRestUrls.customer_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateTutorRecord(context: any, data: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: data['success'],
      message: data['message'],
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
    if (data['success']) {
      this.editRecordForm = false;
    } 
  }
}
