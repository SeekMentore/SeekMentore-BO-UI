import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {HelperService} from 'src/app/utils/helper.service';
import {SubscribedCustomerDataAccess} from '../subscribed-customer.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';
import {LcpRestUrls} from '../../../../../utils/lcp-rest-urls';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-subscribed-customer-data',
  templateUrl: './subscribed-customer-data.component.html',
  styleUrls: ['./subscribed-customer-data.component.css']
})
export class SubscribedCustomerDataComponent implements OnInit {

  @ViewChild('currentPackagesGrid')
  currentPackagesGridObject: GridComponent;
  currentPackagesGridMetaData: GridDataInterface;

  @ViewChild('historyPackagesGrid')
  historyPackagesGridObject: GridComponent;
  historyPackagesGridMetaData: GridDataInterface;

  @Input()
  customerRecord: GridRecord = null;

  @Input()
  customerDataAccess: SubscribedCustomerDataAccess = null;

  renderCustomerRecordForm = false;

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;

  customerUpdatedData = {};

  selectedGenderOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedGradesOptions: any[] = [];
  selectedSubjectOptions: any[] = [];

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.currentPackagesGridMetaData = null;
    this.historyPackagesGridMetaData = null;
  }

  ngOnInit() {
    this.selectedGenderOption = CommonUtilityFunctions.getSelectedFilterItems(this.genderFilterOptions, this.customerRecord.getProperty('gender'));
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.customerRecord.getProperty('location'));
    this.selectedGradesOptions = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.customerRecord.getProperty('studentGrades'));
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.customerRecord.getProperty('interestedSubjects'));
    this.setUpGridMetaData();
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.customerDataAccess.activePackageViewAccess) {
        this.currentPackagesGridObject.init();
        this.currentPackagesGridObject.addExtraParams('customerId', this.customerRecord.getProperty('customerId'));
      }
      if (this.customerDataAccess.historyPackagesViewAccess) {
        this.historyPackagesGridObject.init();
        this.historyPackagesGridObject.addExtraParams('customerId', this.customerRecord.getProperty('customerId'));
      }
      this.renderCustomerRecordForm = true;
    }, 0);
    setTimeout(() => {
      if (this.customerDataAccess.activePackageViewAccess) {
        this.currentPackagesGridObject.refreshGridData();
      }
      if (this.customerDataAccess.historyPackagesViewAccess) {
        this.historyPackagesGridObject.refreshGridData();
      }
    }, 0);
  }

  public setUpGridMetaData() {
    this.currentPackagesGridMetaData = {
      grid: {
        id: 'currentPackagesGrid',
        title: 'Current Packages',
        store: {
          isStatic: false,
          restURL: '/rest/subscribedCustomer/currentPackageList'
        },
        columns: [{
          id: 'customerName',
          headerName: 'Customer Name',
          dataType: 'string',
          mapping: 'customerName'
        }, {
          id: 'totalHours',
          headerName: 'Total Hours',
          dataType: 'number',
          mapping: 'totalHours'
        }, {
          id: 'startDate',
          headerName: 'Start Date',
          dataType: 'date',
          mapping: 'startDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'completedHours',
          headerName: 'Completed Hours',
          dataType: 'number',
          mapping: 'completedHours'
        }]
      },
      htmlDomElementId: 'current-packages-grid',
      hidden: false,
    };

    this.historyPackagesGridMetaData = {
      grid: {
        id: 'historyPackagesGrid',
        title: 'History Packages',
        store: {
          isStatic: false,
          restURL: '/rest/subscribedCustomer/historyPackageList'
        },
        columns: [{
          id: 'customerName',
          headerName: 'Customer Name',
          dataType: 'string',
          mapping: 'customerName'
        }, {
          id: 'totalHours',
          headerName: 'Total Hours',
          dataType: 'number',
          mapping: 'totalHours'
        }, {
          id: 'startDate',
          headerName: 'Start Date',
          dataType: 'date',
          mapping: 'startDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'endDate',
          headerName: 'End Date',
          dataType: 'date',
          mapping: 'endDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }]
      },
      htmlDomElementId: 'history-packages-grid',
      hidden: false
    };
  }

  updateCustomerProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.customerUpdatedData, this.customerRecord, deselected, isAllOPeration);
  }

  updateCustomerRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.customerUpdatedData, this.customerRecord.getProperty('customerId'));
    this.utilityService.makerequest(this, this.onUpdateCustomerRecord, LcpRestUrls.customer_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateCustomerRecord(context: any, response: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (response['success']) {
      context.editRecordForm = false;
    }
  }
}
