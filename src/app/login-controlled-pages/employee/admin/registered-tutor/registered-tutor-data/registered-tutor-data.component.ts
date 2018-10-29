import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {GridComponent, GridDataInterface} from 'src/app/login-controlled-pages/grid/grid.component';
import {GridRecord} from 'src/app/login-controlled-pages/grid/grid-record';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {GridCommonFunctions} from 'src/app/login-controlled-pages/grid/grid-common-functions';
import {ActionButton} from 'src/app/login-controlled-pages/grid/action-button';
import {RegisterTutorDataAccess} from 'src/app/login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';
import {LcpConstants} from "src/app/utils/lcp-constants";
import {LcpRestUrls} from "src/app/utils/lcp-rest-urls";
import {HelperService} from "src/app/utils/helper.service";
import {AppUtilityService} from "src/app/utils/app-utility.service";

@Component({
  selector: 'app-registered-tutor-data',
  templateUrl: './registered-tutor-data.component.html',
  styleUrls: ['./registered-tutor-data.component.css']
})
export class RegisteredTutorDataComponent implements OnInit, AfterViewInit {

  @ViewChild('uploadedDocumentGrid')
  uploadedDocumentGridObject: GridComponent;
  uploadedDocumentGridMetaData: GridDataInterface;

  @ViewChild('bankDetailGrid')
  bankDetailGridObject: GridComponent;
  bankDetailGridMetaData: GridDataInterface;

  @ViewChild('currentPackagesGrid')
  currentPackagesGridObject: GridComponent;
  currentPackagesGridMetaData: GridDataInterface;

  @ViewChild('historyPackagesGrid')
  historyPackagesGridObject: GridComponent;
  historyPackagesGridMetaData: GridDataInterface;

  @Input()
  tutorRecord: GridRecord = null;

  @Input()
  tutorDataAccess: RegisterTutorDataAccess = null;

  renderTutorRecordForm = false;
  editRecordForm = false;

  tutorUpdatedData = {};


  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.uploadedDocumentGridMetaData = null;
    this.bankDetailGridMetaData = null;
    this.currentPackagesGridMetaData = null;
    this.historyPackagesGridMetaData = null;
    this.tutorUpdatedData = {};

