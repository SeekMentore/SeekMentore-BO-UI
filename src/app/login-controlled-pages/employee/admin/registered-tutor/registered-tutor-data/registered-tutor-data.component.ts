import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataInterface } from 'src/app/login-controlled-pages/grid/grid.component';
import { Record } from 'src/app/login-controlled-pages/grid/record';
import { Column } from 'src/app/login-controlled-pages/grid/column';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
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

  constructor() { 
    this.uploadedDocumentGridMetaData = null;
    this.bankDetailGridMetaData = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.uploadedDocumentGridObject.init();
      this.bankDetailGridObject.init();      
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
        hasActionColumn : true,
        actionColumn : {
          label : 'Take Action',
          buttons : [{
            id : 'approve',
            label : 'Approve',
            clickEvent : function(record : Record, button :ActionButton) {
              
            }
          }, {
            id : 'sendReminder',
            label : 'Send Reminder',
            clickEvent : function(record : Record, button :ActionButton) {
              
            }
          }, {
            id : 'reject',
            label : 'Reject',
            clickEvent : function(record : Record, button :ActionButton) {
             
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
        hasActionColumn : true,
          actionColumn : {
            label : 'Take Action',
            buttons : [{
              id : 'approve',
              label : 'Approve',
              clickEvent : function(record, button) {
                
              }
            }, {
              id : 'makeDefault',
              label : 'Make Default',
              clickEvent : function(record, button) {
                
              }
            }, {
              id : 'reject',
              label : 'Reject',
              clickEvent : function(record, button) {
                
              }
            }]
          }
      },
      htmlDomElementId: 'uploaded-document-grid',
      hidden: false
    };
  }

}
