import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { MappedTutorDataAccess } from '../map-tutor-to-enquiry-data.component';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { TutorMapper } from 'src/app/model/tutor-mapper';
import { Enquiry } from 'src/app/model/enquiry';

@Component({
  selector: 'app-mapped-tutor-data',
  templateUrl: './mapped-tutor-data.component.html',
  styleUrls: ['./mapped-tutor-data.component.css']
})
export class MappedTutorDataComponent implements OnInit {

  @Input()
  enquirySerialId: string = null;

  @Input()
  mappedTutorSerialId: string = null;

  @Input()
  mappedTutorDataAccess: MappedTutorDataAccess = null;

  mappedTutorUpdatedRecord = {};

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
  showForm: boolean = false;
  showEditControlSection: boolean = false;
  showUpdateButton: boolean = false; 
  canUnmapTutor: boolean = false; 
  canMakeDemoReady: boolean = false;
  canMakePending: boolean = false;
  takeActionActionText: string;

  // Modal Variables
  enquiryRecord: Enquiry;
  mappedTutorRecord: TutorMapper;
  selectedIsTutorAgreedOption: any[] = [];
  selectedIsTutorRejectionValidOption: any[] = [];
  selectedIsClientAgreedOption: any[] = [];
  selectedIsClientRejectionValidOption: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.enquiryRecord = new Enquiry();
    this.mappedTutorRecord = new TutorMapper();    
  }

  ngOnInit() {
    this.selectedIsTutorAgreedOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.mappedTutorRecord.isTutorAgreed);
    this.selectedIsTutorRejectionValidOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.mappedTutorRecord.isTutorRejectionValid);
    this.selectedIsClientAgreedOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.mappedTutorRecord.isClientAgreed);
    this.selectedIsClientRejectionValidOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.mappedTutorRecord.isClientRejectionValid);
  }

  private showFormLoaderMask() {
    this.tutorMapperFormMaskLoaderHidden = false;
  }

  private hideFormLoaderMask() {
    this.tutorMapperFormMaskLoaderHidden = true;
  }

  private setSectionShowParams() {
    this.showForm = this.mappedTutorDataAccess.mappedEnquiryFormAccess;
    this.showEditControlSection = this.mappedTutorDataAccess.mappedEnquiryFormAccess && !this.formEditMandatoryDisbaled;
    this.showUpdateButton = this.showEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canUnmapTutor && !this.canMakeDemoReady && !this.canMakePending;
  }

  updateMappedTutorProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.isFormDirty = true;
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.mappedTutorUpdatedRecord, this.mappedTutorRecord, deselected, isAllOPeration);
  }  

  updateMappedTutorRecord() {
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentId(this.mappedTutorUpdatedRecord, this.mappedTutorRecord.tutorMapperSerialId);
    this.utilityService.makerequest(this, this.onUpdateMappedTutorRecord, LcpRestUrls.mapped_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  unmapTutorRecord() {
    this.helperService.showConfirmationDialog({
      message: 'Please confirm if you want to un-map this tutor from the Enquiry',
      onOk: () => {
        const data = {
          allIdsList: this.mappedTutorRecord.tutorMapperSerialId
        };
        this.utilityService.makerequest(this, this.handleTakeActionOnMappedTutorRecord,
          LcpRestUrls.map_tutor_to_enquiry_unmap_registered_tutors, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  takeActionOnMappedTutorRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.mappedTutorRecord.tutorMapperSerialId,
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
  }

  onUpdateMappedTutorRecord(context: any, response: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: response['success'],
      message: CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']),
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (response['success']) {
      context.editRecordForm = false;
    }
  }

}