    // console.log('selected tutor record', this.tutorRecord, this.tutorDataAccess);


  }

  ngOnInit() {
    // console.log('selected tutor record', this.tutorRecord, this.tutorDataAccess);
    this.setUpGridMetaData();
    // alert('A'+JSON.stringify(this.tutorDataAccess))
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // we might get error because grid extra params are being set after initialisation
      if( this.tutorDataAccess.documentViewAccess ) {
        this.uploadedDocumentGridObject.init();
        this.uploadedDocumentGridObject.addExtraParams('tutorId', this.tutorRecord.getProperty('tutorId'));

      }
      if( this.tutorDataAccess.bankViewAccess ) {
        this.bankDetailGridObject.init();
        this.bankDetailGridObject.addExtraParams('tutorId', this.tutorRecord.getProperty('tutorId'));
      }

      this.renderTutorRecordForm = true;

      if( this.tutorDataAccess.activePackageViewAccess ) {
        this.currentPackagesGridObject.init();
        this.currentPackagesGridObject.addExtraParams('tutorId', this.tutorRecord.getProperty('tutorId'));
      }

      if( this.tutorDataAccess.historyPackagesViewAccess ) {
        this.historyPackagesGridObject.init();
        this.historyPackagesGridObject.addExtraParams('tutorId', this.tutorRecord.getProperty('tutorId'));
      }

    }, 0);

    setTimeout(() => {
      if( this.tutorDataAccess.documentViewAccess ) {
        this.uploadedDocumentGridObject.refreshGridData();
      }
      if( this.tutorDataAccess.bankViewAccess ) {
        this.bankDetailGridObject.refreshGridData();
      }
      if( this.tutorDataAccess.activePackageViewAccess ) {
        this.currentPackagesGridObject.refreshGridData();
      }
      if( this.tutorDataAccess.historyPackagesViewAccess) {
        this.historyPackagesGridObject.refreshGridData();
      }

    }, 0);

  }

  public setUpGridMetaData() {
    this.uploadedDocumentGridMetaData = {
      grid: {
        id: 'uploadedDocumentGrid',
        title: 'Uploaded Documents',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/uploadedDocuments'
        },
        columns: [{
          id: 'filename',
          headerName: 'Filename',
          dataType: 'string',
          mapping: 'filename'
        }, {
          id: 'isApproved',
          headerName: 'Is Approved',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isApproved',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'whoActed',
          headerName: 'Who Acted',
          dataType: 'string',
          mapping: 'whoActed'
        }, {
          id: 'remarks',
          headerName: 'Remarks',
          dataType: 'string',
          mapping: 'remarks'
        }, {
          id: 'actionDate',
          headerName: 'Action Date',
          dataType: 'date',
          mapping: 'actionDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        }],
        hasSelectionColumn: this.tutorDataAccess.documentHandleAccess,
        selectionColumn: {
          buttons: [{
            id: 'approveMultiple',
            label: 'Approve',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_approve_multiple, selectedRecords,
                'documentId', 'documentIds', this.uploadedDocumentGridObject);
            }
          }, {
            id: 'sendReminderMultiple',
            label: 'Send Reminder',
            btnclass: 'btnReset',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_reminder_multiple, selectedRecords,
                'documentId', 'documentIds', this.uploadedDocumentGridObject);
            }
          }, {
            id: 'rejectMultiple',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_reject_multiple, selectedRecords,
                'documentId', 'documentIds', this.uploadedDocumentGridObject);
            }
          }]
        },
        hasActionColumn: true,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'approve',
            label: 'Approve',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              // Refer document
            }
          }, {
            id: 'sendReminder',
            label: 'Send Reminder',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              // Refer document
            }
          }, {
            id: 'reject',
            label: 'Reject',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              // Refer document
            }
          }]
        }
      },
      htmlDomElementId: 'uploaded-document-grid',
      hidden: false,
    };

    this.bankDetailGridMetaData = {
      grid: {
        id: 'bankDetailGrid',
        title: 'Bank Details',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/bankDetails'
        },
        columns: [{
          id: 'bankName',
          headerName: 'Bank Name',
          dataType: 'string',
          mapping: 'bankName'
        }, {
          id: 'accountNumber',
          headerName: 'Account Number',
          dataType: 'string',
          mapping: 'accountNumber'
        }, {
          id: 'ifscCode',
          headerName: 'IFSC Code',
          dataType: 'string',
          mapping: 'ifscCode'
        },{
          id: 'accountHolderName',
          headerName: 'Account Holder Name',
          dataType: 'string',
          mapping: 'accountHolderName'
        }, {
          id: 'isDefault',
          headerName: 'Is Default',
          dataType: 'list',
		      filterOptions : CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isDefault',
          renderer: GridCommonFunctions.yesNoRenderer
        }],
        hasSelectionColumn : (this.tutorDataAccess.bankViewAccess && this.tutorDataAccess.bankHandleAccess),
        selectionColumn : {
          buttons : [{
            id : 'approveMultiple',
            label : 'Approve',
            clickEvent : (selectedRecords: GridRecord[], button :ActionButton) => {
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_bank_grid_approve_multiple, selectedRecords,
                'bankAccountId', 'bankAccountIds', this.bankDetailGridObject);

            }
          }, {
            id : 'rejectMultiple',
            label : 'Reject',
            btnclass : 'btnReject',
            clickEvent : (selectedRecords: GridRecord[], button :ActionButton) => {
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_bank_grid_reject_multiple, selectedRecords,
                'bankAccountId', 'bankAccountIds', this.bankDetailGridObject);
            }
          }]
        },
        hasActionColumn : true,
          actionColumn : {
            label : 'Take Action',
            buttons : [{
              id : 'approve',
              label : 'Approve',
              clickEvent : function(record : GridRecord, button :ActionButton) {
                // Refer document
              }
            }, {
              id : 'makeDefault',
              label : 'Make Default',
              clickEvent : function(record : GridRecord, button :ActionButton) {
                // Refer document
              }
            }, {
              id : 'reject',
              label : 'Reject',
              clickEvent : function(record : GridRecord, button :ActionButton) {
                // Refer document
              }
            }]
          }
      },
      htmlDomElementId: 'bank-detail-grid',
      hidden: false,
    };

    // console.log(this.tutorDataAccess, (this.tutorDataAccess.bankViewAccess && this.tutorDataAccess.bankHandleAccess),this.bankDetailGridMetaData);

    this.currentPackagesGridMetaData = {
      grid: {
        id: 'currentPackagesGrid',
        title: 'Current Packages',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/currentPackages'
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
          restURL: '/rest/registeredTutor/historyPackages'
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


  makeRestCallForGridOperation(url: string, selectedRecords: GridRecord[], property: string, paramKey: string, gridComponent: GridComponent) {
    const selectedIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, property);

    if (selectedIdsList.length === 0) {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: LcpConstants.grid_generic_no_record_selected_error,
        onButtonClicked: () => {

        }
      });
    } else {
      const data = {
        paramKey: selectedIdsList.join(';')
      };
      this.utilityService.makeRequestWithoutResponseHandler(url, 'POST', this.utilityService.urlEncodeData(data),
        'application/x-www-form-urlencoded').subscribe(result => {

        let response = result['response'];
        response = this.utilityService.decodeObjectFromJSON(response);
        if (response != null) {
          if (response['success'] === false) {
            this.helperService.showAlertDialog({
              isSuccess: response['success'],
              message: response['message'],
              onButtonClicked: () => {

              }
            });
          } else {
            gridComponent.refreshGridData();
          }
        }
      }, error2 => {
      });
    }
  }

  getPropertiesToBeDisaplyedInForm() {
    return Object.keys(this.tutorRecord.property);
  }

  updateTutorProperty(key: string, value: string) {
    this.tutorUpdatedData[key] = value;
    // console.log(this.tutorUpdatedData);
  }

  updateTutorRecord() {
    this.utilityService.makerequest(this, this.onUpdateTutorRecord, LcpRestUrls.tutor_update_record, 'POST',
      this.utilityService.urlEncodeData(this.tutorUpdatedData), 'application/x-www-form-urlencoded');
  }

  onUpdateTutorRecord(context: any, data: any) {
    if(data['success'] === true) {

    }else {

    }
  }


}
