import { Component, Input, OnInit } from '@angular/core';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from "src/app/utils/common-filter-options";
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { ComplaintDataAccess } from '../complaints.component';

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
  
  complaintUpdatedRecord = {};

  showEmployeeActionDetails = false;

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  complaintStatusFilterOptions = CommonFilterOptions.complaintStatusFilterOptions;  
  complaintUserFilterOptions = CommonFilterOptions.userFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions; 

  selectedComplaintStatus: any[] = [];
  selectedComplaintUser: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);;
  }

  updateComplaintProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.complaintUpdatedRecord, this.complaintRecord.property, deselected, isAllOPeration);
  }

  updateComplaintRecord() {
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.complaintUpdatedRecord, this.complaintRecord.getProperty('complaintId'));
    this.utilityService.makerequest(this, this.onUpdateComplaintRecord, LcpRestUrls.complaint_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateComplaintRecord(context: any, data: any) {
    context.helperService.showAlertDialog({
      isSuccess: data['success'],
      message: data['message'],
      onButtonClicked: () => {
      }
    });
    if (data['success']) {
      context.editRecordForm = false;
    }
  }
}
