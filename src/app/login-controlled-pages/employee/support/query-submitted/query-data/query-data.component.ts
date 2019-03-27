import { Component, Input, OnInit } from '@angular/core';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { QueryDataAccess } from '../query-submitted.component';

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

  @Input()
  selectedRecordGridType: string = null;

  queryUpdatedRecord = {};

  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  queryStatusFilterOptions = CommonFilterOptions.queryStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;  

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
  }

  ngOnInit() {
    this.setDisabledStatus(); 
  }

  private setDisabledStatus() {
    if (
      this.selectedRecordGridType === 'nonContactedQueryGrid' 
      || this.selectedRecordGridType === 'nonAnsweredQueryGrid'       
    ) {
      this.takeActionDisabled = false;
    }    
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);;
  }

  updateQueryProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.queryUpdatedRecord, this.queryRecord.property, deselected, isAllOPeration);
  }

  updateQueryRecord() {
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentId(this.queryUpdatedRecord, this.queryRecord.getProperty('queryId'));
    this.utilityService.makerequest(this, this.onUpdateQueryRecord, LcpRestUrls.submitted_query_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  takeActionOnQueryRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.queryRecord.getProperty('queryId'),
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_submit_query;        
        this.utilityService.makerequest(this, this.handleTakeActionOnQueryRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnQueryRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
  }

  onUpdateQueryRecord(context: any, response: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (response['success']) {
      context.editRecordForm = false;
    } 
  }
}
