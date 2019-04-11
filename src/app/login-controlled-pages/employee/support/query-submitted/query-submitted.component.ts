import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { ApplicationBreadCrumbConfig } from 'src/app/utils/application-bread-crumb-config';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { ActionButton } from 'src/app/utils/grid/action-button';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpConstants } from 'src/app/utils/lcp-constants';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';

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

  showSubmitQueryData = false;
  selectedQuerySerialId: string = null;
  interimHoldSelectedQuerySerialId: string = null;
  submitQueryDataAccess: SubmitQueryDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) {
    this.nonContactedQueryGridMetaData = null;
    this.nonAnsweredQueryGridMetaData = null;
    this.answeredQueryGridMetaData = null;
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
      this.nonContactedQueryGridObject.init();
      this.nonAnsweredQueryGridObject.init();
      this.answeredQueryGridObject.init();
    }, 100);
    setTimeout(() => {
      this.nonContactedQueryGridObject.refreshGridData();
      this.nonAnsweredQueryGridObject.refreshGridData();
      this.answeredQueryGridObject.refreshGridData();
    }, 100);
  }

  private getSelectionColumnBaseButton() {
    return [{
      id: 'sendEmail',
      label: 'Send Email',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        const selectedEmailsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'emailId');
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
    }];
  }

  public getGridObject(id: string, title: string, restURL: string, downloadURL: string, gridExtraParam: string, customSelectionButtons: any[], collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL,
        download: {
          url: downloadURL,
          preDownload: (gridComponentObject: GridComponent) => {
            gridComponentObject.addExtraParams('grid', gridExtraParam);
          }
        }
      },
      columns: [{
        id: 'querySerialId',
        headerName: 'Query Serial Id',
        dataType: 'string',
        mapping: 'querySerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedQuerySerialId = column.getValueForColumn(record);
          if (this.submitQueryDataAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.submit_query_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedQuerySerialId = this.interimHoldSelectedQuerySerialId;
            this.toggleVisibilityQueryGrid();
          }
        }
        }, {
          id: 'queryRequestedDate',
          headerName: 'Query Requested Date',
          dataType: 'date',
          mapping: 'queryRequestedDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        }, {
          id: 'queryStatus',
          headerName: 'Query Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.queryStatusFilterOptions,
          mapping: 'queryStatus',
          renderer: AdminCommonFunctions.queryStatusRenderer
        }, {
          id: 'emailId',
          headerName: 'Email Id',
          dataType: 'string',
          mapping: 'emailId'
        }, {
          id: 'queryDetails',
          headerName: 'Query Details',
          dataType: 'string',
          mapping: 'queryDetails',
          lengthyData: true
        }, {
          id: 'queryResponse',
          headerName: 'Query Response',
          dataType: 'string',
          mapping: 'queryResponse',
          lengthyData: true
        }, {
          id: 'notAnsweredReason',
          headerName: 'Not Answered Reason',
          dataType: 'string',
          mapping: 'notAnsweredReason',
          lengthyData: true
        }, {
          id: 'registeredTutor',
          headerName: 'Is Registered Tutor',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'registeredTutor',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'tutorSerialId',
          headerName: 'Registered Tutor Serial Id',
          dataType: 'string',
          mapping: 'tutorSerialId',
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            alert(column.getValueForColumn(record));
          }
        }, {
          id: 'subscribedCustomer',
          headerName: 'Is Subscribed Customer',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'subscribedCustomer',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'customerSerialId',
          headerName: 'Subscribed Customer Serial Id',
          dataType: 'string',
          mapping: 'customerSerialId',
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            alert(column.getValueForColumn(record));
          }
        }],
      hasSelectionColumn: true,
      selectionColumn: {
        buttons: this.getSelectionColumnBaseButton().concat(customSelectionButtons)
      }
    }
    return grid;
  }

  private getCustomButton (
      id:string, 
      label: string, 
      btnclass: string = 'btnSubmit', 
      actionText: string, 
      commentsRequired: boolean = false,
      titleText: string,
      placeholderText: string
  ) {
    return {
      id: id,
      label: label,
      btnclass: btnclass,
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        const querySerialIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'querySerialId');
        if (querySerialIdsList.length === 0) {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: LcpConstants.grid_generic_no_record_selected_error,
            onButtonClicked: () => {
            }
          });
        } else {
          let extraContextProperties: {
            action: string,
            button: ActionButton,
            gridComponentObject: GridComponent
          } = {
            action: actionText,
            button: button,
            gridComponentObject: gridComponentObject
          };
          button.disable();
          gridComponentObject.showGridLoadingMask();
          this.helperService.showPromptDialog({
            required: commentsRequired,
            titleText: titleText,
            placeholderText: placeholderText,
            onOk: (message) => {                  
              const data = {
                allIdsList: querySerialIdsList.join(';'),
                button: actionText,
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.take_action_on_submit_query, 'POST', this.utilityService.urlEncodeData(data),
                'application/x-www-form-urlencoded', false, null, extraContextProperties);
            },
            onCancel: () => {
              button.enable();
              gridComponentObject.hideGridLoadingMask();
            }
          });
        }
      }
    };
  }

  handleSelectionActionRequest(context: any, response: any, extraContextProperties: Object) {
    if (response['success'] === false) {
      context.helperService.showAlertDialog({
        isSuccess: response['success'],
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    } else {
      if (CommonUtilityFunctions.checkObjectAvailability(extraContextProperties)) {
        let action: string = extraContextProperties['action'];
        let button: ActionButton = extraContextProperties['button'];
        let gridComponentObject: GridComponent = extraContextProperties['gridComponentObject'];
        button.enable();
        gridComponentObject.hideGridLoadingMask();
        gridComponentObject.refreshGridData();
        switch(action) {
          case 'respond' : {
            context.answeredQueryGridObject.refreshGridData();
            break;
          }
          case 'hold' : {
            context.nonAnsweredQueryGridObject.refreshGridData();
            break;
          }
        }
      } else {
        context.helperService.showAlertDialog({
          isSuccess: false,
          message: 'Extra properties got damaged in the process, please refresh the page',
          onButtonClicked: () => {
          }
        });
      }
    }
  }

  public setUpGridMetaData() {
    let respondButton = this.getCustomButton('respond', 'Respond', 'btnSubmit', 'respond', true, 'Respond to Query', 'Please provide your response for the query.');
    let putOnHoldButton = this.getCustomButton('hold', 'Put on Hold', 'btnReject', 'hold', true, 'Put query on hold', 'Please provide your explanation for putting query on hold.');

    this.nonContactedQueryGridMetaData = {
      grid: this.getGridObject('nonContactedQueryGrid', 'New Queries', '/rest/support/nonContactedQueryList', '/rest/support/downloadAdminReportSubmitQueryList', '/nonContactedQueryList', [respondButton, putOnHoldButton]),
      htmlDomElementId: 'non-contacted-query-grid',
      hidden: false
    };
    this.nonAnsweredQueryGridMetaData = {
      grid: this.getGridObject('nonAnsweredQueryGrid', 'Put On Hold Queries', '/rest/support/nonAnsweredQueryList', '/rest/support/downloadAdminReportSubmitQueryList', '/nonAnsweredQueryList', [respondButton], true),
      htmlDomElementId: 'non-answered-query-grid',
      hidden: false
    };
    this.answeredQueryGridMetaData = {
      grid: this.getGridObject('answeredQueryGrid', 'Responded Queries', '/rest/support/answeredQueryList', '/rest/support/downloadAdminReportSubmitQueryList', '/answeredQueryList', [], true),
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
      context.submitQueryDataAccess = {
        success: response.success,
        message: response.message,
        submitQueryResponseCapableAccess: response.submitQueryResponseCapableAccess
      };
      context.selectedQuerySerialId = context.interimHoldSelectedQuerySerialId;
      context.toggleVisibilityQueryGrid();
    }
  }

  toggleVisibilityQueryGrid() {
    if (this.showSubmitQueryData === true) {
      this.showSubmitQueryData = false;
      this.selectedQuerySerialId = null;
      setTimeout(() => {
        this.nonContactedQueryGridObject.init();
        this.nonAnsweredQueryGridObject.init();
        this.answeredQueryGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.nonContactedQueryGridObject.refreshGridData();
        this.nonAnsweredQueryGridObject.refreshGridData();
        this.answeredQueryGridObject.refreshGridData();
      }, 100);
    } else {
      this.showSubmitQueryData = true;
    }
  }
}

export interface SubmitQueryDataAccess {
  success: boolean;
  message: string;
  submitQueryResponseCapableAccess: boolean;
}
