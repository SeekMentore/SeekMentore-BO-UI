import { Component, Input, OnInit } from '@angular/core';
import { SubmitQuery } from 'src/app/model/submit-query';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { SubmitQueryDataAccess } from '../query-submitted.component';

@Component({
  selector: 'app-query-data',
  templateUrl: './query-data.component.html',
  styleUrls: ['./query-data.component.css']
})
export class QueryDataComponent implements OnInit {

  @Input()
  querySerialId: string = null;

  @Input()
  submitQueryDataAccess: SubmitQueryDataAccess = null;

  queryUpdatedRecord = {};

  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  queryStatusFilterOptions = CommonFilterOptions.queryStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;  

  isRecordUpdateFormDirty: boolean = false;
  submitQueryFormMaskLoaderHidden: boolean = true;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false; 
  canRespond: boolean = false;
  canPutOnHold: boolean = false;

  dirtyFlagList: string[] = ['RECORD_UPDATE'];

  // Modal properties
  submitQueryRecord: SubmitQuery;
  queryDateDisplayTime: string;
  queryStatusLookupValue: string;
  isRegisteredTutorLookupValue: string;
  isSubscribedCustomerLookupValue: string;
  isContactedLookupValue: string;
  isNotAnsweredLookupValue: string;
  contactedDateDisplayTime: string;
  recordLastUpdatedDateDisplayTime: string;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.submitQueryRecord = new SubmitQuery();
  }

  ngOnInit() {
    this.getSubmitQueryGridRecord(this.querySerialId);
  }

  private showRecordUpdateFormLoaderMask() {
    this.submitQueryFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.submitQueryFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.submitQueryDataAccess.submitQueryResponseCapableAccess;
    this.showRecordUpdateEditControlSection = this.showRecordUpdateForm && !this.formEditMandatoryDisbaled;
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canRespond && !this.canPutOnHold; 
  }

  private getConfirmationMessageForFormsDirty(allFlags: boolean = true, flagList: string[] = null) {
    let confirmationMessage: string = '';
    let messageList: string[] = [];
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            if (this.isRecordUpdateFormDirty) {
              messageList.push('You have unsaved changes on the Update form.');
            }
            break;
          }
        }
      });
    }
    if (CommonUtilityFunctions.checkNonEmptyList(messageList)) {
      messageList.push('Do you still want to continue');
      messageList.forEach((message) => {
        confirmationMessage += message + '\n';
      });      
    }
    return confirmationMessage;
  }

  private isFlagListDirty(allFlags: boolean = true, flagList: string[] = null) {
    let resultantFlagValue: boolean = false;
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            resultantFlagValue = resultantFlagValue || this.isRecordUpdateFormDirty;
            break;
          }
        }
      });
    }
    return resultantFlagValue;
  }

  private setFlagListNotDirty(allFlags: boolean = true, flagList: string[] = null) {
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            this.isRecordUpdateFormDirty = false;
            break;
          }
        }
      });
    }
  }

  private setFlagListDirty(allFlags: boolean = true, flagList: string[] = null) {
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            this.isRecordUpdateFormDirty = true;
            break;
          }
        }
      });
    }
  }

  private getSubmitQueryGridRecord(querySerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: querySerialId
    };    
    this.utilityService.makerequest(this, this.onGetSubmitQueryGridRecord, LcpRestUrls.get_submit_query_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetSubmitQueryGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['submitQueryFormEditMandatoryDisbaled'];
      context.canRespond = gridRecordObject.additionalProperties['submitQueryCanRespond'];
      context.canPutOnHold = gridRecordObject.additionalProperties['submitQueryCanPutOnHold'];
      context.setUpDataModal(gridRecordObject.record);
    } else {
      context.helperService.showAlertDialog({
        isSuccess: false,
        message: gridRecordObject.errorMessage,
        onButtonClicked: () => {
        }
      });
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  private setUpDataModal(submitQueryGridRecord: GridRecord) {
    this.submitQueryRecord.setValuesFromGridRecord(submitQueryGridRecord);
    this.querySerialId = this.submitQueryRecord.querySerialId;
    this.queryDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.submitQueryRecord.queryRequestedDateMillis);
    this.queryStatusLookupValue = GridCommonFunctions.lookupRendererForValue(this.submitQueryRecord.queryStatus, this.queryStatusFilterOptions);
    this.isRegisteredTutorLookupValue = GridCommonFunctions.lookupRendererForValue(this.submitQueryRecord.registeredTutor, this.yesNoFilterOptions);
    this.isSubscribedCustomerLookupValue = GridCommonFunctions.lookupRendererForValue(this.submitQueryRecord.subscribedCustomer, this.yesNoFilterOptions);
    this.isContactedLookupValue = GridCommonFunctions.lookupRendererForValue(this.submitQueryRecord.isContacted, this.yesNoFilterOptions);
    this.isNotAnsweredLookupValue = GridCommonFunctions.lookupRendererForValue(this.submitQueryRecord.notAnswered, this.yesNoFilterOptions);
    this.contactedDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.submitQueryRecord.contactedDateMillis);
    this.recordLastUpdatedDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.submitQueryRecord.recordLastUpdatedMillis);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  updateSubmitQueryProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.queryUpdatedRecord, this.submitQueryRecord, deselected, isAllOPeration);
  }

  updateSubmitQueryRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.queryUpdatedRecord, this.querySerialId);
    this.utilityService.makerequest(this, this.onUpdateSubmitQueryRecord, LcpRestUrls.submit_query_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateSubmitQueryRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty();
      context.getSubmitQueryGridRecord(context.querySerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetSubmitQueryRecord() {
    if (!this.isFlagListDirty()) {
      this.getSubmitQueryGridRecord(this.querySerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getSubmitQueryGridRecord(this.querySerialId);
        },
        onCancel: () => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          });
        }
      });
    }    
  }

  takeActionOnSubmitQueryRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    if (!this.isFlagListDirty()) {      
      this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
        },
        onCancel: () => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          });
        }
      });
    }   
  }

  private takeActionPrompt(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.querySerialId,
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
    if (response['success']) {
      context.getSubmitQueryGridRecord(context.querySerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }
}
