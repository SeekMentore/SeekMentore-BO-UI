import {Component, OnInit, Input} from '@angular/core';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {ComplaintDataAccess} from '../complaints.component';
import {CommonFilterOptions} from "src/app/utils/common-filter-options";
import {AppUtilityService} from "src/app/utils/app-utility.service";
import {HelperService} from "src/app/utils/helper.service";
import {LcpRestUrls} from "../../../../../utils/lcp-rest-urls";
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

@Component({
  selector: 'app-complaint-data',
  templateUrl: './complaint-data.component.html',
  styleUrls: ['./complaint-data.component.css']
})
export class ComplaintDataComponent implements OnInit {

  @Input()
  complaintRecord: GridRecord = null;

  @Input()
  complaintDataAccess: ComplaintDataAccess = null;
  editRecordForm = false;

  complaintUpdatedRecord = {};

  complaintStatusFilterOptions = CommonFilterOptions.complaintStatusFilterOptions;
  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  complaintUserFilterOptions = CommonFilterOptions.complaintUserFilterOptions;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  selectedComplaintStatus: any[] = [];
  selectedComplaintUser: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.selectedComplaintStatus = CommonUtilityFunctions.getSelectedFilterItems(this.complaintStatusFilterOptions, this.complaintRecord.getProperty('complaintStatus'));
    this.selectedComplaintUser = CommonUtilityFunctions.getSelectedFilterItems(this.complaintUserFilterOptions, this.complaintRecord.getProperty('complaintUser'));
  }

  updateComplaintProperty(key: string, value: string, data_type: string) {
    CommonUtilityFunctions.updateRecordProperty(key, value, data_type, this.complaintUpdatedRecord, this.complaintRecord);
  }

  updateComplaintRecord() {
    const data = this.helperService.encodedGridFormData(this.complaintUpdatedRecord, this.complaintRecord.getProperty('complaintId'));
    this.utilityService.makerequest(this, this.onUpdateComplaintRecord, LcpRestUrls.complaint_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateComplaintRecord(context: any, data: any) {
    if (data['success'] === true) {

    } else {

    }

  }
}
