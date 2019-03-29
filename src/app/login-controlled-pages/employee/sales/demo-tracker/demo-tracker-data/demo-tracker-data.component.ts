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

  isFormDirty: boolean = false;
  demoFormMaskLoaderHidden: boolean = true;
  showForm: boolean = false;
  showEditControlSection: boolean = false;
  showUpdateButton: boolean = false; 
  canSuccessFailDemo: boolean = false; 
  canCancelDemo: boolean = false;
  takeActionActionText: string;
  isRescheduleFormDirty: boolean = false;
  demoRescheduleFormMaskLoaderHidden: boolean = true;
  showRescheduleForm: boolean = false;
  showRescheduleButton: boolean = false; 

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

  private showFormLoaderMask() {
    this.demoFormMaskLoaderHidden = false;
  }

  private hideFormLoaderMask() {
    this.demoFormMaskLoaderHidden = true;
  }

  private showRescheduleFormLoaderMask() {
    this.demoRescheduleFormMaskLoaderHidden = false;
  }

  private hideRescheduleFormLoaderMask() {
    this.demoRescheduleFormMaskLoaderHidden = true;
  }

  private setSectionShowParams() {
    this.showForm = this.demoModifyAccess.demoUpdateFormAccess;
    this.showEditControlSection = this.demoModifyAccess.demoUpdateFormAccess && !this.formEditMandatoryDisbaled;
    this.showUpdateButton = this.showEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canCancelDemo && !this.canSuccessFailDemo;
    this.showRescheduleForm = this.demoModifyAccess.demoRescheduleFormAccess && !this.rescheduleMandatoryDisbaled;
    this.showRescheduleButton = this.showRescheduleForm && this.editReScheduleRecordForm;
  }

  public setFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  public setRescheduleFormStatus(isEditable: boolean) {
    this.editReScheduleRecordForm = isEditable;
    this.setSectionShowParams();
  }
  
  private getDemoGridRecord(demoSerialId: string) {
    this.showFormLoaderMask();
    this.showRescheduleFormLoaderMask();
    const data = {
      parentId: demoSerialId
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
      this.hideFormLoaderMask();
      this.hideRescheduleFormLoaderMask();
    }, 500);
  }

  private updateProperty(key: string, event: any, data_type: string, updatedRecord: any, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, updatedRecord, this.demoRecord, deselected, isAllOPeration);
  }

  updateDemoProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    if (!this.isRescheduleFormDirty) {
      this.isFormDirty = true;      
      this.updateProperty(key, event, data_type, this.demoUpdatedRecord, deselected, isAllOPeration);
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changed on the reschedule form do you still want to continue.',
        onOk: () => {
          this.isRescheduleFormDirty = false;
          this.isFormDirty = true;      
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
    if (!this.isRescheduleFormDirty) {
      this.update();
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changed on the reschedule form do you still want to continue.',
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
    this.showFormLoaderMask();
    this.showRescheduleFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentId(this.demoUpdatedRecord, this.demoRecord.demoSerialId);
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
      context.isFormDirty = false;
      context.getDemoGridRecord(context.demoSerialId);
    } else {
      context.hideFormLoaderMask();
      context.hideRescheduleFormLoaderMask();
    }
  }

  updateReScheduleProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    if (!this.isFormDirty) {
      this.isRescheduleFormDirty = true;      
      this.updateProperty(key, event, data_type, this.rescheduleUpdatedRecord, deselected, isAllOPeration);
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changed on the Update form do you still want to continue.',
        onOk: () => {
          this.isFormDirty = false;
          this.isRescheduleFormDirty = true;      
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
    if (!this.isFormDirty) {
      this.reschedule();
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changed on the Update form do you still want to continue.',
        onOk: () => {
          this.isFormDirty = false;
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
    this.showFormLoaderMask();
    this.showRescheduleFormLoaderMask();
    const newDemoDate: HTMLInputElement = <HTMLInputElement>document.getElementById('newDemoDate');
    const newDemoTime: HTMLInputElement = <HTMLInputElement>document.getElementById('newDemoTime');
    if (CommonUtilityFunctions.checkObjectAvailability(newDemoDate) && CommonUtilityFunctions.checkObjectAvailability(newDemoTime)) {
      CommonUtilityFunctions.updateRecordProperty(null, null, 'predefined_value', this.rescheduleUpdatedRecord, null, null, null, AppConstants.VARIABLE_LOCAL_TZ_OFFSET_MS);
      CommonUtilityFunctions.updateRecordProperty('demoDateMillis', newDemoDate.valueAsNumber.toString(), 'direct_value', this.rescheduleUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('demoTimeMillis', newDemoTime.valueAsNumber.toString(), 'direct_value', this.rescheduleUpdatedRecord, null, null, null);
    }
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentId(this.rescheduleUpdatedRecord, this.demoRecord.demoSerialId);
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
      context.isRescheduleFormDirty = false;
      context.getDemoGridRecord(response['newRescheduledDemoSerialId']);
    } else {
      context.hideFormLoaderMask();
      context.hideRescheduleFormLoaderMask();
    }
  }

  private getConfirmationMessageForFormsDirty() {
    let message: string = '';
    if (this.isFormDirty || this.isRescheduleFormDirty) {
      if (this.isFormDirty) {
        message += 'You have unsaved changes on the Update form.'
      }
      if (CommonUtilityFunctions.checkStringAvailability(message)) {
        message += '\n';
      }
      if (this.isRescheduleFormDirty) {
        message += 'You have unsaved changes on the Reschedule form.'
      }
      if (CommonUtilityFunctions.checkStringAvailability(message)) {
        message += '\n';
        message += 'Do you still want to continue';
      }
    }
    return message;
  }

  takeActionOnDemoRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    if (!this.isFormDirty || !this.isRescheduleFormDirty) {      
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
        this.showFormLoaderMask();
        this.showRescheduleFormLoaderMask();
        this.isFormDirty = false;  
        this.isRescheduleFormDirty = false;
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
      context.getDemoGridRecord(context.demoSerialId);
    } else {
      context.hideFormLoaderMask();
      context.hideRescheduleFormLoaderMask();
    }
  }  
}
