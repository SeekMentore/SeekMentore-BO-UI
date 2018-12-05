import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { MappedTutorScheduleDemoAccess } from '../schedule-demo.component';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { Column } from 'src/app/utils/grid/column';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';

@Component({
  selector: 'app-schedule-demo-data',
  templateUrl: './schedule-demo-data.component.html',
  styleUrls: ['./schedule-demo-data.component.css']
})
export class ScheduleDemoDataComponent implements OnInit, AfterViewInit {

  @ViewChild('currentTutorAllMappingGrid')
  currentTutorAllMappingGridObject: GridComponent;
  currentTutorAllMappingGridMetaData: GridDataInterface;

  @ViewChild('currentTutorAllScheduledDemoGrid')
  currentTutorAllScheduledDemoGridObject: GridComponent;
  currentTutorAllScheduledDemoGridMetaData: GridDataInterface;

  @Input()
  mappedTutorRecord: GridRecord = null;

  @Input()
  mappedTutorScheduleDemoAccess: MappedTutorScheduleDemoAccess = null;

  scheduleDemoMappedTutorUpdatedRecord = {};

  showTutorDetails = false;
  showTutorContactedDetails = false;
  showClientContactedDetails = false;
  showEmployeeActionDetails = false;

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  mappingStatusFilterOptions = CommonFilterOptions.mappingStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.currentTutorAllMappingGridMetaData = null;
    this.currentTutorAllScheduledDemoGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.currentTutorAllMappingGridObject.init();
      this.currentTutorAllMappingGridObject.addExtraParams('tutorId', this.mappedTutorRecord.getProperty('tutorId'));

