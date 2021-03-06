import { Component, Input, OnInit } from '@angular/core';
import { Demo } from 'src/app/model/demo';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { DemoModifyAccess } from '../demo-tracker.component';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { AppConstants } from 'src/app/utils/app-constants';

@Component({
  selector: 'app-demo-tracker-data',
  templateUrl: './demo-tracker-data.component.html',
  styleUrls: ['./demo-tracker-data.component.css']
})
export class DemoTrackerDataComponent implements OnInit {

  @Input()
  demoSerialId: string = null;

  @Input()
  demoModifyAccess: DemoModifyAccess;

  demoUpdatedRecord = {};
  rescheduleUpdatedRecord = {};

  showCustomerDetails = false;
  showEnquiryDetails = false;
  showTutorDetails = false;
  showTutorMapperDetails = false;
  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;
  rescheduleMandatoryDisbaled = true;
  editReScheduleRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  mappingStatusFilterOptions = CommonFilterOptions.mappingStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;
  demoStatusFilterOptions = CommonFilterOptions.demoStatusFilterOptions;

  isRecordUpdateFormDirty: boolean = false;
  demoFormMaskLoaderHidden: boolean = true;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false; 
  canSuccessFailDemo: boolean = false; 
  canCancelDemo: boolean = false;
  takeActionActionText: string;
  isRescheduleFormDirty: boolean = false;
  demoRescheduleFormMaskLoaderHidden: boolean = true;
  showRescheduleForm: boolean = false;
  showRescheduleButton: boolean = false; 

  dirtyFlagList: string[] = ['RECORD_UPDATE', 'RE_SCHEDULE_DEMO'];

