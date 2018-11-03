import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AllEnquiriesDataAccess } from '../all-enquiries.component';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { Column } from 'src/app/utils/grid/column';

@Component({
  selector: 'app-enquiries-data',
  templateUrl: './enquiries-data.component.html',
  styleUrls: ['./enquiries-data.component.css']
})
export class EnquiriesDataComponent implements OnInit, AfterViewInit {

  @ViewChild('currentCustomerAllPendingEnquiriesGrid')
  currentCustomerAllPendingEnquiriesGridObject: GridComponent;
  currentCustomerAllPendingEnquiriesGridMetaData: GridDataInterface;

  @Input()
  enquiriesRecord: GridRecord = null;

  @Input()
  allEnquiriesDataAccess: AllEnquiriesDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.currentCustomerAllPendingEnquiriesGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.allEnquiriesDataAccess.allEnquiriesDataModificationAccess) {
        this.currentCustomerAllPendingEnquiriesGridObject.init();
        this.currentCustomerAllPendingEnquiriesGridObject.addExtraParams('tutorId', this.enquiriesRecord.getProperty('customerId'));
      }
    }, 0);

    setTimeout(() => {
      if (this.allEnquiriesDataAccess.allEnquiriesDataModificationAccess) {
        this.currentCustomerAllPendingEnquiriesGridObject.refreshGridData();
      }
    }, 0);
  }

  public setUpGridMetaData() {
    this.currentCustomerAllPendingEnquiriesGridMetaData = {
      grid: {
        id: 'uploadedDocumentGrid',
        title: 'Uploaded Documents',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/uploadedDocuments'
        },
        columns: [{
          id: 'subject',
          headerName: 'Subject',
          dataType: 'list',
          filterOptions: CommonFilterOptions.subjectsFilterOptions,
          mapping: 'subject',
          renderer: AdminCommonFunctions.subjectsRenderer,
          clickEvent: (record: GridRecord, column: Column) => {
            // Load this enquiry
          }
        }, {
          id: 'grade',
          headerName: 'Grade',
          dataType: 'list',
          filterOptions: CommonFilterOptions.complaintStatusFilterOptions,
          mapping: 'grade',
          renderer: AdminCommonFunctions.studentGradesRenderer
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
          id: 'isMapped',
          headerName: 'Is Mapped',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isMapped',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'matchStatus',
          headerName: 'Match Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.matchStatusFilterOptions,
          mapping: 'matchStatus'
        }, {
          id: 'adminRemarks',
          headerName: 'Admin Remarks',
          dataType: 'string',
          mapping: 'adminRemarks',
          lengthyData: true
        }, {
          id: 'locationDetails',
          headerName: 'Location Details',
          dataType: 'string',
          mapping: 'locationDetails',
          lengthyData: true
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
          id: 'preferredTeachingType',
          headerName: 'Preferred Teaching Type',
          dataType: 'list',
          filterOptions: CommonFilterOptions.preferredTeachingTypeFilterOptions,
          mapping: 'preferredTeachingType',
          renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
        }]
      },
      htmlDomElementId: 'uploaded-document-grid',
      hidden: false,
    };
  }

}