      this.currentTutorAllScheduledDemoGridObject.init();
      this.currentTutorAllScheduledDemoGridObject.addExtraParams('tutorId', this.mappedTutorRecord.getProperty('tutorId'));
    }, 0);
    setTimeout(() => {
      this.currentTutorAllMappingGridObject.refreshGridData();
      this.currentTutorAllScheduledDemoGridObject.refreshGridData();
    }, 0);
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  public setUpGridMetaData() {
    this.currentTutorAllMappingGridMetaData = {
      grid: {
        id: 'currentTutorAllMappingGrid',
        title: 'Current Tutor All Mapping',
        store: {
          isStatic: false,
          restURL: '/rest/sales/currentTutorAllMappingList'
        },
        columns: [{
          id: 'enquirySubject',
          headerName: 'Enquiry Subject',
          dataType: 'list',
          filterOptions: CommonFilterOptions.subjectsFilterOptions,
          mapping: 'enquirySubject',
          renderer: AdminCommonFunctions.subjectsRenderer,
          clickEvent: (record: GridRecord, column: Column) => {
            
          }        
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
          id: 'enquiryPreferredTeachingType',
          headerName: 'Enquiry Preferred Teaching Type',
          dataType: 'list',
          filterOptions: CommonFilterOptions.preferredTeachingTypeFilterOptions,
          mapping: 'enquiryPreferredTeachingType',
          multiList: true,
          renderer: AdminCommonFunctions.preferredTeachingTypeMultiRenderer
        },{
          id: 'quotedTutorRate',
          headerName: 'Quoted Tutor Rate',
          dataType: 'number',
          mapping: 'quotedTutorRate'
        },{
          id: 'negotiatedRateWithTutor',
          headerName: 'Negotiated Rate With Tutor',
          dataType: 'number',
          mapping: 'negotiatedRateWithTutor'
        },{
          id: 'tutorNegotiationRemarks',
          headerName: 'Tutor Negotiation Remarks',
          dataType: 'string',
          mapping: 'tutorNegotiationRemarks',
          lengthyData: true
        },{
          id: 'isTutorContacted',
          headerName: 'Is Tutor Contacted',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isTutorContacted',
          renderer: GridCommonFunctions.yesNoRenderer
        },{
          id: 'isTutorAgreed',
          headerName: 'Is Tutor Agreed',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isTutorAgreed',
          renderer: GridCommonFunctions.yesNoRenderer
        },{
          id: 'isDemoScheduled',
          headerName: 'Is Demo Scheduled',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isDemoScheduled',
          renderer: GridCommonFunctions.yesNoRenderer
        },{
          id: 'mappingStatus',
          headerName: 'Mapping Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.mappingStatusFilterOptions,
          mapping: 'mappingStatus'
        }]
      },
      htmlDomElementId: 'current-tutor-all-mapping-grid',
      hidden: false,
    };

    this.currentTutorAllScheduledDemoGridMetaData = {
      grid: {
        id: 'currentTutorAllScheduledDemoGrid',
        title: 'Current Tutor Scheduled Demo',
        store: {
          isStatic: false,
          restURL: '/rest/sales/currentTutorAllScheduledDemoList'
        },
        columns: [{
          id: 'customerName',
          headerName: 'Customer Name',
          dataType: 'string',
          mapping: 'customerName'
        }, {
          id: 'tutorName',
          headerName: 'Tutor Name',
          dataType: 'string',
          mapping: 'tutorName'
        }, {
          id: 'demoDateAndTime',
          headerName: 'Demo Date And Time',
          dataType: 'date',
          mapping: 'demoDateAndTimeMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        }, {
          id: 'demoOccurred',
          headerName: 'Demo Occurred',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'demoOccurred',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'demoStatus',
          headerName: 'Demo Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.demoStatusFilterOptions,
          mapping: 'demoStatus'
        }, {
          id: 'clientSatisfiedFromTutor',
          headerName: 'Client Satisfied From Tutor',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'clientSatisfiedFromTutor',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'clientRemarks',
          headerName: 'Client Remarks',
          dataType: 'string',
          mapping: 'clientRemarks',
          lengthyData: true
        }, {
          id: 'tutorSatisfiedWithClient',
          headerName: 'Tutor Satisfied With Client',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'tutorSatisfiedWithClient',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'tutorRemarks',
          headerName: 'Tutor Remarks',
          dataType: 'string',
          mapping: 'tutorRemarks',
          lengthyData: true
        }, {
          id: 'adminSatisfiedFromTutor',
          headerName: 'Admin Satisfied From Tutor',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'adminSatisfiedFromTutor',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'adminSatisfiedWithClient',
          headerName: 'Admin Satisfied With Client',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'adminSatisfiedWithClient',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'isDemoSuccess',
          headerName: 'Demo Success',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isDemoSuccess',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'needPriceNegotiationWithClient',
          headerName: 'Need Price Negotiation With Client',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'needPriceNegotiationWithClient',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'negotiatedOverrideRateWithClient',
          headerName: 'Negotiated Override Rate With Client',
          dataType: 'number',
          mapping: 'negotiatedOverrideRateWithClient'
        }, {
          id: 'clientNegotiationRemarks',
          headerName: 'Client Negotiation Remarks',
          dataType: 'string',
          mapping: 'clientNegotiationRemarks',
          lengthyData: true
        }, {
          id: 'needPriceNegotiationWithTutor',
          headerName: 'Need Price Negotiation With Tutor',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'needPriceNegotiationWithTutor',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'negotiatedOverrideRateWithTutor',
          headerName: 'Negotiated Override Rate With Tutor',
          dataType: 'number',
          mapping: 'negotiatedOverrideRateWithTutor'
        }, {
          id: 'tutorNegotiationRemarks',
          headerName: 'Tutor Negotiation Remarks',
          dataType: 'string',
          mapping: 'tutorNegotiationRemarks',
          lengthyData: true
        }, {
          id: 'adminRemarks',
          headerName: 'Admin Remarks',
          dataType: 'string',
          mapping: 'adminRemarks',
          lengthyData: true
        }, {
          id: 'adminFinalizingRemarks',
          headerName: 'Admin Finalizing Remarks',
          dataType: 'string',
          mapping: 'adminFinalizingRemarks',
          lengthyData: true
        }, {
          id: 'reschedulingRemarks',
          headerName: 'Re-scheduling Remarks',
          dataType: 'string',
          mapping: 'reschedulingRemarks',
          lengthyData: true
        }]
      },
      htmlDomElementId: 'current-tutor-all-mapping-grid',
      hidden: false,
    };
  }

  updateScheduleDemoMappedTutorProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.scheduleDemoMappedTutorUpdatedRecord, this.mappedTutorRecord, deselected, isAllOPeration);
  }

  updateScheduleDemoMappedTutorRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.scheduleDemoMappedTutorUpdatedRecord, this.mappedTutorRecord.getProperty('tutorMapperId'));
    this.utilityService.makerequest(this, this.onUpdateScheduleDemoMappedTutorRecord, LcpRestUrls.schedule_demo_mapped_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateScheduleDemoMappedTutorRecord(context: any, data: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: data['success'],
      message: data['message'],
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
    if (data['success']) {
      this.editRecordForm = false;
    }
  }

}
