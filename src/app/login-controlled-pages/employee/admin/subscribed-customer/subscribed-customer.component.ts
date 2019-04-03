import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from "src/app/utils/app-utility.service";
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from "src/app/utils/helper.service";
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { BreadCrumbEvent } from 'src/app/login-controlled-pages/bread-crumb/bread-crumb.component';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribed-customer',
  templateUrl: './subscribed-customer.component.html',
  styleUrls: ['./subscribed-customer.component.css']
})
export class SubscribedCustomerComponent implements OnInit {

  @ViewChild('subscribedCustomerGrid')
  subscribedCustomerGridObject: GridComponent;
  subscribedCustomerGridMetaData: GridDataInterface;

  showCustomerData = false;
  selectedCustomerSerialId: string = null;
  interimHoldSelectedCustomerSerialId: string = null;
  subscribedCustomerDataAccess: SubscribedCustomerDataAccess = null;

  constructor(public utilityService: AppUtilityService, public helperService: HelperService, private router: Router) {
    this.subscribedCustomerGridMetaData = null;
    this.showCustomerData = false;
    this.selectedCustomerSerialId = null;
    this.subscribedCustomerDataAccess = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
    const breadCrumb: BreadCrumbEvent = {
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    };
    this.helperService.setBreadCrumb(breadCrumb);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.subscribedCustomerGridObject.init();
    }, 100);
    setTimeout(() => {
      this.subscribedCustomerGridObject.refreshGridData();
    }, 100);
  }

  public setUpGridMetaData() {
    this.subscribedCustomerGridMetaData = {
      grid: {
        id: 'subscribedCustomerGrid',
        title: 'Subscribed Customers',
        store: {
          isStatic: false,
          restURL: '/rest/admin/subscribedCustomersList',
          download: {
            url: '/rest/admin/downloadAdminReportSubscribedCustomerList'
          }
        },
        columns: [{
            id: 'customerSerialId',
            headerName: 'Customer Serial Id',
            dataType: 'string',
            mapping: 'customerSerialId',
            clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
              this.interimHoldSelectedCustomerSerialId = column.getValueForColumn(record);
              if (this.subscribedCustomerDataAccess === null) {
                this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.customer_data_access, 'POST', null, 'application/x-www-form-urlencoded');
              } else {
                this.selectedCustomerSerialId = this.interimHoldSelectedCustomerSerialId;
                this.toggleVisibilitySubscribedCustomerGrid();
              }
            }
          }, {
            id: 'name',
            headerName: 'Name',
            dataType: 'string',
            mapping: 'name'
          }, {
            id: 'contactNumber',
            headerName: 'Primary Contact Number',
            dataType: 'string',
            mapping: 'contactNumber'
          }, {
            id: 'emailId',
            headerName: 'Primary Email Id',
            dataType: 'string',
            mapping: 'emailId'
          }, {
            id: 'studentGrades',
            headerName: 'Student Grades',
            dataType: 'list',
            filterOptions: CommonFilterOptions.studentGradesFilterOptions,
            mapping: 'studentGrades',
            multiList: true,
            renderer: AdminCommonFunctions.studentGradesMultiRenderer
          }, {
            id: 'interestedSubjects',
            headerName: 'Interested Subjects',
            dataType: 'list',
            filterOptions: CommonFilterOptions.subjectsFilterOptions,
            mapping: 'interestedSubjects',
            multiList: true,
            renderer: AdminCommonFunctions.subjectsMultiRenderer
          }, {
            id: 'location',
            headerName: 'Location',
            dataType: 'list',
            filterOptions: CommonFilterOptions.locationsFilterOptions,
            mapping: 'location',
            renderer: AdminCommonFunctions.locationsRenderer
          }, {
            id: 'addressDetails',
            headerName: 'Address Details',
            dataType: 'string',
            mapping: 'addressDetails',
            lengthyData: true
          }, {
            id: 'additionalDetails',
            headerName: 'Additional Details',
            dataType: 'string',
            mapping: 'additionalDetails',
            lengthyData: true
          }
        ],
        hasSelectionColumn: true,
        selectionColumn: {
          buttons: [{
            id: 'sendEmail',
            label: 'Send Email',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
              const selectedEmailsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'emailId');
              if (selectedEmailsList.length === 0) {
                this.helperService.showAlertDialog({
                  isSuccess: false,
                  message: LcpConstants.grid_generic_no_record_selected_error,
                  onButtonClicked: () => {
                  }
                });
              } else {
                this.helperService.showEmailDialog(selectedEmailsList.join(';'));
              }
            }
          }]
        }
      },
      htmlDomElementId: 'subscribed-customer-grid',
      hidden: false
    };
  }

  handleDataAccessRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.subscribedCustomerDataAccess = {
        success: response.success,
        message: response.message,
        subscribedCustomerRecordUpdateAccess                      : response.subscribedCustomerRecordUpdateAccess,
        subscribedCustomerActiveSubscriptionPackageViewAccess     : response.subscribedCustomerActiveSubscriptionPackageViewAccess,
        subscribedCustomerHistorySubscriptionPackagesViewAccess   : response.subscribedCustomerHistorySubscriptionPackagesViewAccess,
      };
      context.selectedCustomerSerialId = context.interimHoldSelectedCustomerSerialId;
      context.toggleVisibilitySubscribedCustomerGrid();
    }
  }

  toggleVisibilitySubscribedCustomerGrid() {
    if (this.showCustomerData === true) {
      this.showCustomerData = false;
      this.selectedCustomerSerialId = null;
      setTimeout(() => {
        this.subscribedCustomerGridObject.init();
      }, 100);
      setTimeout(() => {
        this.subscribedCustomerGridObject.refreshGridData();
      }, 100);
    } else {
      this.showCustomerData = true;
    }
  }
}

export interface SubscribedCustomerDataAccess {
  success: boolean;
  message: string;
  subscribedCustomerRecordUpdateAccess: boolean;
  subscribedCustomerActiveSubscriptionPackageViewAccess: boolean;
  subscribedCustomerHistorySubscriptionPackagesViewAccess: boolean;
}
