import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { DemoTrackerModifyAccess } from '../demo-tracker.component';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-demo-tracker-data',
  templateUrl: './demo-tracker-data.component.html',
  styleUrls: ['./demo-tracker-data.component.css']
})
export class DemoTrackerDataComponent implements OnInit {

  @Input()
  demoTrackerRecord: GridRecord = null;

  @Input()
  demoTrackerModifyAccess: DemoTrackerModifyAccess = null;

  @Input()
  selectedRecordGridType: string = null;

  demoTrackerUpdatedRecord = {};

  showCustomerDetails = false;
  showEnquiryDetails = false;
  showTutorDetails = false;
  showTutorMapperDetails = false;
  showEmployeeActionDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  superAccessAwarded = false;
  editRecordForm = false;
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

  selectedDemoOccurredOption: any[] = [];
  selectedClientSatisfiedFromTutorOption: any[] = [];
  selectedTutorSatisfiedWithClientOption: any[] = [];
  selectedAdminSatisfiedFromTutorOption: any[] = [];
  selectedAdminSatisfiedWithClientOption: any[] = [];
  selectedIsDemoSuccessOption: any[] = [];
  selectedNeedPriceNegotiationWithClientOption: any[] = [];
  selectedNeedPriceNegotiationWithTutorOption: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { }

  ngOnInit() {
    this.selectedDemoOccurredOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoTrackerRecord.getProperty('demoOccurred'));
    this.selectedClientSatisfiedFromTutorOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoTrackerRecord.getProperty('clientSatisfiedFromTutor'));
    this.selectedTutorSatisfiedWithClientOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoTrackerRecord.getProperty('tutorSatisfiedWithClient'));
    this.selectedAdminSatisfiedFromTutorOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoTrackerRecord.getProperty('adminSatisfiedFromTutor'));
    this.selectedAdminSatisfiedWithClientOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoTrackerRecord.getProperty('adminSatisfiedWithClient'));
    this.selectedIsDemoSuccessOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoTrackerRecord.getProperty('isDemoSuccess'));
    this.selectedNeedPriceNegotiationWithClientOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoTrackerRecord.getProperty('needPriceNegotiationWithClient'));
    this.selectedNeedPriceNegotiationWithTutorOption = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.demoTrackerRecord.getProperty('needPriceNegotiationWithTutor'));
    this.setDisabledStatus();
  }

  private setDisabledStatus() {
    if (this.selectedRecordGridType === 'scheduledDemoGrid' || this.selectedRecordGridType === 'reScheduledDemoGrid') {
      this.formEditMandatoryDisbaled = false;
      this.takeActionDisabled = false;
    }
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  updateDemoTrackerProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.demoTrackerUpdatedRecord, this.demoTrackerRecord.property, deselected, isAllOPeration);
  }

  updateDemoTrackerRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.demoTrackerUpdatedRecord, this.demoTrackerRecord.getProperty('demoTrackerId'));
    this.utilityService.makerequest(this, this.onUpdateDemoTrackerRecord, LcpRestUrls.demo_tracker_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  reScheduleDemo() {
    this.demoTrackerUpdatedRecord['tutorMapperId'] = this.demoTrackerRecord.getProperty('tutorMapperId').toString();
    this.demoTrackerUpdatedRecord['reScheduleCount'] = this.demoTrackerRecord.getProperty('reScheduleCount').toString();
    const data = CommonUtilityFunctions.encodedGridFormData(this.demoTrackerUpdatedRecord, this.demoTrackerRecord.getProperty('demoTrackerId'));
    this.utilityService.makerequest(this, this.onUpdateDemoTrackerRecord, LcpRestUrls.re_schedule_demo, 'POST',
      data, 'multipart/form-data', true);
  }

  takeActionOnDemoRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.demoTrackerRecord.getProperty('demoTrackerId'),
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
      message: CommonUtilityFunctions.removeHTMLBRTagsFromServerResponse(response['message']),
      onButtonClicked: () => {
      }
    });
  }

  onUpdateDemoTrackerRecord(context: any, response: any) {
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
