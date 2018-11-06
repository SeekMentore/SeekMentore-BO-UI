import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { QueryDataAccess } from '../query-submitted.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';
import {AppUtilityService} from "../../../../../utils/app-utility.service";
import {HelperService} from "../../../../../utils/helper.service";
import {LcpRestUrls} from "../../../../../utils/lcp-rest-urls";

@Component({
  selector: 'app-query-data',
  templateUrl: './query-data.component.html',
  styleUrls: ['./query-data.component.css']
})
export class QueryDataComponent implements OnInit {

  @Input()
  queryRecord: GridRecord = null;

  @Input()
  queryDataAccess: QueryDataAccess = null;


  queryUpdatedRecord = {};

  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptions;

  multiSelectOptions = CommonFilterOptions.multiSelectOptions;

  applicationStatusFilterOptions = CommonFilterOptions.applicationStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  selectedCustomerSubscribedOption: any[] = [];
  selectedTutorRegisteredOption: any[] = [];
  selectedQueryStatus: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.selectedCustomerSubscribedOption = CommonFilterOptions.getSelectedFilterItems(this.yesNoFilterOptions, this.queryRecord.getProperty('subscribedCustomer'));
    this.selectedTutorRegisteredOption = CommonFilterOptions.getSelectedFilterItems(this.yesNoFilterOptions, this.queryRecord.getProperty('registeredTutor'));
    this.selectedQueryStatus = CommonFilterOptions.getSelectedFilterItems(this.applicationStatusFilterOptions, this.queryRecord.getProperty('queryStatus'));
  }

  updateQueryProperty(key: string, value: string, data_type: string) {
    CommonFilterOptions.updateRecordProperty(key, value, data_type, this.queryUpdatedRecord, this.queryRecord);
  }

  updateQueryRecord() {
    const data = this.helperService.encodedGridFormData(this.queryUpdatedRecord, this.queryRecord.getProperty('queryId'));
    this.utilityService.makerequest(this, this.onUpdateQueryRecord, LcpRestUrls.customer_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateQueryRecord(context: any, data: any) {
    if (data['success'] === true) {

    } else {

    }

  }

}