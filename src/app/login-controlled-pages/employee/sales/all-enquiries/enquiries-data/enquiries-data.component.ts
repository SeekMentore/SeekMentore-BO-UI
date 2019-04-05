import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { EnquiryDataAccess } from '../all-enquiries.component';
import { Enquiry } from 'src/app/model/enquiry';

@Component({
  selector: 'app-enquiries-data',
  templateUrl: './enquiries-data.component.html',
  styleUrls: ['./enquiries-data.component.css']
})
export class EnquiriesDataComponent implements OnInit, AfterViewInit {

  @ViewChild('currentCustomerAllPendingEnquiryGrid')
  currentCustomerAllPendingEnquiryGridObject: GridComponent;
  currentCustomerAllPendingEnquiryGridMetaData: GridDataInterface;

  @Input()
  enquirySerialId: string = null;

  @Input()
  customerSerialId: string = null;

  @Input()
  enquiryDataAccess: EnquiryDataAccess = null;

  enquiryUpdatedRecord = {};

  formEditMandatoryDisbaled = true;
  takeActionDisabled = true;
  editRecordForm = false;

  showEmployeeActionDetails = false;
  showCustomerDetails = false;
  showEmployeeActionButtons = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  isRecordUpdateFormDirty: boolean = false;
  enquiryUpdateFormMaskLoaderHidden: boolean = true;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  showRecordUpdateButton: boolean = false; 
  canChangeToPending: boolean = false;
  canChangeToBeMapped: boolean = false;
  canChangeAborted: boolean = false;

  dirtyFlagList: string[] = ['RECORD_UPDATE'];

  // Modal Properties
  enqruiyRecord: Enquiry;
  recordLastUpdatedDateAndTimeDisplay: string;
  matchStatusDisplay: string;
  isMappedDisplay: string;
  selectedStudentGradeOption: any[] = [];
  selectedSubjectOption: any[] = [];
  selectedLocationOption: any[] = [];
  selectedTeachingTypeOptions: any[] = [];

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { 
    this.currentCustomerAllPendingEnquiryGridMetaData = null;
    this.enqruiyRecord = new Enquiry();
  }