  // Modal Variables
  demoRecord: Demo;
  demoScheduledDateAndTimeDisplay: string;
  adminActionDateAndTimeDisplay: string;
  enquirySubjectLookupRendererFromValue: string;
  enquiryGradeLookupRendererFromValue: string;
  enquiryPreferredTeachingTypeLookupRendererFromValue: string;
  enquiryLocationLookupRendererFromValue: string;
  demoStatusLookupRendererFromValue: string;
  selectedDemoOccurredOption: any[] = [];
  selectedClientSatisfiedFromTutorOption: any[] = [];
  selectedTutorSatisfiedWithClientOption: any[] = [];
  selectedAdminSatisfiedFromTutorOption: any[] = [];
  selectedAdminSatisfiedWithClientOption: any[] = [];
  selectedNeedPriceNegotiationWithClientOption: any[] = [];
  selectedNeedPriceNegotiationWithTutorOption: any[] = [];
  reScheduleNewDateModal: string;
  reScheduleNewTimeModal: string;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.demoRecord = new Demo();
  }

  ngOnInit() {
    this.getDemoGridRecord(this.demoSerialId);
  }

  private showRecordUpdateFormLoaderMask() {
    this.demoFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.demoFormMaskLoaderHidden = true;
  }

  private showRescheduleFormLoaderMask() {
    this.demoRescheduleFormMaskLoaderHidden = false;
  }

  private hideRescheduleFormLoaderMask() {
    this.demoRescheduleFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  public setRescheduleFormStatus(isEditable: boolean) {
    this.editReScheduleRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.demoModifyAccess.demoUpdateFormAccess;
    this.showRecordUpdateEditControlSection = this.demoModifyAccess.demoUpdateFormAccess && !this.formEditMandatoryDisbaled;
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canCancelDemo && !this.canSuccessFailDemo;
    this.showRescheduleForm = this.demoModifyAccess.demoRescheduleFormAccess && !this.rescheduleMandatoryDisbaled;
    this.showRescheduleButton = this.showRescheduleForm && this.editReScheduleRecordForm;
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
          case 'RE_SCHEDULE_DEMO' : {
            if (this.isRecordUpdateFormDirty) {
              messageList.push('You have unsaved changes on the Re-Schedule Demo form.');
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
          case 'RE_SCHEDULE_DEMO' : {
            resultantFlagValue = resultantFlagValue || this.isRescheduleFormDirty;
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
          case 'RE_SCHEDULE_DEMO' : {
            this.isRescheduleFormDirty = false;
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
          case 'RE_SCHEDULE_DEMO' : {
            this.isRescheduleFormDirty = true;
            break;
          }
        }
      });
    }
  }    
  
  private getDemoGridRecord(demoSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    this.showRescheduleFormLoaderMask();
    const data = {
      parentSerialId: demoSerialId
    };    
    this.utilityService.makerequest(this, this.onGetDemoGridRecord, LcpRestUrls.get_demo_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetDemoGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['demoFormEditMandatoryDisbaled'];
      context.rescheduleMandatoryDisbaled = gridRecordObject.additionalProperties['demoRescheduleMandatoryDisbaled'];
      context.canSuccessFailDemo = gridRecordObject.additionalProperties['demoCanSuccessFailDemo'];
      context.canCancelDemo = gridRecordObject.additionalProperties['demoCanCancelDemo'];
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

  private setUpDataModal(demoGridRecord: GridRecord) {
    this.demoRecord.setValuesFromGridRecord(demoGridRecord);
    this.demoSerialId = this.demoRecord.demoSerialId;
    this.demoScheduledDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.demoRecord.demoDateAndTimeMillis);
    this.adminActionDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.demoRecord.adminActionDateMillis);
    this.enquirySubjectLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.demoRecord.enquirySubject, this.subjectsFilterOptions);
    this.enquiryGradeLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.demoRecord.enquiryGrade, this.studentGradesFilterOptions);
    this.enquiryPreferredTeachingTypeLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.demoRecord.enquiryPreferredTeachingType, this.preferredTeachingTypeFilterOptions);
    this.enquiryLocationLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.demoRecord.enquiryLocation, this.locationsFilterOptions);
    this.demoStatusLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.demoRecord.demoStatus, this.demoStatusFilterOptions);
    this.selectedDemoOccurredOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoRecord.demoOccurred);
    this.selectedClientSatisfiedFromTutorOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoRecord.clientSatisfiedFromTutor);
    this.selectedTutorSatisfiedWithClientOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoRecord.tutorSatisfiedWithClient);
    this.selectedAdminSatisfiedFromTutorOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoRecord.adminSatisfiedFromTutor);
    this.selectedAdminSatisfiedWithClientOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoRecord.adminSatisfiedWithClient);
    this.selectedNeedPriceNegotiationWithClientOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoRecord.needPriceNegotiationWithClient);
    this.selectedNeedPriceNegotiationWithTutorOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoRecord.needPriceNegotiationWithTutor);
    CommonUtilityFunctions.setHTMLInputElementValue('clientRemarks', this.demoRecord.clientRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorRemarks', this.demoRecord.tutorRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('clientNegotiationRemarks', this.demoRecord.clientNegotiationRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorNegotiationRemarks', this.demoRecord.tutorNegotiationRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('adminRemarks', this.demoRecord.adminRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('reschedulingRemarks', this.demoRecord.reschedulingRemarks);
    this.reScheduleNewDateModal = CommonUtilityFunctions.getDateForDateMillisParam(new Date().getTime());
    this.reScheduleNewTimeModal = CommonUtilityFunctions.getTimeForDateMillisParam(new Date().getTime());
    setTimeout(() => {
      this.editRecordForm = false;
      this.editReScheduleRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
      this.hideRescheduleFormLoaderMask();
    }, 500);
  }

  private updateProperty(key: string, event: any, data_type: string, updatedRecord: any, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, updatedRecord, this.demoRecord, deselected, isAllOPeration);
  }

  updateDemoProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    if (!this.isFlagListDirty(false, ['RE_SCHEDULE_DEMO'])) {
      this.setFlagListDirty(false, ['RECORD_UPDATE']);   
      this.updateProperty(key, event, data_type, this.demoUpdatedRecord, deselected, isAllOPeration);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty(false, ['RE_SCHEDULE_DEMO']);
          this.setFlagListDirty(false, ['RECORD_UPDATE']);   
          this.updateProperty(key, event, data_type, this.demoUpdatedRecord, deselected, isAllOPeration);
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

  updateDemoRecord() {
    if (!this.isFlagListDirty(false, ['RE_SCHEDULE_DEMO'])) {
      this.update();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.isRescheduleFormDirty = false;
          this.update();
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

  private update() {
    this.showRecordUpdateFormLoaderMask();
    this.showRescheduleFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.demoUpdatedRecord, this.demoRecord.demoSerialId);
    this.utilityService.makerequest(this, this.onUpdateDemoRecord, LcpRestUrls.demo_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateDemoRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty();  
      context.getDemoGridRecord(context.demoSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
      context.hideRescheduleFormLoaderMask();
    }
  }

  updateReScheduleProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    if (!this.isFlagListDirty(false, ['RECORD_UPDATE'])) {
      this.setFlagListDirty(false, ['RE_SCHEDULE_DEMO']);
      this.updateProperty(key, event, data_type, this.rescheduleUpdatedRecord, deselected, isAllOPeration);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty(false, ['RECORD_UPDATE']);
          this.setFlagListDirty(false, ['RE_SCHEDULE_DEMO']);     
          this.updateProperty(key, event, data_type, this.rescheduleUpdatedRecord, deselected, isAllOPeration);
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

  reScheduleDemo() {
    if (!this.isFlagListDirty(false, ['RECORD_UPDATE'])) {
      this.setFlagListDirty(false, ['RE_SCHEDULE_DEMO']);     
      this.reschedule();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty(false, ['RECORD_UPDATE']);
          this.setFlagListDirty(false, ['RE_SCHEDULE_DEMO']);     
          this.reschedule();
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

  private reschedule() {
    this.showRecordUpdateFormLoaderMask();
    this.showRescheduleFormLoaderMask();
    const newDemoDate: HTMLInputElement = <HTMLInputElement>document.getElementById('newDemoDate');
    const newDemoTime: HTMLInputElement = <HTMLInputElement>document.getElementById('newDemoTime');
    if (CommonUtilityFunctions.checkObjectAvailability(newDemoDate) && CommonUtilityFunctions.checkObjectAvailability(newDemoTime)) {
      CommonUtilityFunctions.updateRecordProperty(null, null, 'predefined_value', this.rescheduleUpdatedRecord, null, null, null, AppConstants.VARIABLE_LOCAL_TZ_OFFSET_MS);
      CommonUtilityFunctions.updateRecordProperty('demoDateMillis', newDemoDate.valueAsNumber.toString(), 'direct_value', this.rescheduleUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('demoTimeMillis', newDemoTime.valueAsNumber.toString(), 'direct_value', this.rescheduleUpdatedRecord, null, null, null);
    }
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.rescheduleUpdatedRecord, this.demoRecord.demoSerialId);
    this.utilityService.makerequest(this, this.onRescheduleDemoRecord, LcpRestUrls.re_schedule_demo, 'POST',
      data, 'multipart/form-data', true);
  }

  onRescheduleDemoRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editReScheduleRecordForm = false;
      context.setFlagListNotDirty(); 
      context.getDemoGridRecord(response['newRescheduledDemoSerialId']);
    } else {
      context.hideRecordUpdateFormLoaderMask();
      context.hideRescheduleFormLoaderMask();
    }
  }

  resetDemoRecord() {
    if (!this.isFlagListDirty()) {
      this.getDemoGridRecord(this.demoSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getDemoGridRecord(this.demoSerialId);
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

  takeActionOnDemoRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    if (!this.isFlagListDirty()) {      
      this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
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
        this.showRecordUpdateFormLoaderMask();
        this.showRescheduleFormLoaderMask();
        this.setFlagListNotDirty();
        this.takeActionActionText = actionText;                  
        const data = {
          allIdsList: this.demoRecord.demoSerialId,
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_demo;
        this.utilityService.makerequest(this, this.handleTakeActionOnDemoRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnDemoRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.setFlagListNotDirty();
      context.getDemoGridRecord(context.demoSerialId);
    } else {
      context.hideRecordUpdateFormLoaderMask();
      context.hideRescheduleFormLoaderMask();
    }
  }

  openCustomerRecord() {
    if (!this.isFlagListDirty()) {
      this.loadCustomerRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadCustomerRecord();
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

  loadCustomerRecord() {
    alert("Loading Customer Record > " + this.demoRecord.customerSerialId);
  }

  openEnquiryRecord() {
    if (!this.isFlagListDirty()) {
      this.loadEnquiryRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadTutorRecord();
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

  loadEnquiryRecord() {
    alert("Loading Enquiry Record > " + this.demoRecord.enquirySerialId);
  }

  openTutorMapperRecord() {
    if (!this.isFlagListDirty()) {
      this.loadTutorMapperRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadTutorMapperRecord();
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

  loadTutorMapperRecord() {
    alert("Loading Tutor Mapper Record > " + this.demoRecord.tutorMapperSerialId);
  }
  
  openTutorRecord() {
    if (!this.isFlagListDirty()) {
      this.loadTutorRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadTutorRecord();
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

  loadTutorRecord() {
    alert("Loading Tutor Record > " + this.demoRecord.tutorSerialId);
  }

  openReSchdeuledFromDemoRecord() {
    if (!this.isFlagListDirty()) {
      this.loadReSchdeuledFromDemoRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadReSchdeuledFromDemoRecord();
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

  loadReSchdeuledFromDemoRecord() {
    alert("Loading Rescheduled From Demo Record > " + this.demoRecord.rescheduledFromDemoSerialId);
  }
}
