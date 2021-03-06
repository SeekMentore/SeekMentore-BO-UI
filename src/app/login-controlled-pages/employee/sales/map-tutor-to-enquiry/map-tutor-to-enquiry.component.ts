import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { EnquiryDataAccess } from '../all-enquiries/all-enquiries.component';

@Component({
  selector: 'app-map-tutor-to-enquiry',
  templateUrl: './map-tutor-to-enquiry.component.html',
  styleUrls: ['./map-tutor-to-enquiry.component.css']
})
export class MapTutorToEnquiryComponent implements OnInit, AfterViewInit {

  @ViewChild('toBeMappedEnquiryGrid')
  toBeMappedEnquiryGridObject: GridComponent;
  toBeMappedEnquiryGridMetaData: GridDataInterface;

  showMapTutorToEnquiryData = false;
  selectedEnquirySerialId: string = null;
  interimHoldSelectedEnquirySerialId: string = null;
  enquiryDataAccess: EnquiryDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) { 
    this.toBeMappedEnquiryGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
    this.helperService.setBreadCrumb({
      newCrumbList: ApplicationBreadCrumbConfig.getBreadCrumbList(this.router.routerState.snapshot.url),    
      resetCrumbList: true
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.toBeMappedEnquiryGridObject.init();
    }, 0);
    setTimeout(() => {
      this.toBeMappedEnquiryGridObject.refreshGridData();
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
        id: 'enquirySerialId',
        headerName: 'Enquiry Serial Id',
        dataType: 'string',
        mapping: 'enquirySerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedEnquirySerialId = column.getValueForColumn(record);
          if (this.enquiryDataAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.enquiry_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedEnquirySerialId = this.interimHoldSelectedEnquirySerialId ;            
            this.toggleVisibilityEnquiryGrid();
          }
        }
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
      }, {
        id: 'matchStatus',
        headerName: 'Match Status',
        dataType: 'list',
        filterOptions: CommonFilterOptions.matchStatusFilterOptions,
        mapping: 'matchStatus',
        renderer: AdminCommonFunctions.matchStatusRenderer
      }, {
        id: 'customerSerialId',
        headerName: 'Customer Serial Id',
        dataType: 'string',
        mapping: 'customerSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Customer Section ' + column.getValueForColumn(record));
        }
      }, {
        id: 'customerName',
        headerName: 'Customer Name',
        dataType: 'string',
        mapping: 'customerName'
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
        id: 'tutorSerialId',
        headerName: 'Tutor Serial Id',
        dataType: 'string',
        mapping: 'tutorSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Tutor Section ' + column.getValueForColumn(record));
        }
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
      hasSelectionColumn: false      
    }
    return grid;
  }

  public setUpGridMetaData() {
    this.toBeMappedEnquiryGridMetaData = {
      grid: this.getGridObject('toBeMappedEnquiryGrid', 'To Be Mapped Enquiries', '/rest/sales/toBeMappedEnquiryGridList'),
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
      context.enquiryDataAccess = {
        success: response.success,
        message: response.message,
        enquiryDataModificationAccess: response.enquiryDataModificationAccess,
        enquiryTutorMappingAccess: response.enquiryTutorMappingAccess
      };
      context.selectedEnquirySerialId = context.interimHoldSelectedEnquirySerialId;
      context.toggleVisibilityEnquiryGrid();
    }
  }

  toggleVisibilityEnquiryGrid() {
    if (this.showMapTutorToEnquiryData === true) {
      this.showMapTutorToEnquiryData = false;
      this.selectedEnquirySerialId = null;
      setTimeout(() => {
        this.toBeMappedEnquiryGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.toBeMappedEnquiryGridObject.refreshGridData();
      }, 200);
    } else {
      this.showMapTutorToEnquiryData = true;
    }
  }
}