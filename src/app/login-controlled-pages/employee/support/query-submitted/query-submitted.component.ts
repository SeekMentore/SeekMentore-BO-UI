import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {HelperService} from 'src/app/utils/helper.service';
import {Column} from 'src/app/utils/grid/column';
import {LcpRestUrls} from 'src/app/utils/lcp-rest-urls';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {ActionButton} from 'src/app/utils/grid/action-button';
import {LcpConstants} from 'src/app/utils/lcp-constants';

@Component({
  selector: 'app-query-submitted',
  templateUrl: './query-submitted.component.html',
  styleUrls: ['./query-submitted.component.css']
})
export class QuerySubmittedComponent implements OnInit, AfterViewInit {

  @ViewChild('nonContactedQueryGrid')
  nonContactedQueryGridObject: GridComponent;
  nonContactedQueryGridMetaData: GridDataInterface;

  @ViewChild('nonAnsweredQueryGrid')
  nonAnsweredQueryGridObject: GridComponent;
  nonAnsweredQueryGridMetaData: GridDataInterface;

  @ViewChild('answeredQueryGrid')
  answeredQueryGridObject: GridComponent;
  answeredQueryGridMetaData: GridDataInterface;

  showQueryData = false;
  selectedQueryRecord: GridRecord = null;
  interimHoldSelectedQueryRecord: GridRecord = null;
  interimHoldSelectedQueryGridObject: GridComponent = null;
  queryDataAccess: QueryDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.nonContactedQueryGridMetaData = null;
    this.nonAnsweredQueryGridMetaData = null;
    this.answeredQueryGridMetaData = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nonContactedQueryGridObject.init();
      this.nonAnsweredQueryGridObject.init();
      this.answeredQueryGridObject.init();
    }, 0);
    setTimeout(() => {
      this.nonContactedQueryGridObject.refreshGridData();
      this.nonAnsweredQueryGridObject.refreshGridData();
      this.answeredQueryGridObject.refreshGridData();
    }, 0);
  }

  public getGridObject(id: string, title: string, restURL: string, gridObject: GridComponent) {
    let grid = {
      id: id,
      title: title,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [
        {
          id: 'queryRequestedDate',
          headerName: 'Query Requested Date',
          dataType: 'date',
          mapping: 'queryRequestedDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime,
          clickEvent: (record: GridRecord, column: Column) => {
            // Open the Data view port
            this.interimHoldSelectedQueryRecord = record;
            this.interimHoldSelectedQueryGridObject = gridObject;
            if (this.queryDataAccess === null) {
              this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.tutorDataAccess, 'POST');
            } else {
              this.selectedQueryRecord = this.interimHoldSelectedQueryRecord;
              this.toggleVisibilityQueryGrid();
            }
          }
        },
        {
          id: 'queryStatus',
          headerName: 'Query Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.queryStatusFilterOptions,
          mapping: 'queryStatus'
        },
        {
          id: 'emailId',
          headerName: 'Email Id',
          dataType: 'string',
          mapping: 'emailId'
        },
        {
          id: 'queryDetails',
          headerName: 'Query Details',
          dataType: 'string',
          mapping: 'queryDetails',
          lengthyData: true
        },
        {
          id: 'queryResponse',
          headerName: 'Query Response',
          dataType: 'string',
          mapping: 'queryResponse',
          lengthyData: true
        },
        {
          id: 'notAnsweredReason',
          headerName: 'Not Answered Reason',
          dataType: 'string',
          mapping: 'notAnsweredReason',
          lengthyData: true
        },
        {
          id: 'registeredTutor',
          headerName: 'Is Registered Tutor',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'registeredTutor',
          renderer: GridCommonFunctions.yesNoRenderer
        },
        {
          id: 'subscribedCustomer',
          headerName: 'Is Subscribed Customer',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'subscribedCustomer',
          renderer: GridCommonFunctions.yesNoRenderer
        }
      ],
      hasSelectionColumn: true,
      selectionColumn: {
        buttons: [{
          id: 'sendEmail',
          label: 'Send Email',
          clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
            // Refer document
            const selectedEmailsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'emailId');
            if (selectedEmailsList.length === 0) {
              this.helperService.showAlertDialog({
                isSuccess: false,
                message: LcpConstants.tutor_grid_no_tutors_selected,
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
    this.nonContactedQueryGridMetaData = {
      grid: this.getGridObject('nonContactedQueryGrid', 'Non Contacted Queries', '/rest/support/nonContactedQueryList', this.nonContactedQueryGridObject),
      htmlDomElementId: 'non-contacted-query-grid',
      hidden: false
    };

    this.nonAnsweredQueryGridMetaData = {
      grid: this.getGridObject('nonAnsweredQueryGrid', 'Non Answered Queries', '/rest/support/nonAnsweredQueryList', this.nonAnsweredQueryGridObject),
      htmlDomElementId: 'non-answered-query-grid',
      hidden: false
    };

    this.answeredQueryGridMetaData = {
      grid: this.getGridObject('answeredQueryGrid', 'Answered Queries', '/rest/support/answeredQueryList', this.answeredQueryGridObject),
      htmlDomElementId: 'answered-query-grid',
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
      context.subscriptionDataAccess = {
        success: response.success,
        message: response.message,
        queryResponseCapableAccess: response.queryResponseCapableAccess
      };
      context.selectedQueryRecord = context.interimHoldSelectedQueryRecord;
      context.toggleVisibilityQueryGrid();
    }
  }

  toggleVisibilityQueryGrid() {
    if (this.showQueryData === true) {
      this.showQueryData = false;
      this.selectedQueryRecord = null;
      setTimeout(() => {
        this.interimHoldSelectedQueryGridObject.init();
      }, 0);
      setTimeout(() => {
        this.interimHoldSelectedQueryGridObject.refreshGridData();
      }, 0);
    } else {
      this.showQueryData = true;
    }
  }

}

export interface QueryDataAccess {
  success: boolean;
  message: string;
  queryResponseCapableAccess: boolean;
}
