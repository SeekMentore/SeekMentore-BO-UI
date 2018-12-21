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
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';

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

  @Input()
  selectedRecordGridType: string = null;

  selectedEnquiryRecord: GridRecord = null;

  enquiryUpdatedRecord = {};

  loadSelectedEnquiry = true;
  showEmployeeActionDetails = false;
  showCustomerDetails = false;
  showEmployeeActionButtons = false;

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedTeachingTypeOptions: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.currentCustomerAllPendingEnquiriesGridMetaData = null;
  }

  ngOnInit() {
    this.selectedEnquiryRecord = this.enquiriesRecord;
    this.selectedStudentGradeOption = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.enquiriesRecord.getProperty('grade'));
    this.selectedSubjectOption = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.enquiriesRecord.getProperty('subject'));
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.enquiriesRecord.getProperty('locationDetails'));
    this.selectedTeachingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTeachingTypeFilterOptions, this.enquiriesRecord.getProperty('preferredTeachingType'));
    this.setUpGridMetaData();
    this.setDisabledStatus();
  }

  private setDisabledStatus() {
    if (this.selectedRecordGridType === 'pendingEnquiriesGrid') {
      this.formEditMandatoryDisbaled = false;
      this.takeActionDisabled = false;
    }
    if (this.selectedRecordGridType === 'toBeMappedEnquiriesGrid' || this.selectedRecordGridType === 'abortedEnquiriesGrid') {
      this.takeActionDisabled = false;
    }
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  updateEnquiryProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.enquiryUpdatedRecord, this.enquiriesRecord, deselected, isAllOPeration);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.allEnquiriesDataAccess.allEnquiriesDataModificationAccess) {
        this.currentCustomerAllPendingEnquiriesGridObject.init();
        this.currentCustomerAllPendingEnquiriesGridObject.addExtraParams('customerId', this.enquiriesRecord.getProperty('customerId'));
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
        id: 'currentCustomerAllPendingEnquiriesGrid',
        title: 'Current Customer Pending Enquiries',
        collapsed: true,
        store: {
          isStatic: false,
          restURL: '/rest/sales/currentCustomerAllPendingEnquiriesList'
        },
        columns: [{
          id: 'subject',
          headerName: 'Subject',
          dataType: 'list',
          filterOptions: CommonFilterOptions.subjectsFilterOptions,
          mapping: 'subject',
          renderer: AdminCommonFunctions.subjectsRenderer,
          clickEvent: (record: GridRecord, column: Column) => {
            alert(record.getProperty('subject'));
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
          multiList: true,
          renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
        }]
      },
      htmlDomElementId: 'current-customer-all-pending-enquiries-grid',
      hidden: false,
    };
  }

  updateEnquiryRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.enquiryUpdatedRecord, this.enquiriesRecord.getProperty('enquiryId'));
    this.utilityService.makerequest(this, this.onUpdateEnquiryRecord, LcpRestUrls.pending_enquiry_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  takeActionOnEnquiryRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {                  
        const data = {
          allIdsList: this.enquiriesRecord.getProperty('enquiryId'),
          button: actionText,
          comments: message
        };
        let url: string = LcpRestUrls.take_action_on_enquiry;
        this.utilityService.makerequest(this, this.handleTakeActionOnEnquiryRecord,
          url, 'POST', this.utilityService.urlEncodeData(data),
          'application/x-www-form-urlencoded');
      },
      onCancel: () => {
      }
    });
  }

  handleTakeActionOnEnquiryRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
  }

  onUpdateEnquiryRecord(context: any, data: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: data['success'],
      message: data['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (data['success']) {
      context.editRecordForm = false;
    }
  }
}
