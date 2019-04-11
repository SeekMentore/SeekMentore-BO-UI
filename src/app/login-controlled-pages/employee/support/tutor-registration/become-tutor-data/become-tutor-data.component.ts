import { Component, Input, OnInit } from '@angular/core';
import { BecomeTutorDataAccess } from 'src/app/login-controlled-pages/employee/support/tutor-registration/tutor-registration.component';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { BecomeTutor } from 'src/app/model/become-tutor';

@Component({
  selector: 'app-become-tutor-data',
  templateUrl: './become-tutor-data.component.html',
  styleUrls: ['./become-tutor-data.component.css']
})
export class BecomeTutorDataComponent implements OnInit {

  @Input()
  becomeTutorSerialId: string = null;

  @Input()
  becomeTutorDataAccess: BecomeTutorDataAccess = null;

  updatedBecomeTutorRecord = {};

  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  applicationStatusFilterOptions = CommonFilterOptions.publicApplicationStatusFilterOptions;
  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  primaryProfessionFilterOptions = CommonFilterOptions.primaryProfessionFilterOptions;
  transportModeFilterOptions = CommonFilterOptions.transportModeFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  preferredTimeToCallFilterOptions = CommonFilterOptions.preferredTimeToCallFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  isRecordUpdateFormDirty: boolean = false;
  becomeTutorFormMaskLoaderHidden: boolean = true;
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
  becomeTutorRecord: BecomeTutor;
  dateOfBirthValue: string;
  applicationDateDisplayTime: string;
  applicationStatusLookupValue: string;
  isContactedLookupValue: string;
  isAuthenticationVerifiedLookupValue: string;
  isToBeRecontactedLookupValue: string;
  isSelectedLookupValue: string;
  isRejectedLookupValue: string;
  reAppliedLookupValue: string;
  contactedDateDisplayTime: string;
  verificationDateDisplayTime: string;
  suggestionDateDisplayTime: string;
  recontactedDateDisplayTime: string;
  selectionDateDisplayTime: string;
  rejectionDateDisplayTime: string;
  previousApplicationDateDisplayTime: string;
  recordLastUpdatedDateDisplayTime: string;
  selectedGenderOption: any[] = [];
  selectedQualificationOption: any[] = [];
  selectedProfessionOption: any[] = [];
  selectedTransportOption: any[] = [];
  selectedStudentGradeOptions: any[] = [];
  selectedSubjectOptions: any[] = [];
  selectedLocationOptions: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];
  selectedTeachingTypeOptions: any[] = [];  

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.becomeTutorRecord = new BecomeTutor();
  }

  ngOnInit() {
    this.getBecomeTutorGridRecord(this.becomeTutorSerialId);
  }

  private showRecordUpdateFormLoaderMask() {
    this.becomeTutorFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.becomeTutorFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.becomeTutorDataAccess.becomeTutorFormDataEditAccess;
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
  
  private getBecomeTutorGridRecord(becomeTutorSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: becomeTutorSerialId
    };    
    this.utilityService.makerequest(this, this.onGetBecomeTutorGridRecord, LcpRestUrls.get_become_tutor_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetBecomeTutorGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['becomeTutorFormEditMandatoryDisbaled'];
      context.canMakeContacted = gridRecordObject.additionalProperties['becomeTutorCanMakeContacted'];
      context.canMakeToBeRecontact = gridRecordObject.additionalProperties['becomeTutorCanMakeToBeRecontact'];
      context.canMakeVerified = gridRecordObject.additionalProperties['becomeTutorCanMakeVerified']; 
      context.canMakeReverified = gridRecordObject.additionalProperties['becomeTutorCanMakeReverified'];
      context.canMakeRecontacted = gridRecordObject.additionalProperties['becomeTutorCanMakeRecontacted'];
      context.canMakeSelected = gridRecordObject.additionalProperties['becomeTutorCanMakeSelected'];
      context.canMakeFailVerified = gridRecordObject.additionalProperties['becomeTutorCanMakeFailVerified'];
      context.canMakeRejected = gridRecordObject.additionalProperties['becomeTutorCanMakeRejected'];
      context.canBlacklist = gridRecordObject.additionalProperties['becomeTutorCanBlacklist'];
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

  private setUpDataModal(becomeTutorGridRecord: GridRecord) {
    this.becomeTutorRecord.setValuesFromGridRecord(becomeTutorGridRecord);
    this.becomeTutorSerialId = this.becomeTutorRecord.becomeTutorSerialId;
    this.applicationDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.becomeTutorRecord.applicationDateMillis);
    this.dateOfBirthValue = CommonUtilityFunctions.getDateForDateInputParam(this.becomeTutorRecord.dateOfBirth);
    this.applicationStatusLookupValue = GridCommonFunctions.lookupRendererForValue(this.becomeTutorRecord.applicationStatus, this.applicationStatusFilterOptions);
    this.isContactedLookupValue = GridCommonFunctions.lookupRendererForValue(this.becomeTutorRecord.isContacted, this.yesNoFilterOptions);
    this.isAuthenticationVerifiedLookupValue = GridCommonFunctions.lookupRendererForValue(this.becomeTutorRecord.isAuthenticationVerified, this.yesNoFilterOptions);
    this.isToBeRecontactedLookupValue = GridCommonFunctions.lookupRendererForValue(this.becomeTutorRecord.isToBeRecontacted, this.yesNoFilterOptions);
    this.isSelectedLookupValue = GridCommonFunctions.lookupRendererForValue(this.becomeTutorRecord.isSelected, this.yesNoFilterOptions);
    this.isRejectedLookupValue = GridCommonFunctions.lookupRendererForValue(this.becomeTutorRecord.isRejected, this.yesNoFilterOptions);
    this.reAppliedLookupValue = GridCommonFunctions.lookupRendererForValue(this.becomeTutorRecord.reApplied, this.yesNoFilterOptions);
    this.contactedDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.becomeTutorRecord.contactedDateMillis);
    this.verificationDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.becomeTutorRecord.verificationDateMillis);
    this.suggestionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.becomeTutorRecord.suggestionDateMillis);
    this.recontactedDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.becomeTutorRecord.recontactedDateMillis);
    this.selectionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.becomeTutorRecord.selectionDateMillis);
    this.rejectionDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.becomeTutorRecord.rejectionDateMillis);
    this.previousApplicationDateDisplayTime = CommonUtilityFunctions.getDateStringShortVersionInDDMMYYYYHHmmSS(this.becomeTutorRecord.previousApplicationDateMillis);
    this.recordLastUpdatedDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.becomeTutorRecord.recordLastUpdatedMillis);
    this.selectedGenderOption = CommonUtilityFunctions.getSelectedFilterItems(this.genderFilterOptions, this.becomeTutorRecord.gender);
    this.selectedQualificationOption = CommonUtilityFunctions.getSelectedFilterItems(this.qualificationFilterOptions, this.becomeTutorRecord.qualification);
    this.selectedProfessionOption = CommonUtilityFunctions.getSelectedFilterItems(this.primaryProfessionFilterOptions, this.becomeTutorRecord.primaryProfession);
    this.selectedTransportOption = CommonUtilityFunctions.getSelectedFilterItems(this.transportModeFilterOptions, this.becomeTutorRecord.transportMode);
    this.selectedStudentGradeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.becomeTutorRecord.studentGrade);
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.becomeTutorRecord.subjects);
    this.selectedLocationOptions = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.becomeTutorRecord.locations);
    this.selectedCallTimeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.becomeTutorRecord.preferredTimeToCall);
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.becomeTutorRecord.reference);
    this.selectedTeachingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTeachingTypeFilterOptions, this.becomeTutorRecord.preferredTeachingType);
    CommonUtilityFunctions.setHTMLInputElementValue('dateOfBirth', this.dateOfBirthValue);
    CommonUtilityFunctions.setHTMLInputElementValue('firstName', this.becomeTutorRecord.firstName);
    CommonUtilityFunctions.setHTMLInputElementValue('lastName', this.becomeTutorRecord.lastName);
    CommonUtilityFunctions.setHTMLInputElementValue('contactNumber', this.becomeTutorRecord.contactNumber);
    CommonUtilityFunctions.setHTMLInputElementValue('emailId', this.becomeTutorRecord.emailId);
    CommonUtilityFunctions.setHTMLInputElementValue('teachingExp', this.becomeTutorRecord.teachingExp);
    CommonUtilityFunctions.setHTMLInputElementValue('additionalDetails', this.becomeTutorRecord.additionalDetails);
    CommonUtilityFunctions.setHTMLInputElementValue('addressDetails', this.becomeTutorRecord.addressDetails);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  updateBecomeTutorProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']); 
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.updatedBecomeTutorRecord, this.becomeTutorRecord, deselected, isAllOPeration);
  }

  updateBecomeTutorRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.updatedBecomeTutorRecord, this.becomeTutorSerialId);
    this.utilityService.makerequest(this, this.onUpdateBecomeTutorRecord, LcpRestUrls.become_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateBecomeTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty();
      context.getBecomeTutorGridRecord(context.becomeTutorSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetBecomeTutorRecord() {
    if (!this.isFlagListDirty()) {
      this.getBecomeTutorGridRecord(this.becomeTutorSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getBecomeTutorGridRecord(this.becomeTutorSerialId);
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

  takeActionOnBecomeTutorRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false, blacklist: boolean = false) {
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
        this.showRecordUpdateFormLoaderMask();
        this.setFlagListNotDirty();                 
        const data = {
          allIdsList: this.becomeTutorSerialId,
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_become_tutor;
        if (blacklist) {
          url = LcpRestUrls.blackList_become_tutors;
        }
        this.utilityService.makerequest(this, this.handleTakeActionOnBecomeTutorRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnBecomeTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.getBecomeTutorGridRecord(context.becomeTutorSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  downloadProfile() {
    this.showRecordUpdateFormLoaderMask();
    const becomeTutorSerialId: HTMLInputElement = <HTMLInputElement>document.getElementById('profileDownload-becomeTutorSerialId');
    becomeTutorSerialId.value = this.becomeTutorSerialId;
    this.utilityService.submitForm('profileDownloadForm', '/rest/support/downloadAdminBecomeTutorProfilePdf', 'POST');
    setTimeout(() => {
      this.hideRecordUpdateFormLoaderMask();
    }, 5000);
  }
}
