import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { SubscribedCustomerDataAccess } from '../subscribed-customer.component';
import {CommonFilterOptions} from "../../../../../utils/common-filter-options";
import {LcpRestUrls} from "../../../../../utils/lcp-rest-urls";

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
  editRecordForm = false;

  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;

  customerUpdatedData = {};

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.currentPackagesGridMetaData = null;
    this.historyPackagesGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if( this.customerDataAccess.activePackageViewAccess ) {
        this.currentPackagesGridObject.init();
        this.currentPackagesGridObject.addExtraParams('customerId', this.customerRecord.getProperty('customerId'));
      }
      if( this.customerDataAccess.historyPackagesViewAccess ) {
        this.historyPackagesGridObject.init();
        this.historyPackagesGridObject.addExtraParams('customerId', this.customerRecord.getProperty('customerId'));
      }

      this.renderCustomerRecordForm = true;
    }, 0);
    setTimeout(() => {
      if( this.customerDataAccess.activePackageViewAccess ) {
        this.currentPackagesGridObject.refreshGridData();
      }
      if( this.customerDataAccess.historyPackagesViewAccess) {
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
          restURL: '/rest/subscribedCustomer/currentPackages'
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
        },{
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
          restURL: '/rest/subscribedCustomer/historyPackages'
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
        },{
          id: 'endDate',
          headerName: 'Completed Hours',
          dataType: 'date',
          mapping: 'endDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }]
      },
      htmlDomElementId: 'history-packages-grid',
      hidden: false
    };
  }

  isSubjectSelected(value: string) {
    return this.customerRecord.property['interestedSubjects'].split(';').includes(value);
  }


  updateCustomerProperty(key: string, value: string, date_type: string) {
    switch (date_type) {
      case 'list':
        let previous_value = this.customerUpdatedData[key];
        if (!previous_value) {
          previous_value = this.customerRecord.property[key];
        }
        const previous_value_array = previous_value.split(';');
        if (previous_value_array.includes(value)) {
          previous_value_array.splice(previous_value_array.indexOf(value), 1);

        } else {
          previous_value_array.push(value);
        }
        this.customerUpdatedData[key] = previous_value_array.join(';');
        break;
      default:
        this.customerUpdatedData[key] = value;
    }
    console.log(this.customerUpdatedData);
  }

  updateCustomerRecord() {
    const data = {
      completeCustomerRecord: JSON.stringify(this.customerUpdatedData)
    };
    // alert(JSON.stringify(this.tutorUpdatedData))
    this.utilityService.makerequest(this, this.onUpdateTutorRecord, LcpRestUrls.customer_update_record, 'POST',
      this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onUpdateTutorRecord(context: any, data: any) {
    if (data['success'] === true) {

    } else {

    }
  }


}
