import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataInterface } from 'src/app/login-controlled-pages/grid/grid.component';
import { Record } from 'src/app/login-controlled-pages/grid/record';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { GridCommonFunctions } from 'src/app/login-controlled-pages/grid/grid-common-functions';
import { ActionButton } from 'src/app/login-controlled-pages/grid/action-button';

@Component({
  selector: 'app-registered-tutor-data',
  templateUrl: './registered-tutor-data.component.html',
  styleUrls: ['./registered-tutor-data.component.css']
})
export class RegisteredTutorDataComponent implements OnInit {

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

  constructor() { 
    this.uploadedDocumentGridMetaData = null;
    this.bankDetailGridMetaData = null;
    this.currentPackagesGridMetaData = null;
    this.historyPackagesGridMetaData = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.uploadedDocumentGridObject.init();
      this.bankDetailGridObject.init();     
      this.currentPackagesGridObject.init();   
      this.historyPackagesGridObject.init();    
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
                filterOptions : CommonFilterOptions.yesNoFilterOptions,
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
        hasSelectionColumn : true,
        selectionColumn : {
          buttons : [{
            id : 'approveMultiple',
            label : 'Approve',
            clickEvent : function(selectedRecords: Record[], button :ActionButton) {
              // Refer document
            }
          }, {
            id : 'sendReminderMultiple',
            label : 'Send Reminder',
            btnclass : 'btnReset',
            clickEvent : function(selectedRecords: Record[], button :ActionButton) {
              // Refer document
            }
          }, {
            id : 'rejectMultiple',
            label : 'Reject',
            btnclass : 'btnReject',
            clickEvent : function(selectedRecords: Record[], button :ActionButton) {
              // Refer document
            }
          }]
        },
        hasActionColumn : true,
        actionColumn : {
          label : 'Take Action',
          buttons : [{
            id : 'approve',
            label : 'Approve',
            clickEvent : function(record : Record, button :ActionButton) {
              // Refer document
            }
          }, {
            id : 'sendReminder',
            label : 'Send Reminder',
            clickEvent : function(record : Record, button :ActionButton) {
              // Refer document
            }
          }, {
            id : 'reject',
            label : 'Reject',
            clickEvent : function(record : Record, button :ActionButton) {
             // Refer document
            }
          }]
        }
      },
      htmlDomElementId: 'uploaded-document-grid',
      hidden: false
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
        hasSelectionColumn : true,
        selectionColumn : {
          buttons : [{
            id : 'approveMultiple',
            label : 'Approve',
            clickEvent : function(selectedRecords: Record[], button :ActionButton) {
              // Refer document
            }
          }, {
            id : 'rejectMultiple',
            label : 'Reject',
            btnclass : 'btnReject',
            clickEvent : function(selectedRecords: Record[], button :ActionButton) {
              // Refer document
            }
          }]
        },
        hasActionColumn : true,
          actionColumn : {
            label : 'Take Action',
            buttons : [{
              id : 'approve',
              label : 'Approve',
              clickEvent : function(record : Record, button :ActionButton) {
                // Refer document
              }
            }, {
              id : 'makeDefault',
              label : 'Make Default',
              clickEvent : function(record : Record, button :ActionButton) {
                // Refer document
              }
            }, {
              id : 'reject',
              label : 'Reject',
              clickEvent : function(record : Record, button :ActionButton) {
                // Refer document
              }
            }]
          }
      },
      htmlDomElementId: 'bank-detail-grid',
      hidden: false
    };

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
      hidden: false
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

}
