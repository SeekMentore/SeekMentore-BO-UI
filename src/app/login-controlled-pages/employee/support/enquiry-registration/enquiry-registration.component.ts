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
  selector: 'app-enquiry-registration',
  templateUrl: './enquiry-registration.component.html',
  styleUrls: ['./enquiry-registration.component.css']
})
export class EnquiryRegistrationComponent implements OnInit, AfterViewInit {

  @ViewChild('nonContactedFindTutorGrid')
  nonContactedFindTutorGridObject: GridComponent;
  nonContactedFindTutorGridMetaData: GridDataInterface;

  @ViewChild('nonVerifiedFindTutorGrid')
  nonVerifiedFindTutorGridObject: GridComponent;
  nonVerifiedFindTutorGridMetaData: GridDataInterface;

  @ViewChild('verifiedFindTutorGrid')
  verifiedFindTutorGridObject: GridComponent;
  verifiedFindTutorGridMetaData: GridDataInterface;

  @ViewChild('verificationFailedFindTutorGrid')
  verificationFailedFindTutorGridObject: GridComponent;
  verificationFailedFindTutorGridMetaData: GridDataInterface;

  @ViewChild('toBeReContactedFindTutorGrid')
  toBeReContactedFindTutorGridObject: GridComponent;
  toBeReContactedFindTutorGridMetaData: GridDataInterface;

  @ViewChild('selectedFindTutorGrid')
  selectedFindTutorGridObject: GridComponent;
  selectedFindTutorGridMetaData: GridDataInterface;

  @ViewChild('rejectedFindTutorGrid')
  rejectedFindTutorGridObject: GridComponent;
  rejectedFindTutorGridMetaData: GridDataInterface;

