import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { SubscriptionPackageDataAccess } from '../subscription-packages.component';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-subscription-package-data',
  templateUrl: './subscription-package-data.component.html',
  styleUrls: ['./subscription-package-data.component.css']
})
export class SubscriptionPackageDataComponent implements OnInit {

  @ViewChild('selectedSubscriptionPackageAllCurrentAssignmentGrid')
  selectedSubscriptionPackageAllCurrentAssignmentGridObject: GridComponent;
  selectedSubscriptionPackageAllCurrentAssignmentGridMetaData: GridDataInterface;

  @ViewChild('selectedSubscriptionPackageAllHistoryAssignmentGrid')
  selectedSubscriptionPackageAllHistoryAssignmentGridObject: GridComponent;
  selectedSubscriptionPackageAllHistoryAssignmentGridMetaData: GridDataInterface;

  @Input()
  subscriptionPackageRecord: GridRecord = null;

  @Input()
  subscriptionPackageDataAccess: SubscriptionPackageDataAccess = null;

  @Input()
  selectedRecordGridType: string = null;

  subscriptionPackageUpdatedRecord = {};

  loadSelectedSubscriptionPackage = true;
  showCustomerDetails = false;
  showEnquiryDetails = false;
  showTutorDetails = false;
  showTutorMapperDetails = false;
  showDemoDetails = false;
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
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;
  happinessIndexFilterOptions = CommonFilterOptions.happinessIndexFilterOptions;
  packageBillingTypeFilterOptions = CommonFilterOptions.packageBillingTypeFilterOptions;

  selectedPackageBillingTypeOptions: any[] = [];
  selectedIsCustomerGrievedOptions: any[] = [];
  selectedCustomerHappinessIndexOptions: any[] = [];
  selectedIsTutorGrievedOptions: any[] = [];
  selectedTutorHappinessIndexOptions: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.selectedSubscriptionPackageAllCurrentAssignmentGridMetaData = null;
    this.selectedSubscriptionPackageAllHistoryAssignmentGridMetaData = null;
  }

  ngOnInit() {
    this.selectedPackageBillingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.packageBillingTypeFilterOptions, this.subscriptionPackageRecord.getProperty('packageBillingType'));
    this.selectedIsCustomerGrievedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.subscriptionPackageRecord.getProperty('isCustomerGrieved'));
    this.selectedCustomerHappinessIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.subscriptionPackageRecord.getProperty('customerHappinessIndex'));
    this.selectedIsTutorGrievedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.subscriptionPackageRecord.getProperty('isTutorGrieved'));
    this.selectedTutorHappinessIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.subscriptionPackageRecord.getProperty('tutorHappinessIndex'));
    this.setUpGridMetaData();
    this.setDisabledStatus();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.init();
      this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.addExtraParams('subscriptionPackageId', this.subscriptionPackageRecord.getProperty('subscriptionPackageId'));
      this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.init();
      this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.addExtraParams('subscriptionPackageId', this.subscriptionPackageRecord.getProperty('subscriptionPackageId'));
    }, 0);
    setTimeout(() => {
      this.selectedSubscriptionPackageAllCurrentAssignmentGridObject.refreshGridData();
      this.selectedSubscriptionPackageAllHistoryAssignmentGridObject.refreshGridData();
    }, 0);
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  private setDisabledStatus() {
    if (this.selectedRecordGridType === 'currentPackagesGrid') {
      this.formEditMandatoryDisbaled = false;
      this.takeActionDisabled = false;
    }
  }

  public getPackageAssignmentGridObject(id: string, title: string, restURL: string, collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'startDateMillis',
        headerName: 'Start Date',
        dataType: 'date',
        mapping: 'startDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
      },{
        id: 'totalHours',
        headerName: 'Total Hours',
        dataType: 'number',
        mapping: 'totalHours'
      },{
        id: 'completedHours',
        headerName: 'Completed Hours',
        dataType: 'number',
        mapping: 'completedHours'
      },{
        id: 'completedMinutes',
        headerName: 'Completed Minutes',
        dataType: 'number',
        mapping: 'completedMinutes'
      },{
        id: 'endDateMillis',
        headerName: 'End Date',
        dataType: 'date',
        mapping: 'endDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
      },{
        id: 'createdMillis',
        headerName: 'Created Date',
        dataType: 'date',
        mapping: 'createdMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      }]
    };
    return grid;
  }

  public setUpGridMetaData() {
    this.selectedSubscriptionPackageAllCurrentAssignmentGridMetaData = {
      grid: this.getPackageAssignmentGridObject('selectedSubscriptionPackageAllCurrentAssignmentGrid', 'Current Assignments', '/rest/sales/selectedSubscriptionPackageCurrentAssignmentList'),
      htmlDomElementId: 'selected-subscription-package-all-current-assignment-grid',
      hidden: false
    };

    this.selectedSubscriptionPackageAllHistoryAssignmentGridMetaData = {
      grid: this.getPackageAssignmentGridObject('selectedSubscriptionPackageAllHistoryAssignmentGrid', 'History Assignments', 
                                                '/rest/sales/selectedSubscriptionPackageHistoryAssignmentList', true),
      htmlDomElementId: 'selected-subscription-package-all-history-assignment-grid',
      hidden: false
    };
  }

  updateSubscriptionPackageProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.subscriptionPackageUpdatedRecord, this.subscriptionPackageRecord, deselected, isAllOPeration);
  }

  updateSubscriptionPackageRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.subscriptionPackageUpdatedRecord, this.subscriptionPackageRecord.getProperty('subscriptionPackageId'));
    this.utilityService.makerequest(this, this.onUpdateSubscriptionPackageRecord, LcpRestUrls.subscription_package_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  startSubscription() {

  }

  endSubscription() {
    
  }

  createAssignment() {
    
  }

  downloadContract() {
    
  }

  onUpdateSubscriptionPackageRecord(context: any, data: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: data['success'],
      message: data['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (data['success']) {
      context.editRecordForm = false;
    }
  }
}
