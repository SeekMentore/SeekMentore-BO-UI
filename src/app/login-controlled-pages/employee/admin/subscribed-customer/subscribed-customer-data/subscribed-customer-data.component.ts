import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {HelperService} from 'src/app/utils/helper.service';
import {SubscribedCustomerDataAccess} from '../subscribed-customer.component';
import {CommonFilterOptions} from '../../../../../utils/common-filter-options';
import {LcpRestUrls} from '../../../../../utils/lcp-rest-urls';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';

@Component({
  selector: 'app-subscribed-customer-data',
  templateUrl: './subscribed-customer-data.component.html',
  styleUrls: ['./subscribed-customer-data.component.css']
})
export class SubscribedCustomerDataComponent implements OnInit {

  @ViewChild('currentPackagesGrid')
  currentPackagesGridObject: GridComponent;
  currentPackagesGridMetaData: GridDataInterface;

  @ViewChild('historyPackagesGrid')
  historyPackagesGridObject: GridComponent;
  historyPackagesGridMetaData: GridDataInterface;

  @Input()
  customerRecord: GridRecord = null;

  @Input()
  customerDataAccess: SubscribedCustomerDataAccess = null;

  renderCustomerRecordForm = false;

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;

  customerUpdatedData = {};

  selectedGenderOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedGradesOptions: any[] = [];
  selectedSubjectOptions: any[] = [];

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.currentPackagesGridMetaData = null;
    this.historyPackagesGridMetaData = null;
  }

  ngOnInit() {
    this.selectedGenderOption = CommonUtilityFunctions.getSelectedFilterItems(this.genderFilterOptions, this.customerRecord.getProperty('gender'));
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.customerRecord.getProperty('location'));
    this.selectedGradesOptions = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.customerRecord.getProperty('studentGrades'));
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.customerRecord.getProperty('interestedSubjects'));
    this.setUpGridMetaData();
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.customerDataAccess.activePackageViewAccess) {
        this.currentPackagesGridObject.init();
        this.currentPackagesGridObject.addExtraParams('customerId', this.customerRecord.getProperty('customerId'));
      }
      if (this.customerDataAccess.historyPackagesViewAccess) {
        this.historyPackagesGridObject.init();
        this.historyPackagesGridObject.addExtraParams('customerId', this.customerRecord.getProperty('customerId'));
      }
      this.renderCustomerRecordForm = true;
    }, 0);
    setTimeout(() => {
      if (this.customerDataAccess.activePackageViewAccess) {
        this.currentPackagesGridObject.refreshGridData();
      }
      if (this.customerDataAccess.historyPackagesViewAccess) {
        this.historyPackagesGridObject.refreshGridData();
      }
    }, 0);
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
        id: 'tutorName',
        headerName: 'Tutor Name',
        dataType: 'string',
        mapping: 'tutorName'
      },{
        id: 'tutorEmail',
        headerName: 'Tutor Email',
        dataType: 'string',
        mapping: 'tutorEmail'
      },{
        id: 'tutorContactNumber',
        headerName: 'Tutor Contact Number',
        dataType: 'string',
        mapping: 'tutorContactNumber'
      },{
        id: 'createdMillis',
        headerName: 'Created Date',
        dataType: 'date',
        mapping: 'createdMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      },{
        id: 'totalHours',
        headerName: 'Total Hours',
        dataType: 'number',
        mapping: 'totalHours'
      },{
        id: 'startDateMillis',
        headerName: 'Start Date',
        dataType: 'date',
        mapping: 'startDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
      },{
        id: 'completedHours',
        headerName: 'Completed Hours',
        dataType: 'number',
        mapping: 'completedHours'
      },{
        id: 'completedMinutes',
        headerName: 'Completed Minutes',
        dataType: 'number',
        mapping: 'completedMinutes'
      },{
        id: 'endDateMillis',
        headerName: 'End Date',
        dataType: 'date',
        mapping: 'endDateMillis',
        renderer: GridCommonFunctions.renderDateFromMillis
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
    this.currentPackagesGridMetaData = {
      grid: this.getSubscriptionPackageGridObject('currentPackagesGrid', 'Current Packages', '/rest/subscribedCustomer/currentSubscriptionPackageList', true),
      htmlDomElementId: 'current-packages-grid',
      hidden: false,
    };

    this.historyPackagesGridMetaData = {
      grid: this.getSubscriptionPackageGridObject('historyPackagesGrid', 'History Packages', '/rest/subscribedCustomer/historySubscriptionPackageList', true),
      htmlDomElementId: 'history-packages-grid',
      hidden: false
    };
  }

  updateCustomerProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.customerUpdatedData, this.customerRecord, deselected, isAllOPeration);
  }

  updateCustomerRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.customerUpdatedData, this.customerRecord.getProperty('customerId'));
    this.utilityService.makerequest(this, this.onUpdateCustomerRecord, LcpRestUrls.customer_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateCustomerRecord(context: any, response: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (response['success']) {
      context.editRecordForm = false;
    }
  }

  downloadProfile() {
    const customerId: HTMLInputElement = <HTMLInputElement>document.getElementById('profileDownload-customerId');
    customerId.value = this.customerRecord.getProperty('customerId');
    this.utilityService.submitForm('profileDownloadForm', '/rest/subscribedCustomer/downloadAdminSubscribedCustomerProfilePdf', 'POST');
  }
}
