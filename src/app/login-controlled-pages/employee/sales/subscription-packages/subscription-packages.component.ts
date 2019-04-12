import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-subscription-packages',
  templateUrl: './subscription-packages.component.html',
  styleUrls: ['./subscription-packages.component.css']
})
export class SubscriptionPackagesComponent implements OnInit {

  @ViewChild('currentSubscriptionPackagesGrid')
  currentSubscriptionPackagesGridObject: GridComponent;
  currentSubscriptionPackagesGridMetaData: GridDataInterface;

  @ViewChild('historySubscriptionPackagesGrid')
  historySubscriptionPackagesGridObject: GridComponent;
  historySubscriptionPackagesGridMetaData: GridDataInterface;

  showSubscriptionPackagesData = false;
  selectedSubscriptionPackageSerialId: string = null;
  interimHoldSelectedSubscriptionPackageSerialId: string = null;
  subscriptionPackageDataAccess: SubscriptionPackageDataAccess = null;

  interimHoldSelectedSubscriptionPackageGridObject: GridComponent = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) { 
    this.currentSubscriptionPackagesGridMetaData = null;
    this.historySubscriptionPackagesGridMetaData = null;
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
      this.currentSubscriptionPackagesGridObject.init();
      this.historySubscriptionPackagesGridObject.init();
    }, 100);
    setTimeout(() => {
      this.currentSubscriptionPackagesGridObject.refreshGridData();
      this.historySubscriptionPackagesGridObject.refreshGridData();
    }, 100);
  }

  expandAllGrids() {
    this.currentSubscriptionPackagesGridObject.expandGrid();
    this.historySubscriptionPackagesGridObject.expandGrid();
  }

  collapseAllGrids() {
    this.currentSubscriptionPackagesGridObject.collapseGrid();
    this.historySubscriptionPackagesGridObject.collapseGrid();
  }

  public getSubscriptionPackageGridObject(id: string, title: string, restURL: string, collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'subscriptionPackageSerialId',
        headerName: 'Subscription Package Serial Id',
        dataType: 'string',
        mapping: 'subscriptionPackageSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedSubscriptionPackageSerialId = record.getProperty('subscriptionPackageSerialId');
          if (this.subscriptionPackageDataAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.subscription_package_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedSubscriptionPackageSerialId = this.interimHoldSelectedSubscriptionPackageSerialId;            
            this.toggleVisibilitySubscriptionPackagesGrid();
          }
        }
      },{
        id: 'createdMillis',
        headerName: 'Created Date',
        dataType: 'date',
        mapping: 'createdMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      },{
        id: 'startDateMillis',
        headerName: 'Start Date',
        dataType: 'date',
        mapping: 'startDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
      },{
        id: 'endDateMillis',
        headerName: 'End Date',
        dataType: 'date',
        mapping: 'endDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
      },{
        id: 'customerSerialId',
        headerName: 'Customer Serial Id',
        dataType: 'string',
        mapping: 'customerSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Customer Record > ' + column.getValueForColumn(record));
        }
      },{
        id: 'customerName',
        headerName: 'Customer Name',
        dataType: 'string',
        mapping: 'customerName'
      },{
        id: 'customerEmail',
        headerName: 'Customer Primary Email',
        dataType: 'string',
        mapping: 'customerEmail'
      },{
        id: 'customerContactNumber',
        headerName: 'Customer Primary Contact Number',
        dataType: 'string',
        mapping: 'customerContactNumber'
      },{
        id: 'tutorSerialId',
        headerName: 'Tutor Serial Id',
        dataType: 'string',
        mapping: 'tutorSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Tutor Record > ' + column.getValueForColumn(record));
        }
      },{
        id: 'tutorName',
        headerName: 'Tutor Name',
        dataType: 'string',
        mapping: 'tutorName'
      },{
        id: 'tutorEmail',
        headerName: 'Tutor Primary Email',
        dataType: 'string',
        mapping: 'tutorEmail'
      },{
        id: 'tutorContactNumber',
        headerName: 'Tutor Primary Contact Number',
        dataType: 'string',
        mapping: 'tutorContactNumber'
      },{
        id: 'enquirySerialId',
        headerName: 'Enquiry Serial Id',
        dataType: 'string',
        mapping: 'enquirySerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Enquiry Record > ' + column.getValueForColumn(record));
        }
      },{
        id: 'enquirySubject',
        headerName: 'Enquiry Subject',
        dataType: 'list',
        filterOptions: CommonFilterOptions.subjectsFilterOptions,
        mapping: 'enquirySubject',
        renderer: AdminCommonFunctions.subjectsRenderer
      },{
        id: 'enquiryGrade',
        headerName: 'Enquiry Grade',
        dataType: 'list',
        filterOptions: CommonFilterOptions.studentGradesFilterOptions,
        mapping: 'enquiryGrade',
        renderer: AdminCommonFunctions.studentGradesRenderer
      },{
        id: 'enquiryEmail',
        headerName: 'Enquiry Email',
        dataType: 'string',
        mapping: 'enquiryEmail'
      },{
        id: 'enquiryContactNumber',
        headerName: 'Enquiry Contact Number',
        dataType: 'string',
        mapping: 'enquiryContactNumber'
      },{
        id: 'enquiryLocation',
        headerName: 'Enquiry Location',
        dataType: 'list',
        filterOptions: CommonFilterOptions.locationsFilterOptions,
        mapping: 'enquiryLocation',
        renderer: AdminCommonFunctions.locationsRenderer
      },{
        id: 'enquiryAddressDetails',
        headerName: 'Enquiry Address Details',
        dataType: 'string',
        mapping: 'enquiryAddressDetails',
        lengthyData: true
      },{
        id: 'enquiryAdditionalDetails',
        headerName: 'Enquiry Additional Details',
        dataType: 'string',
        mapping: 'enquiryAdditionalDetails',
        lengthyData: true
      },{
        id: 'enquiryPreferredTeachingType',
        headerName: 'Enquiry Preferred Teaching Type',
        dataType: 'list',
        filterOptions: CommonFilterOptions.preferredTeachingTypeFilterOptions,
        mapping: 'enquiryPreferredTeachingType',
        multiList: true,
        renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
      },{
        id: 'enquiryQuotedClientRate',
        headerName: 'Enquiry Quoted Client Rate',
        dataType: 'number',
        mapping: 'enquiryQuotedClientRate'
      },{
        id: 'enquiryNegotiatedRateWithClient',
        headerName: 'Enquiry Negotiated Rate With Client',
        dataType: 'number',
        mapping: 'enquiryNegotiatedRateWithClient'
      },{
        id: 'enquiryClientNegotiationRemarks',
        headerName: 'Enquiry Client Negotiation Remarks',
        dataType: 'string',
        mapping: 'enquiryClientNegotiationRemarks',
        lengthyData: true
      },{
        id: 'tutorMapperSerialId',
        headerName: 'Tutor Mapper Serial Id',
        dataType: 'string',
        mapping: 'tutorMapperSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Tutor Mapper Record > ' + column.getValueForColumn(record));
        }
      },{
        id: 'tutorMapperQuotedTutorRate',
        headerName: 'Tutor Mapper Quoted Tutor Rate',
        dataType: 'number',
        mapping: 'tutorMapperQuotedTutorRate'
      },{
        id: 'tutorMapperNegotiatedRateWithTutor',
        headerName: 'Tutor Mapper Negotiated Rate With Tutor',
        dataType: 'number',
        mapping: 'tutorMapperNegotiatedRateWithTutor'
      },{
        id: 'tutorMapperTutorNegotiationRemarks',
        headerName: 'Tutor Mapper Tutor Negotiation Remarks',
        dataType: 'string',
        mapping: 'tutorMapperTutorNegotiationRemarks',
        lengthyData: true
      },{
        id: 'demoSerialId',
        headerName: 'Demo Serial Id',
        dataType: 'string',
        mapping: 'demoSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          alert('Open Demo Record > ' + column.getValueForColumn(record));
        }
      },{
        id: 'demoClientRemarks',
        headerName: 'Demo Client Remarks',
        dataType: 'string',
        mapping: 'demoClientRemarks',
        lengthyData: true
      },{
        id: 'demoTutorRemarks',
        headerName: 'Demo Tutor Remarks',
        dataType: 'string',
        mapping: 'demoTutorRemarks',
        lengthyData: true
      },{
        id: 'demoClientSatisfiedFromTutor',
        headerName: 'Demo Client Satisfied From Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoClientSatisfiedFromTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoTutorSatisfiedWithClient',
        headerName: 'Demo Tutor Satisfied With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoTutorSatisfiedWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoAdminSatisfiedFromTutor',
        headerName: 'Demo Admin Satisfied From Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoAdminSatisfiedFromTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoAdminSatisfiedWithClient',
        headerName: 'Demo Admin Satisfied With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoAdminSatisfiedWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoNeedPriceNegotiationWithClient',
        headerName: 'Demo Need Price Negotiation With Client',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoNeedPriceNegotiationWithClient',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoNegotiatedOverrideRateWithClient',
        headerName: 'Demo Negotiated Override Rate With Client',
        dataType: 'number',
        mapping: 'demoNegotiatedOverrideRateWithClient'
      },{
        id: 'demoClientNegotiationRemarks',
        headerName: 'Demo Client Negotiation Remarks',
        dataType: 'string',
        mapping: 'demoClientNegotiationRemarks',
        lengthyData: true
      },{
        id: 'demoNeedPriceNegotiationWithTutor',
        headerName: 'Demo Need Price Negotiation With Tutor',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'demoNeedPriceNegotiationWithTutor',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'demoNegotiatedOverrideRateWithTutor',
        headerName: 'Demo Negotiated Override Rate With Tutor',
        dataType: 'number',
        mapping: 'demoNegotiatedOverrideRateWithTutor'
      },{
        id: 'demoTutorNegotiationRemarks',
        headerName: 'Demo Tutor Negotiation Remarks',
        dataType: 'string',
        mapping: 'demoTutorNegotiationRemarks',
        lengthyData: true
      },{
        id: 'demoAdminRemarks',
        headerName: 'Demo Admin Remarks',
        dataType: 'string',
        mapping: 'demoAdminRemarks',
        lengthyData: true
      },{
        id: 'demoAdminFinalizingRemarks',
        headerName: 'Demo Admin Finalizing Remarks',
        dataType: 'string',
        mapping: 'demoAdminFinalizingRemarks',
        lengthyData: true
      }]
    };
    return grid;
  }

  public setUpGridMetaData() {
    this.currentSubscriptionPackagesGridMetaData = {
      grid: this.getSubscriptionPackageGridObject('currentPackagesGrid', 'Current Packages', '/rest/sales/currentSubscriptionPackageList'),
      htmlDomElementId: 'current-subscription-packages-grid',
      hidden: false
    };

    this.historySubscriptionPackagesGridMetaData = {
      grid: this.getSubscriptionPackageGridObject('historyPackagesGrid', 'History Packages', '/rest/sales/historySubscriptionPackageList'),
      htmlDomElementId: 'history-subscription-packages-grid',
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
      context.subscriptionPackageDataAccess = {
        success: response.success,
        message: response.message,
        subscriptionPackageDataModificationAccess: response.subscriptionPackageDataModificationAccess
      };
      context.selectedSubscriptionPackageSerialId = context.interimHoldSelectedSubscriptionPackageSerialId;
      context.toggleVisibilitySubscriptionPackagesGrid();
    }
  }

  toggleVisibilitySubscriptionPackagesGrid() {
    if (this.showSubscriptionPackagesData === true) {
      this.showSubscriptionPackagesData = false;
      this.selectedSubscriptionPackageSerialId = null;
      setTimeout(() => {
        this.currentSubscriptionPackagesGridObject.init();
        this.historySubscriptionPackagesGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.currentSubscriptionPackagesGridObject.refreshGridData();
        this.historySubscriptionPackagesGridObject.refreshGridData();
      }, 200);
    } else {
      this.showSubscriptionPackagesData = true;
    }
  }
}

export interface SubscriptionPackageDataAccess {
  success: boolean;
  message: string;
  subscriptionPackageDataModificationAccess: boolean;
}