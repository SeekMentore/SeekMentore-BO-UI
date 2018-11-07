import { Component, Input, OnInit } from '@angular/core';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { EnquiryDataAccess } from 'src/app/login-controlled-pages/employee/support/enquiry-registration/enquiry-registration.component';

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

  showEmployeeActionDetails = false;

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  enquiryStatusFilterOptions = CommonFilterOptions.enquiryStatusFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];  

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.selectedStudentGradeOption = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.enquiryRecord.getProperty('studentGrade'));
    this.selectedSubjectOption = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.enquiryRecord.getProperty('subjects'));
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.enquiryRecord.getProperty('location'));
    this.selectedCallTimeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.enquiryRecord.getProperty('preferredTimeToCall'));
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.enquiryRecord.getProperty('reference'));    
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);;
  }

  updateEnquiryProperty(key: string, value: string, data_type: string) {
    CommonUtilityFunctions.updateRecordProperty(key, value, data_type, this.enquiryUpdatedRecord, this.enquiryRecord);
  }

  updateEnquiryRecord() {
    const data = this.helperService.encodedGridFormData(this.enquiryUpdatedRecord, this.enquiryRecord.getProperty('enquiryId'));
    this.utilityService.makerequest(this, this.onUpdateEnquiryRecord, LcpRestUrls.customer_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateEnquiryRecord(context: any, data: any) {
    if (data['success'] === true) {

    } else {

    }

  }

}
