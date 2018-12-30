import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { Column } from 'src/app/utils/grid/column';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';

@Component({
  selector: 'app-map-tutor-to-enquiry',
  templateUrl: './map-tutor-to-enquiry.component.html',
  styleUrls: ['./map-tutor-to-enquiry.component.css']
})
export class MapTutorToEnquiryComponent implements OnInit, AfterViewInit {

  @ViewChild('toBeMappedEnquiriesGrid')
  toBeMappedEnquiriesGridObject: GridComponent;
  toBeMappedEnquiriesGridMetaData: GridDataInterface;

  showMapTutorToEnquiryData = false;
  selectedEnquiryRecord: GridRecord = null;
  interimHoldSelectedEnquiryRecord: GridRecord = null;
  enquiryMappingDataAccess: EnquiryMappingDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.toBeMappedEnquiriesGridMetaData = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.toBeMappedEnquiriesGridObject.init();
    }, 0);
    setTimeout(() => {
      this.toBeMappedEnquiriesGridObject.refreshGridData();
    }, 0);
  }

  public getGridObject(id: string, title: string, restURL: string) {
    let grid = {
      id: id,
      title: title,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'customerName',
        headerName: 'Customer Name',
        dataType: 'string',
        mapping: 'customerName',
        clickEvent: (record: GridRecord, column: Column) => {
          this.interimHoldSelectedEnquiryRecord = record;
          if (this.enquiryMappingDataAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.map_tutor_to_enquiry_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedEnquiryRecord = this.interimHoldSelectedEnquiryRecord;            
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
        id: 'matchStatus',
        headerName: 'Match Status',
        dataType: 'list',
        filterOptions: CommonFilterOptions.matchStatusFilterOptions,
        mapping: 'matchStatus',
        renderer: AdminCommonFunctions.matchStatusRenderer
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
        buttons: [{
          id: 'sendEmailCustomer',
          label: 'Send Email Customer',
          clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
            // Refer document
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
        }]
      }
    }
    return grid;
  }

  public setUpGridMetaData() {
    this.toBeMappedEnquiriesGridMetaData = {
      grid: this.getGridObject('toBeMappedEnquiriesGrid', 'To Be Mapped Enquiries', '/rest/sales/toBeMappedEnquiriesGridList'),
      htmlDomElementId: 'to-be-mapped-enquiries-grid',
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
      context.enquiryMappingDataAccess = {
        success: response.success,
        message: response.message,
        enquiryMappingAccess: response.enquiryMappingAccess
      };
      context.selectedEnquiryRecord = context.interimHoldSelectedEnquiryRecord;
      context.toggleVisibilityAllEnquiriesGrid();
    }
  }

  toggleVisibilityAllEnquiriesGrid() {
    if (this.showMapTutorToEnquiryData === true) {
      this.showMapTutorToEnquiryData = false;
      this.selectedEnquiryRecord = null;
      setTimeout(() => {
        this.toBeMappedEnquiriesGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.toBeMappedEnquiriesGridObject.refreshGridData();
      }, 200);
    } else {
      this.showMapTutorToEnquiryData = true;
    }
  }

}

export interface EnquiryMappingDataAccess {
  success: boolean;
  message: string;
  enquiryMappingAccess: boolean;
}
