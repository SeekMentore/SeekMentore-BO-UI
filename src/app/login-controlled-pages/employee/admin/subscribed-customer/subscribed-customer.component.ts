import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminCommonFunctions} from 'src/app/utils/admin-common-functions';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {ActionButton} from 'src/app/utils/grid/action-button';
import {Column} from 'src/app/utils/grid/column';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {LcpConstants} from 'src/app/utils/lcp-constants';
import {LcpRestUrls} from 'src/app/utils/lcp-rest-urls';
import {AppUtilityService} from "src/app/utils/app-utility.service";
import {HelperService} from "src/app/utils/helper.service";

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
  selectedCustomerRecord: GridRecord = null;
  interimHoldSelectedCustomerRecord: GridRecord = null;
  customerDataAccess: SubscribedCustomerDataAccess = null;


  constructor(public utilityService: AppUtilityService, public helperService: HelperService) {
    this.subscribedCustomerGridMetaData = null;
    this.showCustomerData = false;
    this.selectedCustomerRecord = null;
    this.customerDataAccess = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.subscribedCustomerGridObject.init();
    }, 0);

    setTimeout(() => {
      this.subscribedCustomerGridObject.refreshGridData();
    }, 0);
  }

  public setUpGridMetaData() {
    this.subscribedCustomerGridMetaData = {
      grid: {
        id: 'subscribedCustomerGrid',
        title: 'Subscribed Customers',
        store: {
          isStatic: false,
          restURL: '/rest/admin/subscribedCustomersList'
        },
        columns: [
          {
            id: 'name',
            headerName: 'Name',
            dataType: 'string',
            mapping: 'name',
            clickEvent: (record: GridRecord, column: Column) => {
              // Open the Data view port
              this.interimHoldSelectedCustomerRecord = record;
              if (this.customerDataAccess === null) {
                this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.customer_data_access, 'POST');
              } else {
                this.selectedCustomerRecord = this.interimHoldSelectedCustomerRecord;
                this.toggleVisibilitySubscribedCustomerGrid();
              }
            }
          },
          {
            id: 'contactNumber',
            headerName: 'Contact Number',
            dataType: 'string',
            mapping: 'contactNumber'
          },
          {
            id: 'emailId',
            headerName: 'Email Id',
            dataType: 'string',
            mapping: 'emailId'
          },
          {
            id: 'studentGrades',
            headerName: 'Student Grades',
            dataType: 'list',
            filterOptions: CommonFilterOptions.studentGradesFilterOptions,
            mapping: 'studentGrades',
            multiList: true,
            renderer: AdminCommonFunctions.studentGradesMultiRenderer
          },
          {
            id: 'interestedSubjects',
            headerName: 'Interested Subjects',
            dataType: 'list',
            filterOptions: CommonFilterOptions.subjectsFilterOptions,
            mapping: 'interestedSubjects',
            multiList: true,
            renderer: AdminCommonFunctions.subjectsMultiRenderer
          },
          {
            id: 'location',
            headerName: 'Location',
            dataType: 'list',
            filterOptions: CommonFilterOptions.locationsFilterOptions,
            mapping: 'location',
            renderer: AdminCommonFunctions.locationsRenderer
          },
          {
            id: 'addressDetails',
            headerName: 'Address Details',
            dataType: 'string',
            mapping: 'addressDetails',
            lengthyData: true
          },
          {
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
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              // Refer document
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
          }, {
            id: 'blacklist',
            label: 'Blacklist',
            btnclass: 'btnReject',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              const customerIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'customerId');
              if (customerIdsList.length === 0) {
                this.helperService.showAlertDialog({
                  isSuccess: false,
                  message: LcpConstants.grid_generic_no_record_selected_error,
                  onButtonClicked: () => {
                  }
                });
              } else {
                const data = {
                  allIdsList: customerIdsList.join(';'),
                  comments: ''
                };
                this.utilityService.makerequest(this, this.handleBlackListRequest,
                  LcpRestUrls.blackList_subscribed_customers, 'POST', this.utilityService.urlEncodeData(data),
                  'application/x-www-form-urlencoded');
              }
            }
          }]
        }
      },
      htmlDomElementId: 'subscribed-customer-grid',
      hidden: false
    };
  }

  handleBlackListRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.subscribedCustomerGridObject.refreshGridData();
    }
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
      context.customerDataAccess = {
        success: response.success,
        message: response.message,
        formDataEditAccess: response.formDataEditAccess,
        activePackageViewAccess: response.activePackageViewAccess,
        historyPackagesViewAccess: response.historyPackagesViewAccess,
      };

      context.selectedCustomerRecord = context.interimHoldSelectedCustomerRecord;
      context.toggleVisibilitySubscribedCustomerGrid();
    }
  }

  toggleVisibilitySubscribedCustomerGrid() {
    if (this.showCustomerData === true) {
      this.showCustomerData = false;
      this.selectedCustomerRecord = null;
      setTimeout(() => {
        this.subscribedCustomerGridObject.init();
      }, 0);
      setTimeout(() => {
        this.subscribedCustomerGridObject.refreshGridData();
      }, 0);

    } else {
      this.showCustomerData = true;
    }
  }

}

export interface SubscribedCustomerDataAccess {
  success: boolean;
  message: string;
  formDataEditAccess: boolean;
  activePackageViewAccess: boolean;
  historyPackagesViewAccess: boolean;
}
