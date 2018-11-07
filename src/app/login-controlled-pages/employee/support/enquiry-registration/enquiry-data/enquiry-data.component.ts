import {Component, Input, OnInit} from '@angular/core';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {EnquiryDataAccess} from '../enquiry-registration.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';
import {AppUtilityService} from "../../../../../utils/app-utility.service";
import {HelperService} from "../../../../../utils/helper.service";
import {LcpRestUrls} from "../../../../../utils/lcp-rest-urls";
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-enquiry-data',
  templateUrl: './enquiry-data.component.html',
  styleUrls: ['./enquiry-data.component.css']
})
export class EnquiryDataComponent implements OnInit {

  @Input()
  enquiryRecord: GridRecord = null;

  @Input()
  enquiryDataAccess: EnquiryDataAccess = null;

  enquiryUpdatedRecord = {};

  editRecordForm = false;

  enquiryStatusFilterOptions = CommonFilterOptions.enquiryStatusFilterOptions;
  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];
  selectedEnquiryStatus: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {

    this.selectedStudentGradeOption = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.enquiryRecord.getProperty('studentGrades'));
    this.selectedSubjectOption = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.enquiryRecord.getProperty('subjects'));
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.enquiryRecord.getProperty('locations'));
    this.selectedCallTimeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.enquiryRecord.getProperty('preferredTimeToCall'));
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.enquiryRecord.getProperty('reference'));
    this.selectedEnquiryStatus = CommonUtilityFunctions.getSelectedFilterItems(this.enquiryStatusFilterOptions, this.enquiryRecord.getProperty('enquiryStatus'));
  }

  updateEnquiryProperty(key: string, value: string, data_type: string) {
    CommonUtilityFunctions.updateRecordProperty(key, value, data_type, this.enquiryUpdatedRecord, this.enquiryRecord);
  }

  updateEnquiryRecord() {
    const data = this.helperService.encodedGridFormData(this.enquiryUpdatedRecord, this.enquiryRecord.getProperty('tutorId'));
    this.utilityService.makerequest(this, this.onUpdateEnquiryRecord, LcpRestUrls.customer_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateEnquiryRecord(context: any, data: any) {
    if (data['success'] === true) {

    } else {

    }

  }

}