  ngOnInit() {
    this.getEnquiryGridRecord(this.enquirySerialId);
    this.setUpGridMetaData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.enquiryDataAccess.enquiryDataModificationAccess) {
        this.currentCustomerAllPendingEnquiryGridObject.init();
        this.currentCustomerAllPendingEnquiryGridObject.addExtraParams('customerSerialId', this.customerSerialId);
      }
    }, 100);
    setTimeout(() => {
      if (this.enquiryDataAccess.enquiryDataModificationAccess) {
        this.currentCustomerAllPendingEnquiryGridObject.refreshGridData();
      }
    }, 100);
  }

  private showRecordUpdateFormLoaderMask() {
    this.enquiryUpdateFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.enquiryUpdateFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.enquiryDataAccess.enquiryDataModificationAccess;
    this.showRecordUpdateEditControlSection = this.showRecordUpdateForm && !this.formEditMandatoryDisbaled;
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm;
    this.takeActionDisabled = !this.canChangeToPending && !this.canChangeToBeMapped && !this.canChangeAborted;
  }

  private getConfirmationMessageForFormsDirty(allFlags: boolean = true, flagList: string[] = null) {
    let confirmationMessage: string = '';
    let messageList: string[] = [];
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            if (this.isRecordUpdateFormDirty) {
              messageList.push('You have unsaved changes on the Update form.');
            }
            break;
          }
        }
      });
    }
    if (CommonUtilityFunctions.checkNonEmptyList(messageList)) {
      messageList.push('Do you still want to continue');
      messageList.forEach((message) => {
        confirmationMessage += message + '\n';
      });      
    }
    return confirmationMessage;
  }

  private isFlagListDirty(allFlags: boolean = true, flagList: string[] = null) {
    let resultantFlagValue: boolean = false;
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            resultantFlagValue = resultantFlagValue || this.isRecordUpdateFormDirty;
            break;
          }
        }
      });
    }
    return resultantFlagValue;
  }

  private setFlagListNotDirty(allFlags: boolean = true, flagList: string[] = null) {
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            this.isRecordUpdateFormDirty = false;
            break;
          }
        }
      });
    }
  }

  private setFlagListDirty(allFlags: boolean = true, flagList: string[] = null) {
    if (allFlags) {
      flagList = this.dirtyFlagList;
    }
    if (CommonUtilityFunctions.checkNonEmptyList(flagList)) {
      flagList.forEach((flag) => {
        switch(flag) {
          case 'RECORD_UPDATE' : {
            this.isRecordUpdateFormDirty = true;
            break;
          }
        }
      });
    }
  }

  private getEnquiryGridRecord(enquirySerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: enquirySerialId
    };    
    this.utilityService.makerequest(this, this.onGetEnquiryGridRecord, LcpRestUrls.get_enquiry_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  onGetEnquiryGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['enquiryFormEditMandatoryDisbaled'];
      context.canChangeToPending = gridRecordObject.additionalProperties['enquiryFormCanChangeToPending'];
      context.canChangeToBeMapped = gridRecordObject.additionalProperties['enquiryFormCanChangeToBeMapped'];
      context.canChangeAborted = gridRecordObject.additionalProperties['enquiryFormCanChangeAborted'];
      context.setUpDataModal(gridRecordObject.record);
    } else {
      context.helperService.showAlertDialog({
        isSuccess: false,
        message: gridRecordObject.errorMessage,
        onButtonClicked: () => {
        }
      });
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  private setUpDataModal(enquiryGridRecord: GridRecord) {
    this.enqruiyRecord.setValuesFromGridRecord(enquiryGridRecord);
    this.enquirySerialId = this.enqruiyRecord.enquirySerialId;
    this.customerSerialId = this.enqruiyRecord.customerSerialId;
    this.recordLastUpdatedDateAndTimeDisplay = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.enqruiyRecord.lastActionDateMillis);
    this.matchStatusDisplay = GridCommonFunctions.lookupRendererForValue(this.enqruiyRecord.matchStatus, this.matchStatusFilterOptions);
    this.isMappedDisplay = GridCommonFunctions.lookupRendererForValue(this.enqruiyRecord.isMapped, this.yesNoFilterOptions);
    this.selectedStudentGradeOption = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.enqruiyRecord.grade);
    this.selectedSubjectOption = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.enqruiyRecord.subject);
    this.selectedLocationOption = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.enqruiyRecord.locationDetails);
    this.selectedTeachingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTeachingTypeFilterOptions, this.enqruiyRecord.preferredTeachingType);
    CommonUtilityFunctions.setHTMLInputElementValue('quotedClientRate', this.enqruiyRecord.quotedClientRate);
    CommonUtilityFunctions.setHTMLInputElementValue('negotiatedRateWithClient', this.enqruiyRecord.negotiatedRateWithClient);
    CommonUtilityFunctions.setHTMLInputElementValue('clientNegotiationRemarks', this.enqruiyRecord.clientNegotiationRemarks);
    CommonUtilityFunctions.setHTMLInputElementValue('additionalDetails', this.enqruiyRecord.additionalDetails);
    CommonUtilityFunctions.setHTMLInputElementValue('addressDetails', this.enqruiyRecord.addressDetails);
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  public setUpGridMetaData() {
    this.currentCustomerAllPendingEnquiryGridMetaData = {
      grid: {
        id: 'currentCustomerAllPendingEnquiryGrid',
        title: 'Current Customer Pending Enquiries',
        collapsed: true,
        store: {
          isStatic: false,
          restURL: '/rest/sales/currentCustomerAllPendingEnquiriesList'
        },
        columns: [{
          id: 'enquirySerialId',
          headerName: 'Enquiry Serial Id',
          dataType: 'string',
          mapping: 'enquirySerialId',
          clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {
            let enquirySerialId: any = column.getValueForColumn(record);
            if (this.enquirySerialId === enquirySerialId.toString()) {
              this.helperService.showAlertDialog({
                isSuccess: false,
                message: 'This record is already loaded on the form',
                onButtonClicked: () => {
                }
              });
            } else {
              if (!this.isFlagListDirty()) {
                this.getEnquiryGridRecord(enquirySerialId);
              } else {
                this.helperService.showConfirmationDialog({
                  message: this.getConfirmationMessageForFormsDirty(),
                  onOk: () => {
                    this.setFlagListNotDirty();
                    this.getEnquiryGridRecord(enquirySerialId);
                  },
                  onCancel: () => {
                    this.helperService.showAlertDialog({
                      isSuccess: false,
                      message: 'Action Aborted',
                      onButtonClicked: () => {
                      }
                    });
                  }
                });
              }              
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
          id: 'matchStatus',
          headerName: 'Match Status',
          dataType: 'list',
          filterOptions: CommonFilterOptions.matchStatusFilterOptions,
          mapping: 'matchStatus',
          renderer: AdminCommonFunctions.matchStatusRenderer
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
            let tutorSerialId: any = column.getValueForColumn(record);
            if (CommonUtilityFunctions.checkStringAvailability(tutorSerialId)) {
              if (!this.isFlagListDirty()) {
                this.helperService.showAlertDialog({
                  isSuccess: true,
                  message: 'Opening Record For - ' + tutorSerialId,
                  onButtonClicked: () => {
                  }
                });
              } else {
                this.helperService.showConfirmationDialog({
                  message: this.getConfirmationMessageForFormsDirty(),
                  onOk: () => {
                    this.setFlagListNotDirty();
                    this.helperService.showAlertDialog({
                      isSuccess: true,
                      message: 'Opening Record For - ' + tutorSerialId,
                      onButtonClicked: () => {
                      }
                    });
                  },
                  onCancel: () => {
                    this.helperService.showAlertDialog({
                      isSuccess: false,
                      message: 'Action Aborted',
                      onButtonClicked: () => {
                      }
                    });
                  }
                });
              } 
            }
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
        }]
      },
      htmlDomElementId: 'current-customer-all-pending-enquiries-grid',
      hidden: false,
    };
  }

  updateEnquiryProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.enquiryUpdatedRecord, this.enqruiyRecord, deselected, isAllOPeration);
  }

  updateEnquiryRecord() {
    this.showRecordUpdateFormLoaderMask();
    const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.enquiryUpdatedRecord, this.enquirySerialId);
    this.utilityService.makerequest(this, this.onUpdateEnquiryRecord, LcpRestUrls.pending_enquiry_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateEnquiryRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty(false, ['RECORD_UPDATE']);
      context.getEnquiryGridRecord(context.enquirySerialId);
      context.currentCustomerAllPendingEnquiryGridObject.refreshGridData();
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetEnquiryRecord() {
    if (!this.isFlagListDirty()) {
      this.getEnquiryGridRecord(this.enquirySerialId);
      this.currentCustomerAllPendingEnquiryGridObject.refreshGridData();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.getEnquiryGridRecord(this.enquirySerialId);
          this.currentCustomerAllPendingEnquiryGridObject.refreshGridData();
        },
        onCancel: () => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          });
        }
      });
    }
  }

  takeActionOnEnquiryRecord(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    if (!this.isFlagListDirty()) {
      this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.takeActionPrompt(titleText, placeholderText, actionText, commentsRequired);
        },
        onCancel: () => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          });
        }
      });
    }
  }

  private takeActionPrompt(titleText: string, placeholderText: string, actionText: string, commentsRequired: boolean = false) {
    this.helperService.showPromptDialog({
      required: commentsRequired,
      titleText: titleText,
      placeholderText: placeholderText,
      onOk: (message) => {
        this.showRecordUpdateFormLoaderMask();                  
        const data = {
          allIdsList: this.enquirySerialId,
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
    if (response['success']) {
      context.editRecordForm = false;
      context.setFlagListNotDirty(false, ['RECORD_UPDATE']);
      context.getEnquiryGridRecord(context.enquirySerialId);
      context.currentCustomerAllPendingEnquiryGridObject.refreshGridData();
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  openCustomerRecord() {
    if (!this.isFlagListDirty()) {
      this.loadCustomerRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadCustomerRecord();
        },
        onCancel: () => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          });
        }
      });
    }
  }

  loadCustomerRecord() {
    alert("Loading Customer Record > " + this.enqruiyRecord.customerSerialId);
  }
  
  openTutorRecord() {
    if (!this.isFlagListDirty()) {
      this.loadTutorRecord();
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.loadTutorRecord();
        },
        onCancel: () => {
          this.helperService.showAlertDialog({
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          });
        }
      });
    }
  }

  loadTutorRecord() {
    alert("Loading Tutor Record > " + this.enqruiyRecord.tutorSerialId);
  }
}
