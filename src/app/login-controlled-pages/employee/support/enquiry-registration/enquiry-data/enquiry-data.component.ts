import { Component, Input, OnInit } from '@angular/core';
import { FindTutorDataAccess } from 'src/app/login-controlled-pages/employee/support/enquiry-registration/enquiry-registration.component';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { FindTutor } from 'src/app/model/find-tutor';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';

@Component({
  selector: 'app-enquiry-data',
  templateUrl: './enquiry-data.component.html',
  styleUrls: ['./enquiry-data.component.css']
})
export class EnquiryDataComponent implements OnInit {

  @Input()
  findTutorSerialId: string = null;

  @Input()
  findTutorDataAccess: FindTutorDataAccess = null;

  findTutorUpdatedRecord = {};

  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;

  applicationStatusFilterOptions = CommonFilterOptions.publicApplicationStatusFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  isRecordUpdateFormDirty: boolean = false;
  findTutorFormMaskLoaderHidden: boolean = true;
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
  findTutorRecord: FindTutor;
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
  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];  

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.findTutorRecord = new FindTutor();
  }

  ngOnInit() {
    this.getFindTutorGridRecord(this.findTutorSerialId);
  }

  private showRecordUpdateFormLoaderMask() {
    this.findTutorFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.findTutorFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.findTutorDataAccess.findTutorFormDataEditAccess;
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

  private getFindTutorGridRecord(findTutorSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: findTutorSerialId
    };    
    this.utilityService.makerequest(this, this.onGetFindTutorGridRecord, LcpRestUrls.get_find_tutor_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetFindTutorGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['findTutorFormEditMandatoryDisbaled'];
      context.canMakeContacted = gridRecordObject.additionalProperties['findTutorCanMakeContacted'];
      context.canMakeToBeRecontact = gridRecordObject.additionalProperties['findTutorCanMakeToBeRecontact'];
      context.canMakeVerified = gridRecordObject.additionalProperties['findTutorCanMakeVerified']; 
      context.canMakeReverified = gridRecordObject.additionalProperties['findTutorCanMakeReverified'];
      context.canMakeRecontacted = gridRecordObject.additionalProperties['findTutorCanMakeRecontacted'];
      context.canMakeSelected = gridRecordObject.additionalProperties['findTutorCanMakeSelected'];
      context.canMakeFailVerified = gridRecordObject.additionalProperties['findTutorCanMakeFailVerified'];
      context.canMakeRejected = gridRecordObject.additionalProperties['findTutorCanMakeRejected'];
      context.canBlacklist = gridRecordObject.additionalProperties['findTutorCanBlacklist'];
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

  private setUpDataModal(findTutorGridRecord: GridRecord) {
    this.findTutorRecord.setValuesFromGridRecord(findTutorGridRecord);
    this.findTutorSerialId = this.findTutorRecord.findTutorSerialId;
    this.applicationDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.findTutorRecord.applicationDateMillis);
    this.applicationStatusLookupValue = GridCommonFunctions.lookupRendererForValue(this.findTutorRecord.applicationStatus, this.applicationStatusFilterOptions);
    this.isContactedLookupValue = GridCommonFunctions.lookupRendererForValue(this.findTutorRecord.isContacted, this.yesNoFilterOptions);
    this.isAuthenticationVerifiedLookupValue = GridCommonFunctions.lookupRendererForValue(this.findTutorRecord.isAuthenticationVerified, this.yesNoFilterOptions);
    this.isToBeRecontactedLookupValue = GridCommonFunctions.lookupRendererForValue(this.findTutorRecord.isToBeRecontacted, this.yesNoFilterOptions);
    this.isSelectedLookupValue = GridCommonFunctions.lookupRendererForValue(this.findTutorRecord.isSelected, this.yesNoFilterOptions);
    this.isRejectedLookupValue = GridCommonFunctions.lookupRendererForValue(this.findTutorRecord.isRejected, this.yesNoFilterOptions);
    this.contactedDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.findTutorRecord.contactedDateMillis);
    this.verificationDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.findTutorRecord.verificationDateMillis);
    this.suggestionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.findTutorRecord.suggestionDateMillis);
    this.recontactedDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.findTutorRecord.recontactedDateMillis);
    this.selectionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.findTutorRecord.selectionDateMillis);
    this.rejectionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.findTutorRecord.rejectionDateMillis);
    this.recordLastUpdatedDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.findTutorRecord.recordLastUpdatedMillis);
    this.selectedStudentGradeOption = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.findTutorRecord.studentGrade);
    this.selectedSubjectOption = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.findTutorRecord.subjects);
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.findTutorRecord.location);
    this.selectedCallTimeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.findTutorRecord.preferredTimeToCall);
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.findTutorRecord.reference);
    CommonUtilityFunctions.setHTMLInputElementValue('name', this.findTutorRecord.name);
    CommonUtilityFunctions.setHTMLInputElementValue('contactNumber', this.findTutorRecord.contactNumber);
    CommonUtilityFunctions.setHTMLInputElementValue('emailId', this.findTutorRecord.emailId);
    CommonUtilityFunctions.setHTMLInputElementValue('additionalDetails', this.findTutorRecord.additionalDetails);
    CommonUtilityFunctions.setHTMLInputElementValue('addressDetails', this.findTutorRecord.addressDetails);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  updateFindTutorProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.findTutorUpdatedRecord, this.findTutorRecord, deselected, isAllOPeration);
  }

  updateFindTutorRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.findTutorUpdatedRecord, this.findTutorSerialId);
    this.utilityService.makerequest(this, this.onUpdateFindTutorRecord, LcpRestUrls.find_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateFindTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty();
      context.getFindTutorGridRecord(context.findTutorSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetFindTutorRecord() {
    if (!this.isFlagListDirty()) {
      this.getFindTutorGridRecord(this.findTutorSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getFindTutorGridRecord(this.findTutorSerialId);
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

  takeActionOnFindTutorRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false, blacklist: boolean = false) {
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
          allIdsList: this.findTutorSerialId,
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_find_tutor;
        if (blacklist) {
          url = LcpRestUrls.blackList_find_tutors;
        }
        this.utilityService.makerequest(this, this.handleTakeActionOnFindTutorRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnFindTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.getFindTutorGridRecord(context.findTutorSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  downloadProfile() {
    this.showRecordUpdateFormLoaderMask();
    const findTutorSerialId: HTMLInputElement = <HTMLInputElement>document.getElementById('profileDownload-findTutorSerialId');
    findTutorSerialId.value = this.findTutorSerialId;
    this.utilityService.submitForm('profileDownloadForm', '/rest/support/downloadAdminFindTutorProfilePdf', 'POST');
    setTimeout(() => {
      this.hideRecordUpdateFormLoaderMask();
    }, 5000);
  }
}
