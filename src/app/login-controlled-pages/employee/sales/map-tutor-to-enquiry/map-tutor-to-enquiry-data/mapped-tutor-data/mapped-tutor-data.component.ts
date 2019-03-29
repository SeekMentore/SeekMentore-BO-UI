import { Component, Input, OnInit } from '@angular/core';
import { Enquiry } from 'src/app/model/enquiry';
import { TutorMapper } from 'src/app/model/tutor-mapper';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { TutorMapperDataAccess } from '../map-tutor-to-enquiry-data.component';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';

@Component({
  selector: 'app-mapped-tutor-data',
  templateUrl: './mapped-tutor-data.component.html',
  styleUrls: ['./mapped-tutor-data.component.css']
})
export class MappedTutorDataComponent implements OnInit {

  @Input()
  tutorMapperSerialId: string = null;

  @Input()
  tutorMapperDataAccess: TutorMapperDataAccess = null;

  tutorMapperUpdatedRecord = {};

  showTutorContactedDetails = false;
  showClientContactedDetails = false;
  showEmployeeActionDetails = false;
  showEnquiryDetails = false;
  showCustomerDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  mappingStatusFilterOptions = CommonFilterOptions.mappingStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;
  
  isFormDirty: boolean = false;
  tutorMapperFormMaskLoaderHidden: boolean = true;
  showMessage: boolean = false;
  showForm: boolean = false;
  showEditControlSection: boolean = false;
  showUpdateButton: boolean = false; 
  canUnmapTutor: boolean = false; 
  canMakeDemoReady: boolean = false;
  canMakePending: boolean = false;
  takeActionActionText: string;
  textMessage: string;

