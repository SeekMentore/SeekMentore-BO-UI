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

@Component({
  selector: 'app-mapped-tutor-data',
  templateUrl: './mapped-tutor-data.component.html',
  styleUrls: ['./mapped-tutor-data.component.css']
})
export class MappedTutorDataComponent implements OnInit {

  @Input()
  enquiryRecord: GridRecord = null;

  @Input()
  mappedTutorRecord: GridRecord = null;

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
  superAccessAwarded = false;
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
  
  selectedIsTutorAgreedOption: any[] = [];
  selectedIsTutorRejectionValidOption: any[] = [];
  selectedIsClientAgreedOption: any[] = [];
  selectedIsClientRejectionValidOption: any[] = [];

  selectedRecordMappingStatus: string = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {     
  }

  ngOnInit() {
    this.selectedIsTutorAgreedOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.mappedTutorRecord.getProperty('isTutorAgreed'));
    this.selectedIsTutorRejectionValidOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.mappedTutorRecord.getProperty('isTutorRejectionValid'));
    this.selectedIsClientAgreedOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.mappedTutorRecord.getProperty('isClientAgreed'));
    this.selectedIsClientRejectionValidOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.mappedTutorRecord.getProperty('isClientRejectionValid'));
    this.selectedRecordMappingStatus = GridCommonFunctions.lookupRendererForValue(this.mappedTutorRecord.getProperty('mappingStatus'), this.mappingStatusFilterOptions);
    this.setDisabledStatus();
  }

  private setDisabledStatus() {
    if (this.selectedRecordMappingStatus === 'Pending') {
      this.formEditMandatoryDisbaled = false;
      this.takeActionDisabled = false;
    }
    if (this.selectedRecordMappingStatus === 'Demo Ready') {
      this.takeActionDisabled = false;
    }
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  updateMappedTutorProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.mappedTutorUpdatedRecord, this.mappedTutorRecord.property, deselected, isAllOPeration);
  }  

  updateMappedTutorRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.mappedTutorUpdatedRecord, this.mappedTutorRecord.getProperty('tutorMapperId'));
    this.utilityService.makerequest(this, this.onUpdateMappedTutorRecord, LcpRestUrls.mapped_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  unmapTutorRecord() {
    this.helperService.showConfirmationDialog({
      message: 'Please confirm if you want to un-map this tutor from the Enquiry',
      onOk: () => {
        const data = {
          allIdsList: this.mappedTutorRecord.getProperty('tutorMapperId')
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
          allIdsList: this.mappedTutorRecord.getProperty('tutorMapperId'),
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
