import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GridDataInterface, GridComponent } from 'src/app/utils/grid/grid.component';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { Column } from 'src/app/utils/grid/column';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { LcpConstants } from 'src/app/utils/lcp-constants';

@Component({
  selector: 'app-all-enquiries',
  templateUrl: './all-enquiries.component.html',
  styleUrls: ['./all-enquiries.component.css']
})
export class AllEnquiriesComponent implements OnInit, AfterViewInit {

  @ViewChild('pendingEnquiriesGrid')
  pendingEnquiriesGridObject: GridComponent;
  pendingEnquiriesGridMetaData: GridDataInterface;

  @ViewChild('toBeMappedEnquiriesGrid')
  toBeMappedEnquiriesGridObject: GridComponent;
  toBeMappedEnquiriesGridMetaData: GridDataInterface;

  @ViewChild('completedEnquiriesGrid')
  completedEnquiriesGridObject: GridComponent;
  completedEnquiriesGridMetaData: GridDataInterface;

  @ViewChild('abortedEnquiriesGrid')
  abortedEnquiriesGridObject: GridComponent;
  abortedEnquiriesGridMetaData: GridDataInterface;

  showAllEnquiriesData = false;
  selectedAllEnquiriesRecord: GridRecord = null;
  interimHoldSelectedAllEnquiriesRecord: GridRecord = null;
  allEnquiriesDataAccess: AllEnquiriesDataAccess = null;
  selectedRecordGridType: string = null;

