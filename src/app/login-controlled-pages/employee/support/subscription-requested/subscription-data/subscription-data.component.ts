import { Component, Input, OnInit } from '@angular/core';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { SubscribeWithUsDataAccess } from '../subscription-requested.component';
import { SubscribeWithUs } from 'src/app/model/subscribe-with-us';
import { GridRecord } from 'src/app/utils/grid/grid-record';

@Component({
  selector: 'app-subscription-data',
  templateUrl: './subscription-data.component.html',
  styleUrls: ['./subscription-data.component.css']
})
export class SubscriptionDataComponent implements OnInit {

  @Input()
  subscribeWithUsSerialId: string = null;

  @Input()
  subscribeWithUsDataAccess: SubscribeWithUsDataAccess = null;

  updatedSubscribeWithUsRecord = {};

  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  applicationStatusFilterOptions = CommonFilterOptions.publicApplicationStatusFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  isRecordUpdateFormDirty: boolean = false;
  subscribeWithUsFormMaskLoaderHidden: boolean = true;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false; 
  canMakeContacted: boolean = false;
  canMakeToBeRecontact: boolean = false;
  canMakeVerified: boolean = false; 
  canMakeReverified: boolean = false;
  canMakeRecontacted: boolean = false;
  canMakeSelected: boolean = false;
  canMakeFailVerified: boolean = false;
  canMakeRejected: boolean = false;
  canBlacklist: boolean = false;

  dirtyFlagList: string[] = ['RECORD_UPDATE'];

