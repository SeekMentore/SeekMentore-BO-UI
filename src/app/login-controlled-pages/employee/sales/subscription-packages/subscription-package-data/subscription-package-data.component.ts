import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { SubscriptionPackageDataAccess } from '../subscription-packages.component';

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

  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedTeachingTypeOptions: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.selectedSubscriptionPackageAllCurrentAssignmentGridMetaData = null;
    this.selectedSubscriptionPackageAllHistoryAssignmentGridMetaData = null;
  }

  ngOnInit() {
    this.selectedStudentGradeOption = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.subscriptionPackageRecord.getProperty('grade'));
    this.selectedSubjectOption = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.subscriptionPackageRecord.getProperty('subject'));
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.subscriptionPackageRecord.getProperty('locationDetails'));
    this.selectedTeachingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTeachingTypeFilterOptions, this.subscriptionPackageRecord.getProperty('preferredTeachingType'));
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
      grid: this.getPackageAssignmentGridObject('selectedSubscriptionPackageAllCurrentAssignmentGrid', 'Current Assignments', '/rest/sales/selectedSubscriptionPackageAllCurrentAssignmentList'),
      htmlDomElementId: 'selected-subscription-package-all-current-assignment-grid',
      hidden: false
    };

    this.selectedSubscriptionPackageAllHistoryAssignmentGridMetaData = {
      grid: this.getPackageAssignmentGridObject('selectedSubscriptionPackageAllHistoryAssignmentGrid', 'History Assignments', 
                                                '/rest/sales/selectedSubscriptionPackageAllHistoryAssignmentList', true),
      htmlDomElementId: 'selected-subscription-package-all-history-assignment-grid',
      hidden: false
    };
  }

}