  interimHoldSelectedAllEnquiriesObject: GridComponent = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.pendingEnquiriesGridMetaData = null;
    this.completedEnquiriesGridMetaData = null;
    this.abortedEnquiriesGridMetaData = null;   
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.pendingEnquiriesGridObject.init();
      this.toBeMappedEnquiriesGridObject.init();
      this.completedEnquiriesGridObject.init();
      this.abortedEnquiriesGridObject.init();
    }, 0);
    setTimeout(() => {
      this.pendingEnquiriesGridObject.refreshGridData();
      this.toBeMappedEnquiriesGridObject.refreshGridData();
      this.completedEnquiriesGridObject.refreshGridData();
      this.abortedEnquiriesGridObject.refreshGridData();
    }, 0);
  }

  private getSelectionColumnBaseButton() {
    return [{
      id: 'sendEmailTutor',
      label: 'Send Email Tutor',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        const selectedEmailsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'tutorEmail');
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
      id: 'sendEmailCustomer',
      label: 'Send Email Customer',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        const selectedEmailsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'customerEmail');
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
    }];
  }

  public getGridObject(id: string, title: string, restURL: string, customSelectionButtons: any[], collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'customerName',
        headerName: 'Customer Name',
        dataType: 'string',
        mapping: 'customerName',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedAllEnquiriesRecord = record;
          this.selectedRecordGridType = gridComponentObject.grid.id; 
          if (this.allEnquiriesDataAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.pending_enquiry_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedAllEnquiriesRecord = this.interimHoldSelectedAllEnquiriesRecord;            
            this.toggleVisibilityAllEnquiriesGrid();
          }
        }
      }, {
        id: 'customerEmail',
        headerName: 'Customer Email',
        dataType: 'string',
        mapping: 'customerEmail'
      }, {
        id: 'customerContactNumber',
        headerName: 'Customer Contact Number',
        dataType: 'string',
        mapping: 'customerContactNumber'
      }, {
        id: 'subject',
        headerName: 'Subject',
        dataType: 'list',
        filterOptions: CommonFilterOptions.subjectsFilterOptions,
        mapping: 'subject',
        renderer: AdminCommonFunctions.subjectsRenderer
      }, {
        id: 'grade',
        headerName: 'Grade',
        dataType: 'list',
        filterOptions: CommonFilterOptions.studentGradesFilterOptions,
        mapping: 'grade',
        renderer: AdminCommonFunctions.studentGradesRenderer
      }, {
        id: 'preferredTeachingType',
        headerName: 'Preferred Teaching Type',
        dataType: 'list',
        filterOptions: CommonFilterOptions.preferredTeachingTypeFilterOptions,
        mapping: 'preferredTeachingType',
        multiList: true,
        renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
      }, {
        id: 'locationDetails',
        headerName: 'Location Details',
        dataType: 'list',
        filterOptions: CommonFilterOptions.locationsFilterOptions,
        mapping: 'locationDetails',
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
      }, {
        id: 'matchStatus',
        headerName: 'Match Status',
        dataType: 'list',
        filterOptions: CommonFilterOptions.matchStatusFilterOptions,
        mapping: 'matchStatus',
        renderer: AdminCommonFunctions.matchStatusRenderer
      }, {
        id: 'quotedClientRate',
        headerName: 'Quoted Client Rate',
        dataType: 'number',
        mapping: 'quotedClientRate'
      }, {
        id: 'negotiatedRateWithClient',
        headerName: 'Negotiated Rate With Client',
        dataType: 'number',
        mapping: 'negotiatedRateWithClient'
      }, {
        id: 'clientNegotiationRemarks',
        headerName: 'Client Negotiation Remarks',
        dataType: 'string',
        mapping: 'clientNegotiationRemarks',
        lengthyData: true
      }, {
        id: 'adminRemarks',
        headerName: 'Admin Remarks',
        dataType: 'string',
        mapping: 'adminRemarks',
        lengthyData: true
      }, {
        id: 'isMapped',
        headerName: 'Is Mapped',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isMapped',
        renderer: GridCommonFunctions.yesNoRenderer
      }, {
        id: 'tutorName',
        headerName: 'Tutor Name',
        dataType: 'string',
        mapping: 'tutorName'
      }, {
        id: 'tutorEmail',
        headerName: 'Tutor Email',
        dataType: 'string',
        mapping: 'tutorEmail'
      }, {
        id: 'tutorContactNumber',
        headerName: 'Tutor Contact Number',
        dataType: 'string',
        mapping: 'tutorContactNumber'
      }],
      hasSelectionColumn: true,
      selectionColumn: {
        buttons: this.getSelectionColumnBaseButton().concat(customSelectionButtons)
      }
    }
    return grid;
  }

  private getCustomButton (
      id:string, 
      label: string, 
      btnclass: string = 'btnSubmit', 
      actionText: string, 
      commentsRequired: boolean = false,
      titleText: string,
      placeholderText: string
  ) {
    return {
      id: id,
      label: label,
      btnclass: btnclass,
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        this.interimHoldSelectedAllEnquiriesObject = gridComponentObject;
        const enquiryIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'enquiryId');
        if (enquiryIdsList.length === 0) {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: LcpConstants.grid_generic_no_record_selected_error,
            onButtonClicked: () => {
            }
          });
        } else {
          this.helperService.showPromptDialog({
            required: commentsRequired,
            titleText: titleText,
            placeholderText: placeholderText,
            onOk: (message) => {                  
              const data = {
                allIdsList: enquiryIdsList.join(';'),
                button: actionText,
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.take_action_on_enquiry, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded');
            },
            onCancel: () => {
            }
          });
        }
      }
    };
  }

  public setUpGridMetaData() {
    let toBeMapped = this.getCustomButton('toBeMapped', 'To Be Mapped', 'btnSubmit', 'toBeMapped', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let aborted = this.getCustomButton('aborted', 'Aborted', 'btnReject', 'aborted', true, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let pending = this.getCustomButton('pending', 'Pending', 'btnReset', 'pending', true, 'Enter comments for action', 'Please provide your comments for taking the action.');

    this.pendingEnquiriesGridMetaData = {
      grid: this.getGridObject('pendingEnquiriesGrid', 'Pending Enquiries', '/rest/sales/pendingEnquiriesList', [toBeMapped, aborted]),
      htmlDomElementId: 'pending-enquiries-grid',
      hidden: false
    };

    this.toBeMappedEnquiriesGridMetaData = {
      grid: this.getGridObject('toBeMappedEnquiriesGrid', 'To Be Mapped Enquiries', '/rest/sales/toBeMappedEnquiriesGridList', [pending, aborted], true),
      htmlDomElementId: 'to-be-mapped-enquiries-grid',
      hidden: false
    };

    this.completedEnquiriesGridMetaData = {
      grid: this.getGridObject('completedEnquiriesGrid', 'Completed Enquiries', '/rest/sales/completedEnquiriesList', [], true),
      htmlDomElementId: 'completed-enquiries-grid',
      hidden: false
    };

    this.abortedEnquiriesGridMetaData = {
      grid: this.getGridObject('abortedEnquiriesGrid', 'Aborted Enquiries', '/rest/sales/abortedEnquiriesList', [pending], true),
      htmlDomElementId: 'aborted-enquiries-grid',
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
      context.allEnquiriesDataAccess = {
        success: response.success,
        message: response.message,
        allEnquiriesDataModificationAccess: response.allEnquiriesDataModificationAccess
      };
      context.selectedAllEnquiriesRecord = context.interimHoldSelectedAllEnquiriesRecord;
      context.toggleVisibilityAllEnquiriesGrid();
    }
  }

  handleSelectionActionRequest(context: any, response: any) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      context.interimHoldSelectedAllEnquiriesObject.refreshGridData();
    }
  }

  toggleVisibilityAllEnquiriesGrid() {
    if (this.showAllEnquiriesData === true) {
      this.showAllEnquiriesData = false;
      this.selectedAllEnquiriesRecord = null;
      setTimeout(() => {
        this.pendingEnquiriesGridObject.init();
        this.toBeMappedEnquiriesGridObject.init();
        this.completedEnquiriesGridObject.init();
        this.abortedEnquiriesGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.pendingEnquiriesGridObject.refreshGridData();
        this.toBeMappedEnquiriesGridObject.refreshGridData();
        this.completedEnquiriesGridObject.refreshGridData();
        this.abortedEnquiriesGridObject.refreshGridData();
      }, 200);
    } else {
      this.showAllEnquiriesData = true;
    }
  }

}

export interface AllEnquiriesDataAccess {
  success: boolean;
  message: string;
  allEnquiriesDataModificationAccess: boolean;
}
