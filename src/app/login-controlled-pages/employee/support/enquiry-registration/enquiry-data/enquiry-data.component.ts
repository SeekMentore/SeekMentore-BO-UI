import {Component, Input, OnInit} from '@angular/core';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {EnquiryDataAccess} from '../enquiry-registration.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';
import {AppUtilityService} from "../../../../../utils/app-utility.service";
import {HelperService} from "../../../../../utils/helper.service";
import {LcpRestUrls} from "../../../../../utils/lcp-rest-urls";

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

  singleSelectOptions = CommonFilterOptions.singleSelectOptions;

  multiSelectOptions = CommonFilterOptions.multiSelectOptions;

  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];
  selectedEnquiryStatus: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {

    this.selectedStudentGradeOption = CommonFilterOptions.getSelectedFilterItems(this.studentGradesFilterOptions, this.enquiryRecord.getProperty('studentGrades'));
    this.selectedSubjectOption = CommonFilterOptions.getSelectedFilterItems(this.subjectsFilterOptions, this.enquiryRecord.getProperty('subjects'));
    this.selectedLocationOption = CommonFilterOptions.getSelectedFilterItems(this.locationsFilterOptions, this.enquiryRecord.getProperty('locations'));
    this.selectedCallTimeOptions = CommonFilterOptions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.enquiryRecord.getProperty('preferredTimeToCall'));
    this.selectedReferenceOption = CommonFilterOptions.getSelectedFilterItems(this.referenceFilterOptions, this.enquiryRecord.getProperty('reference'));
    this.selectedEnquiryStatus = CommonFilterOptions.getSelectedFilterItems(this.enquiryStatusFilterOptions, this.enquiryRecord.getProperty('enquiryStatus'));
  }

  updateEnquiryProperty(key: string, value: string, data_type: string) {
    CommonFilterOptions.updateRecordProperty(key, value, data_type, this.enquiryUpdatedRecord, this.enquiryRecord);
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