  showFindTutorData = false;
  selectedFindTutorSerialId: string = null;
  interimHoldSelectedFindTutorSerialId: string = null;
  findTutorDataAccess: FindTutorDataAccess = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService, private router: Router) {
    this.nonContactedFindTutorGridMetaData = null;
    this.nonVerifiedFindTutorGridMetaData = null;
    this.verifiedFindTutorGridMetaData = null;
    this.verificationFailedFindTutorGridMetaData = null;
    this.toBeReContactedFindTutorGridMetaData = null;
    this.selectedFindTutorGridMetaData = null;
    this.rejectedFindTutorGridMetaData = null;
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
      this.nonContactedFindTutorGridObject.init();
      this.nonVerifiedFindTutorGridObject.init();
      this.verifiedFindTutorGridObject.init();
      this.verificationFailedFindTutorGridObject.init();
      this.toBeReContactedFindTutorGridObject.init();
      this.selectedFindTutorGridObject.init();
      this.rejectedFindTutorGridObject.init();
    }, 100);
    setTimeout(() => {
      this.nonContactedFindTutorGridObject.refreshGridData();
      this.nonVerifiedFindTutorGridObject.refreshGridData();
      this.verifiedFindTutorGridObject.refreshGridData();
      this.verificationFailedFindTutorGridObject.refreshGridData();
      this.toBeReContactedFindTutorGridObject.refreshGridData();
      this.selectedFindTutorGridObject.refreshGridData();
      this.rejectedFindTutorGridObject.refreshGridData();
    }, 100);
  }

  expandAllGrids() {
    this.nonContactedFindTutorGridObject.expandGrid();
    this.nonVerifiedFindTutorGridObject.expandGrid();
    this.verifiedFindTutorGridObject.expandGrid();
    this.verificationFailedFindTutorGridObject.expandGrid();
    this.toBeReContactedFindTutorGridObject.expandGrid();
    this.selectedFindTutorGridObject.expandGrid();
    this.rejectedFindTutorGridObject.expandGrid();
  }

  collapseAllGrids() {
    this.nonContactedFindTutorGridObject.collapseGrid();
    this.nonVerifiedFindTutorGridObject.collapseGrid();
    this.verifiedFindTutorGridObject.collapseGrid();
    this.verificationFailedFindTutorGridObject.collapseGrid();
    this.toBeReContactedFindTutorGridObject.collapseGrid();
    this.selectedFindTutorGridObject.collapseGrid();
    this.rejectedFindTutorGridObject.collapseGrid();
  }

  private getSelectionColumnBlacklistButton() {
    return {
      id: 'blacklist',
      label: 'Blacklist',
      btnclass: 'btnReject',
      clickEvent: (selectedRecords: GridRecord[], button: ActionButton, gridComponentObject: GridComponent) => {
        const findTutorSerialIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'findTutorSerialId');
        if (findTutorSerialIdsList.length === 0) {
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
            action: 'Blacklist',
            button: button,
            gridComponentObject: gridComponentObject
          };
          button.disable();
          gridComponentObject.showGridLoadingMask();
          this.helperService.showPromptDialog({
            required: true,
            titleText: 'Enter comments to Blacklist',
            placeholderText: 'Please provide your comments for blacklisting the enquiries.',
            onOk: (message) => {
              const data = {
                allIdsList: findTutorSerialIdsList.join(';'),
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.blackList_find_tutors, 'POST', this.utilityService.urlEncodeData(data),
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
        id: 'findTutorSerialId',
        headerName: 'Find Tutor Serial Id',
        dataType: 'string',
        mapping: 'findTutorSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
          this.interimHoldSelectedFindTutorSerialId = column.getValueForColumn(record);
          if (this.findTutorDataAccess === null) {
            this.utilityService.makerequest(this, this.handleDataAccessRequest, LcpRestUrls.find_tutor_data_access, 'POST', null, 'application/x-www-form-urlencoded');
          } else {
            this.selectedFindTutorSerialId = this.interimHoldSelectedFindTutorSerialId;
            this.toggleVisibilityFindTutorGrid();
          }
        }
        }, {
          id: 'name',
          headerName: 'Name',
          dataType: 'string',
          mapping: 'name'
        }, {
          id: 'applicationDate',
          headerName: 'Application Date',
          dataType: 'date',
          mapping: 'applicationDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        }, {
          id: 'applicationStatus',
          headerName: 'Application Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.publicApplicationStatusFilterOptions,
          mapping: 'applicationStatus',
          renderer: AdminCommonFunctions.publicApplicationStatusRenderer
        }, {
          id: 'contactNumber',
          headerName: 'Contact Number',
          dataType: 'string',
          mapping: 'contactNumber'
        }, {
          id: 'emailId',
          headerName: 'Email Id',
          dataType: 'string',
          mapping: 'emailId'
        }, {
          id: 'studentGrade',
          headerName: 'Student Grades',
          dataType: 'list',
          filterOptions: CommonFilterOptions.studentGradesFilterOptions,
          mapping: 'studentGrade',
          renderer: AdminCommonFunctions.studentGradesRenderer
        }, {
          id: 'subjects',
          headerName: 'Subjects',
          dataType: 'list',
          filterOptions: CommonFilterOptions.subjectsFilterOptions,
          mapping: 'subjects',
          renderer: AdminCommonFunctions.subjectsRenderer
        }, {
          id: 'location',
          headerName: 'Location',
          dataType: 'list',
          filterOptions: CommonFilterOptions.locationsFilterOptions,
          mapping: 'location',
          renderer: AdminCommonFunctions.locationsRenderer
        }, {
          id: 'preferredTimeToCall',
          headerName: 'Preferred Time To Call',
          dataType: 'list',
          filterOptions: CommonFilterOptions.preferredTimeToCallFilterOptions,
          mapping: 'preferredTimeToCall',
          multiList: true,
          renderer: AdminCommonFunctions.preferredTimeToCallMultiRenderer
        }, {
          id: 'additionalDetails',
          headerName: 'Additional Details',
          dataType: 'string',
          mapping: 'additionalDetails',
          lengthyData: true
        }, {
          id: 'addressDetails',
          headerName: 'Address Details',
          dataType: 'string',
          mapping: 'addressDetails',
          lengthyData: true
        }, {
          id: 'reference',
          headerName: 'Reference',
          dataType: 'list',
          filterOptions: CommonFilterOptions.referenceFilterOptions,
          mapping: 'reference',
          renderer: AdminCommonFunctions.referenceRenderer
        }
      ],
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
        const findTutorSerialIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, 'findTutorSerialId');
        if (findTutorSerialIdsList.length === 0) {
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
                allIdsList: findTutorSerialIdsList.join(';'),
                button: actionText,
                comments: message
              };
              this.utilityService.makerequest(this, this.handleSelectionActionRequest,
                LcpRestUrls.take_action_on_find_tutor, 'POST', this.utilityService.urlEncodeData(data),
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

  public setUpGridMetaData() {
    let contactedButton = this.getCustomButton('contacted', 'Contacted', 'btnSubmit', 'contacted', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let recontactButton = this.getCustomButton('recontact', 'To Be Re-Contacted', 'btnReset', 'recontact', true, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let verifyButton = this.getCustomButton('verify', 'Verify', 'btnSubmit', 'verify', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let reverifyButton = this.getCustomButton('reverify', 'Re-Verify', 'btnSubmit', 'reverify', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let recontactedButton = this.getCustomButton('recontacted', 'Re-Contacted', 'btnReset', 'recontacted', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let selectButton = this.getCustomButton('select', 'Select', 'btnSubmit', 'select', false, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let failVerificationButton = this.getCustomButton('failverify', 'Fail Verify', 'btnReject', 'failverify', true, 'Enter comments for action', 'Please provide your comments for taking the action.');
    let rejectButton = this.getCustomButton('reject', 'Reject', 'btnReject', 'reject', true, 'Enter comments for action', 'Please provide your comments for taking the action.');

    this.nonContactedFindTutorGridMetaData = {
      grid: this.getGridObject('nonContactedFindTutorGrid', 'Non Contacted Find Tutor', '/rest/support/nonContactedFindTutorList', '/rest/support/downloadAdminReportFindTutorList', '/nonContactedFindTutorList',
                              [this.getSelectionColumnBlacklistButton(), contactedButton, recontactButton, rejectButton]),
      htmlDomElementId: 'non-contacted-find-tutor-grid',
      hidden: false
    };
    this.nonVerifiedFindTutorGridMetaData = {
      grid: this.getGridObject('nonVerifiedFindTutorGrid', 'Non Verified Find Tutor', '/rest/support/nonVerifiedFindTutorList', '/rest/support/downloadAdminReportFindTutorList', '/nonVerifiedFindTutorList', 
                              [this.getSelectionColumnBlacklistButton(), verifyButton, failVerificationButton, rejectButton], true),
      htmlDomElementId: 'non-verified-find-tutor-grid',
      hidden: false
    };
    this.verifiedFindTutorGridMetaData = {
      grid: this.getGridObject('verifiedFindTutorGrid', 'Verified Find Tutor', '/rest/support/verifiedFindTutorList', '/rest/support/downloadAdminReportFindTutorList', '/verifiedFindTutorList', 
                              [this.getSelectionColumnBlacklistButton(), selectButton, rejectButton], true),
      htmlDomElementId: 'verified-find-tutor-grid',
      hidden: false
    };
    this.verificationFailedFindTutorGridMetaData = {
      grid: this.getGridObject('verificationFailedFindTutorGrid', 'Verification Failed Find Tutor', '/rest/support/verificationFailedFindTutorList', '/rest/support/downloadAdminReportFindTutorList', '/verificationFailedFindTutorList', 
                              [this.getSelectionColumnBlacklistButton(), reverifyButton, rejectButton], true),
      htmlDomElementId: 'verification-failed-find-tutor-grid',
      hidden: false
    };
    this.toBeReContactedFindTutorGridMetaData = {
      grid: this.getGridObject('toBeReContactedFindTutorGrid', 'To Be Re-Contacted Find Tutor', '/rest/support/toBeReContactedFindTutorList', '/rest/support/downloadAdminReportFindTutorList', '/toBeReContactedFindTutorList', 
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, rejectButton], true),
      htmlDomElementId: 'to-be-recontacted-find-tutor-grid',
      hidden: false
    };
    this.selectedFindTutorGridMetaData = {
      grid: this.getGridObject('selectedFindTutorGrid', 'Selected Find Tutor', '/rest/support/selectedFindTutorList', '/rest/support/downloadAdminReportFindTutorList', '/selectedFindTutorList', [], true),
      htmlDomElementId: 'selected-find-tutor-grid',
      hidden: false
    };
    this.rejectedFindTutorGridMetaData = {
      grid: this.getGridObject('rejectedFindTutorGrid', 'Rejected Find Tutor', '/rest/support/rejectedFindTutorList', '/rest/support/downloadAdminReportFindTutorList', '/rejectedFindTutorList', 
                              [this.getSelectionColumnBlacklistButton(), recontactedButton, selectButton], true),
      htmlDomElementId: 'rejected-find-tutor-grid',
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
      context.findTutorDataAccess = {
        success: response.success,
        message: response.message,
        findTutorFormDataEditAccess: response.findTutorFormDataEditAccess
      };
      context.selectedFindTutorSerialId = context.interimHoldSelectedFindTutorSerialId;
      context.toggleVisibilityFindTutorGrid();
    }
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
          case 'contacted' : {
            context.nonVerifiedFindTutorGridObject.refreshGridData();
            break;
          }
          case 'recontact' : {
            context.toBeReContactedFindTutorGridObject.refreshGridData();
            break;
          }
          case 'verify' : {
            context.verifiedFindTutorGridObject.refreshGridData();
            break;
          }
          case 'reverify' : {
            context.verifiedFindTutorGridObject.refreshGridData();
            break;
          }
          case 'recontacted' : {
            context.nonVerifiedFindTutorGridObject.refreshGridData();
            break;
          }
          case 'select' : {
            context.selectedFindTutorGridObject.refreshGridData();
            break;
          }
          case 'failverify' : {
            context.verificationFailedFindTutorGridObject.refreshGridData();
            break;
          }
          case 'reject' : {
            context.rejectedFindTutorGridObject.refreshGridData();
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

  toggleVisibilityFindTutorGrid() {
    if (this.showFindTutorData === true) {
      this.showFindTutorData = false;
      this.selectedFindTutorSerialId = null;
      setTimeout(() => {
        this.nonContactedFindTutorGridObject.init();
        this.nonVerifiedFindTutorGridObject.init();
        this.verifiedFindTutorGridObject.init();
        this.verificationFailedFindTutorGridObject.init();
        this.toBeReContactedFindTutorGridObject.init();
        this.selectedFindTutorGridObject.init();
        this.rejectedFindTutorGridObject.init();
      }, 100);   
      setTimeout(() => {
        this.nonContactedFindTutorGridObject.refreshGridData();
        this.nonVerifiedFindTutorGridObject.refreshGridData();
        this.verifiedFindTutorGridObject.refreshGridData();
        this.verificationFailedFindTutorGridObject.refreshGridData();
        this.toBeReContactedFindTutorGridObject.refreshGridData();
        this.selectedFindTutorGridObject.refreshGridData();
        this.rejectedFindTutorGridObject.refreshGridData();
      }, 100);
    } else {
      this.showFindTutorData = true;
    }
  }
}

export interface FindTutorDataAccess {
  success: boolean;
  message: string;
  findTutorFormDataEditAccess: boolean;
}
