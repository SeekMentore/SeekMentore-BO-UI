import { Component, Input, OnInit } from '@angular/core';
import { FindTutorDataAccess } from 'src/app/login-controlled-pages/employee/support/enquiry-registration/enquiry-registration.component';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { HelperService } from "src/app/utils/helper.service";
import { LcpRestUrls } from "src/app/utils/lcp-rest-urls";
import { FindTutor } from 'src/app/model/find-tutor';

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

  enquiryStatusFilterOptions = CommonFilterOptions.publicApplicationStatusFilterOptions;
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
  previousApplicationDateDisplayTime: string;
  findTutorRecordLastUpdatedDateDisplayTime: string;
  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedCallTimeOptions: any[] = [];
  selectedReferenceOption: any[] = [];  

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.findTutorRecord = new FindTutor();
  }

  ngOnInit() {
    this.selectedStudentGradeOption = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.findTutorRecord.studentGrade);
    this.selectedSubjectOption = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.findTutorRecord.subjects);
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.findTutorRecord.location);
    this.selectedCallTimeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTimeToCallFilterOptions, this.findTutorRecord.preferredTimeToCall);
    this.selectedReferenceOption = CommonUtilityFunctions.getSelectedFilterItems(this.referenceFilterOptions, this.findTutorRecord.reference);
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


  updateEnquiryProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.findTutorUpdatedRecord, this.findTutorRecord.property, deselected, isAllOPeration);
  }

  updatefindTutorRecord() {
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.findTutorUpdatedRecord, this.findTutorRecord.getProperty('enquiryId'));
    this.utilityService.makerequest(this, this.onUpdatefindTutorRecord, LcpRestUrls.enquiry_request_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  takeActionOnfindTutorRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false, blacklist: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.findTutorRecord.getProperty('enquiryId'),
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_find_tutor;
        if (blacklist) {
          url = LcpRestUrls.blackList_enquiry_requests;
        }
        this.utilityService.makerequest(this, this.handleTakeActionOnfindTutorRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnfindTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
  }

  onUpdatefindTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
    }
  }

  downloadProfile() {
    const enquiryId: HTMLInputElement = <HTMLInputElement>document.getElementById('profileDownload-enquiryId');
    enquiryId.value = this.findTutorRecord.getProperty('enquiryId');
    this.utilityService.submitForm('profileDownloadForm', '/rest/support/downloadAdminFindTutorProfilePdf', 'POST')
  }
}