  // Modal properties
  subscribeWithUsRecord: SubscribeWithUs;
  applicationDateDisplayTime: string;
  applicationStatusLookupValue: string;
  isContactedLookupValue: string;
  isAuthenticationVerifiedLookupValue: string;
  isToBeRecontactedLookupValue: string;
  isSelectedLookupValue: string;
  isRejectedLookupValue: string;
  contactedDateDisplayTime: string;
  verificationDateDisplayTime: string;
  suggestionDateDisplayTime: string;
  recontactedDateDisplayTime: string;
  selectionDateDisplayTime: string;
  rejectionDateDisplayTime: string;
  recordLastUpdatedDateDisplayTime: string;
  selectedStudentGradeOptions: any[] = [];
  selectedSubjectOptions: any[] = [];
  selectedLocationOptions: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.subscribeWithUsRecord = new SubscribeWithUs();
  }

  ngOnInit() {
    this.getSubscribeWithUsGridRecord(this.subscribeWithUsSerialId);
  }

  private showRecordUpdateFormLoaderMask() {
    this.subscribeWithUsFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.subscribeWithUsFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.subscribeWithUsDataAccess.subscribeWithUsFormDataEditAccess;
    this.showRecordUpdateEditControlSection = this.showRecordUpdateForm && !this.formEditMandatoryDisbaled;
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canMakeContacted && !this.canMakeToBeRecontact
                              && !this.canMakeVerified && !this.canMakeReverified
                              && !this.canMakeRecontacted && !this.canMakeSelected
                              && !this.canMakeFailVerified && !this.canMakeRejected
                              && !this.canBlacklist; 
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

  private getSubscribeWithUsGridRecord(subscribeWithUsSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: subscribeWithUsSerialId
    };    
    this.utilityService.makerequest(this, this.onGetSubscribeWithUsGridRecord, LcpRestUrls.get_subscribe_with_us_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetSubscribeWithUsGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['subscribeWithUsFormEditMandatoryDisbaled'];
      context.canMakeContacted = gridRecordObject.additionalProperties['subscribeWithUsCanMakeContacted'];
      context.canMakeToBeRecontact = gridRecordObject.additionalProperties['subscribeWithUsCanMakeToBeRecontact'];
      context.canMakeVerified = gridRecordObject.additionalProperties['subscribeWithUsCanMakeVerified']; 
      context.canMakeReverified = gridRecordObject.additionalProperties['subscribeWithUsCanMakeReverified'];
      context.canMakeRecontacted = gridRecordObject.additionalProperties['subscribeWithUsCanMakeRecontacted'];
      context.canMakeSelected = gridRecordObject.additionalProperties['subscribeWithUsCanMakeSelected'];
      context.canMakeFailVerified = gridRecordObject.additionalProperties['subscribeWithUsCanMakeFailVerified'];
      context.canMakeRejected = gridRecordObject.additionalProperties['subscribeWithUsCanMakeRejected'];
      context.canBlacklist = gridRecordObject.additionalProperties['subscribeWithUsCanBlacklist'];
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

  private setUpDataModal(subscribeWithUsGridRecord: GridRecord) {
    this.subscribeWithUsRecord.setValuesFromGridRecord(subscribeWithUsGridRecord);
    this.subscribeWithUsSerialId = this.subscribeWithUsRecord.subscribeWithUsSerialId;
    this.applicationDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.subscribeWithUsRecord.applicationDateMillis);
    this.applicationStatusLookupValue = GridCommonFunctions.lookupRendererForValue(this.subscribeWithUsRecord.applicationStatus, this.applicationStatusFilterOptions);
    this.isContactedLookupValue = GridCommonFunctions.lookupRendererForValue(this.subscribeWithUsRecord.isContacted, this.yesNoFilterOptions);
    this.isAuthenticationVerifiedLookupValue = GridCommonFunctions.lookupRendererForValue(this.subscribeWithUsRecord.isAuthenticationVerified, this.yesNoFilterOptions);
    this.isToBeRecontactedLookupValue = GridCommonFunctions.lookupRendererForValue(this.subscribeWithUsRecord.isToBeRecontacted, this.yesNoFilterOptions);
    this.isSelectedLookupValue = GridCommonFunctions.lookupRendererForValue(this.subscribeWithUsRecord.isSelected, this.yesNoFilterOptions);
    this.isRejectedLookupValue = GridCommonFunctions.lookupRendererForValue(this.subscribeWithUsRecord.isRejected, this.yesNoFilterOptions);
    this.contactedDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.subscribeWithUsRecord.contactedDateMillis);
    this.verificationDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.subscribeWithUsRecord.verificationDateMillis);
    this.suggestionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.subscribeWithUsRecord.suggestionDateMillis);
    this.recontactedDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.subscribeWithUsRecord.recontactedDateMillis);
    this.selectionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.subscribeWithUsRecord.selectionDateMillis);
    this.rejectionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.subscribeWithUsRecord.rejectionDateMillis);
    this.recordLastUpdatedDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.subscribeWithUsRecord.recordLastUpdatedMillis);
    this.selectedStudentGradeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.subscribeWithUsRecord.studentGrade);
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.subscribeWithUsRecord.subjects);
    this.selectedLocationOptions = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.subscribeWithUsRecord.location);
    this.selectedCallTimeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.subscribeWithUsRecord.preferredTimeToCall);
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.subscribeWithUsRecord.reference);
    CommonUtilityFunctions.setHTMLInputElementValue('firstName', this.subscribeWithUsRecord.firstName);
    CommonUtilityFunctions.setHTMLInputElementValue('lastName', this.subscribeWithUsRecord.lastName);
    CommonUtilityFunctions.setHTMLInputElementValue('contactNumber', this.subscribeWithUsRecord.contactNumber);
    CommonUtilityFunctions.setHTMLInputElementValue('emailId', this.subscribeWithUsRecord.emailId);
    CommonUtilityFunctions.setHTMLInputElementValue('additionalDetails', this.subscribeWithUsRecord.additionalDetails);
    CommonUtilityFunctions.setHTMLInputElementValue('addressDetails', this.subscribeWithUsRecord.addressDetails);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  updateSubscribeWithUsProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.updatedSubscribeWithUsRecord, this.subscribeWithUsRecord, deselected, isAllOPeration);
  }

  updateSubscribeWithUsRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.updatedSubscribeWithUsRecord, this.subscribeWithUsSerialId);
    this.utilityService.makerequest(this, this.onUpdateSubscribeWithUsRecord, LcpRestUrls.subscribe_with_us_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateSubscribeWithUsRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty();
      context.getSubscribeWithUsGridRecord(context.subscribeWithUsSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetSubscribeWithUsRecord() {
    if (!this.isFlagListDirty()) {
      this.getSubscribeWithUsGridRecord(this.subscribeWithUsSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getSubscribeWithUsGridRecord(this.subscribeWithUsSerialId);
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

  takeActionOnSubscribeWithUsRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false, blacklist: boolean = false) {
    if (!this.isFlagListDirty()) {      
      this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired, blacklist);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired, blacklist);
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

  private takeActionPrompt(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false, blacklist: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.subscribeWithUsSerialId,
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_subscribe_with_us;
        if (blacklist) {
          url = LcpRestUrls.blackList_subscribe_with_us;
        }
        this.utilityService.makerequest(this, this.handleTakeActionOnSubscribeWithUsRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnSubscribeWithUsRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.getSubscribeWithUsGridRecord(context.subscribeWithUsSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }
}