  // Modal Variables
  tutorMapperRecord: TutorMapper;
  tutorContactedDateAndTimeDisplay: string;
  clientContactedDateAndTimeDisplay: string;
  adminActionDateAndTimeDisplay: string;
  enquirySubjectLookupRendererFromValue: string;
  enquiryGradeLookupRendererFromValue: string;
  enquiryPreferredTeachingTypeLookupRendererFromValue: string;
  enquiryLocationLookupRendererFromValue: string;
  tutorMapperStatusLookupRendererFromValue: string;
  tutorMapperIsTutorContactedLookupRendererFromValue: string;
  tutorMapperIsClientContactedLookupRendererFromValue: string;
  tutorMapperIsDemoScheduledLookupRendererFromValue: string;
  selectedIsTutorAgreedOption: any[] = [];
  selectedIsTutorRejectionValidOption: any[] = [];
  selectedIsClientAgreedOption: any[] = [];
  selectedIsClientRejectionValidOption: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.tutorMapperRecord = new TutorMapper();    
  }

  ngOnInit() {
    this.getTutorMapperGridRecord(this.tutorMapperSerialId);
  }

  private showFormLoaderMask() {
    this.tutorMapperFormMaskLoaderHidden = false;
  }

  private hideFormLoaderMask() {
    this.tutorMapperFormMaskLoaderHidden = true;
  }

  private setSectionShowParams() {
    this.showForm = this.tutorMapperDataAccess.tutorMapperFormAccess;
    this.showEditControlSection = this.tutorMapperDataAccess.tutorMapperFormAccess && !this.formEditMandatoryDisbaled;
    this.showUpdateButton = this.showEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canUnmapTutor && !this.canMakeDemoReady && !this.canMakePending;
  }

  public setFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private getTutorMapperGridRecord(tutorMapperSerialId: string) {
    this.showFormLoaderMask();
    this.showMessage = false;
    const data = {
      parentId: tutorMapperSerialId
    };    
    this.utilityService.makerequest(this, this.onGetTutorMapperGridRecord, LcpRestUrls.get_tutor_mapper_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetTutorMapperGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['tutorMapperFormEditMandatoryDisbaled'];
      context.canUnmapTutor = gridRecordObject.additionalProperties['tutorMapperCanUnmapTutor'];
      context.canMakeDemoReady = gridRecordObject.additionalProperties['tutorMapperCanMakeDemoReady'];
      context.canMakePending = gridRecordObject.additionalProperties['tutorMapperCanMakePending'];
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

  private setUpDataModal(mappedTutorGridRecord: GridRecord) {
    CommonUtilityFunctions.logOnConsole(mappedTutorGridRecord);
    this.tutorMapperRecord.setValuesFromGridRecord(mappedTutorGridRecord);
    this.tutorMapperSerialId = this.tutorMapperRecord.tutorMapperSerialId;
    this.tutorContactedDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.tutorMapperRecord.tutorContactedDateMillis);
    this.clientContactedDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.tutorMapperRecord.clientContactedDateMillis);
    this.adminActionDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.tutorMapperRecord.adminActionDateMillis);
    this.enquirySubjectLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.enquirySubject, this.subjectsFilterOptions);
    this.enquiryGradeLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.enquiryGrade, this.studentGradesFilterOptions);
    this.enquiryPreferredTeachingTypeLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.enquiryPreferredTeachingType, this.preferredTeachingTypeFilterOptions);
    this.enquiryLocationLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.enquiryLocation, this.locationsFilterOptions);
    this.tutorMapperStatusLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.mappingStatus, this.mappingStatusFilterOptions);
    this.tutorMapperIsTutorContactedLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.isTutorContacted, this.yesNoFilterOptions);
    this.tutorMapperIsClientContactedLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.isClientContacted, this.yesNoFilterOptions);
    this.tutorMapperIsDemoScheduledLookupRendererFromValue = GridCommonFunctions.lookupRendererForValue(this.tutorMapperRecord.isDemoScheduled, this.yesNoFilterOptions);
    this.selectedIsTutorAgreedOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorMapperRecord.isTutorAgreed);
    this.selectedIsTutorRejectionValidOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorMapperRecord.isTutorRejectionValid);
    this.selectedIsClientAgreedOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorMapperRecord.isClientAgreed);
    this.selectedIsClientRejectionValidOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.tutorMapperRecord.isClientRejectionValid);
    CommonUtilityFunctions.setHTMLInputElementValue('quotedTutorRate', this.tutorMapperRecord.quotedTutorRate);
    CommonUtilityFunctions.setHTMLInputElementValue('negotiatedRateWithTutor', this.tutorMapperRecord.negotiatedRateWithTutor);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorNegotiationRemarks', this.tutorMapperRecord.tutorNegotiationRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('tutorResponse', this.tutorMapperRecord.tutorResponse);
    CommonUtilityFunctions.setHTMLInputElementValue('adminTutorRejectionValidityResponse', this.tutorMapperRecord.adminTutorRejectionValidityResponse);
    CommonUtilityFunctions.setHTMLInputElementValue('adminRemarksForTutor', this.tutorMapperRecord.adminRemarksForTutor);
    CommonUtilityFunctions.setHTMLInputElementValue('clientResponse', this.tutorMapperRecord.clientResponse);
    CommonUtilityFunctions.setHTMLInputElementValue('adminClientRejectionValidityResponse', this.tutorMapperRecord.adminClientRejectionValidityResponse);
    CommonUtilityFunctions.setHTMLInputElementValue('adminRemarksForClient', this.tutorMapperRecord.adminRemarksForClient);
    CommonUtilityFunctions.setHTMLInputElementValue('adminActionRemarks', this.tutorMapperRecord.adminActionRemarks);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideFormLoaderMask();
    }, 500);
  }

  updateTutorMapperProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.isFormDirty = true;
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.tutorMapperUpdatedRecord, this.tutorMapperRecord, deselected, isAllOPeration);
  }  

  updateTutorMapperRecord() {
    this.showFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentId(this.tutorMapperUpdatedRecord, this.tutorMapperRecord.tutorMapperSerialId);
    this.utilityService.makerequest(this, this.onUpdateTutorMapperRecord, LcpRestUrls.mapped_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateTutorMapperRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.isFormDirty = false;
      context.getTutorMapperGridRecord(context.tutorMapperSerialId);
    } else {
      context.hideFormLoaderMask();
    }
  }

  resetTutorMapperRecord() {
    if (!this.isFormDirty) {
      this.getTutorMapperGridRecord(this.tutorMapperSerialId);
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changed on the Update form do you still want to continue.',
        onOk: () => {
          this.isFormDirty = false;
          this.getTutorMapperGridRecord(this.tutorMapperSerialId);
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

  unmapTutorRecord() {
    if (!this.isFormDirty) {
      this.unmapTutor();
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changed on the Update form do you still want to continue.',
        onOk: () => {
          this.isFormDirty = false;
          this.unmapTutor();
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

  private unmapTutor() {
    this.helperService.showConfirmationDialog({
      message: 'Please confirm if you want to un-map this tutor from the Enquiry',
      onOk: () => {
        this.takeActionActionText = 'unmap'; 
        const data = {
          allIdsList: this.tutorMapperRecord.tutorMapperSerialId
        };
        this.utilityService.makerequest(this, this.handleTakeActionOnMappedTutorRecord,
          LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  takeActionOnTutorMapperRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    if (!this.isFormDirty) {
      this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changed on the Update form do you still want to continue.',
        onOk: () => {
          this.takeActionActionText = actionText; 
          this.isFormDirty = false;
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
        this.takeActionActionText = actionText;            
        const data = {
          allIdsList: this.tutorMapperRecord.tutorMapperSerialId,
          button: actionText,
          comments: message
        };
        this.utilityService.makerequest(this, this.handleTakeActionOnMappedTutorRecord,
          LcpRestUrls.take_action_on_mapped_tutor, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnMappedTutorRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      if (context.takeActionActionText === 'unmap') {
        context.showForm = false;
        context.showMessage = true;
        context.textMessage = 'Successfully Unmapped the Tutor Record, please go back to listing to select another record';
      } else {
        context.editRecordForm = false;
        context.getTutorMapperGridRecord(context.tutorMapperSerialId);
      }
    } else {
      context.hideFormLoaderMask();
    }
  }
}
