import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {RegisterTutorDataAccess} from 'src/app/login-controlled-pages/employee/admin/registered-tutor/registered-tutor.component';
import {AppUtilityService} from 'src/app/utils/app-utility.service';
import {CommonFilterOptions} from 'src/app/utils/common-filter-options';
import {ActionButton} from 'src/app/utils/grid/action-button';
import {GridCommonFunctions} from 'src/app/utils/grid/grid-common-functions';
import {GridRecord} from 'src/app/utils/grid/grid-record';
import {GridComponent, GridDataInterface} from 'src/app/utils/grid/grid.component';
import {HelperService} from 'src/app/utils/helper.service';
import {LcpConstants} from 'src/app/utils/lcp-constants';
import {LcpRestUrls} from 'src/app/utils/lcp-rest-urls';
import {AlertDialogEvent} from 'src/app/utils/alert-dialog/alert-dialog.component';
import {Column} from 'src/app/utils/grid/column';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';

@Component({
  selector: 'app-registered-tutor-data',
  templateUrl: './registered-tutor-data.component.html',
  styleUrls: ['./registered-tutor-data.component.css']
})
export class RegisteredTutorDataComponent implements OnInit, AfterViewInit {

  @ViewChild('uploadedDocumentGrid')
  uploadedDocumentGridObject: GridComponent;
  uploadedDocumentGridMetaData: GridDataInterface;

  @ViewChild('bankDetailGrid')
  bankDetailGridObject: GridComponent;
  bankDetailGridMetaData: GridDataInterface;

  @ViewChild('currentPackagesGrid')
  currentPackagesGridObject: GridComponent;
  currentPackagesGridMetaData: GridDataInterface;

  @ViewChild('historyPackagesGrid')
  historyPackagesGridObject: GridComponent;
  historyPackagesGridMetaData: GridDataInterface;

  @Input()
  tutorRecord: GridRecord = null;

  @Input()
  tutorDataAccess: RegisterTutorDataAccess = null;

  renderTutorRecordForm = false;
  
  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  tutorUpdatedData = {};

  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
  primaryProfessionFilterOptions = CommonFilterOptions.primaryProfessionFilterOptions;
  transportModeFilterOptions = CommonFilterOptions.transportModeFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  referenceFilterOptions = CommonFilterOptions.referenceFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  selectedGenderOption: any[] = [];
  selectedQualificationOption: any[] = [];
  selectedProfessionOption: any[] = [];
  selectedTransportOption: any[] = [];
  selectedStudentGrades: any[] = [];
  selectedSubjectOptions: any[] = [];
  selectedLocationOptions: any[] = [];
  selectedTeachingTypeOptions: any[] = []; 

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  aadharCard: any = null;
  panCard: any = null;
  photograph: any = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {
    this.uploadedDocumentGridMetaData = null;
    this.bankDetailGridMetaData = null;
    this.currentPackagesGridMetaData = null;
    this.historyPackagesGridMetaData = null;
    this.tutorUpdatedData = {};
  }

  ngOnInit() {
    this.selectedGenderOption = CommonUtilityFunctions.getSelectedFilterItems(this.genderFilterOptions, this.tutorRecord.getProperty('gender'));
    this.selectedQualificationOption = CommonUtilityFunctions.getSelectedFilterItems(this.qualificationFilterOptions, this.tutorRecord.getProperty('qualification'));
    this.selectedProfessionOption = CommonUtilityFunctions.getSelectedFilterItems(this.primaryProfessionFilterOptions, this.tutorRecord.getProperty('primaryProfession'));
    this.selectedTransportOption = CommonUtilityFunctions.getSelectedFilterItems(this.transportModeFilterOptions, this.tutorRecord.getProperty('transportMode'));
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.tutorRecord.getProperty('interestedSubjects'));
    this.selectedLocationOptions = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.tutorRecord.getProperty('comfortableLocations'));
    this.selectedStudentGrades = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.tutorRecord.getProperty('interestedStudentGrades'));
    this.selectedTeachingTypeOptions = CommonUtilityFunctions.getSelectedFilterItems(this.preferredTeachingTypeFilterOptions, this.tutorRecord.getProperty('preferredTeachingType'));
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
      if (this.tutorDataAccess.documentViewAccess) {
        this.uploadedDocumentGridObject.init();
        this.uploadedDocumentGridObject.addExtraParams('tutorId', this.tutorRecord.getProperty('tutorId'));
      }
      if (this.tutorDataAccess.bankViewAccess) {
        this.bankDetailGridObject.init();
        this.bankDetailGridObject.addExtraParams('tutorId', this.tutorRecord.getProperty('tutorId'));
      }
      this.renderTutorRecordForm = true;
      if (this.tutorDataAccess.activePackageViewAccess) {
        this.currentPackagesGridObject.init();
        this.currentPackagesGridObject.addExtraParams('tutorId', this.tutorRecord.getProperty('tutorId'));
      }
      if (this.tutorDataAccess.historyPackagesViewAccess) {
        this.historyPackagesGridObject.init();
        this.historyPackagesGridObject.addExtraParams('tutorId', this.tutorRecord.getProperty('tutorId'));
      }
    }, 0);

    setTimeout(() => {
      if (this.tutorDataAccess.documentViewAccess) {
        this.uploadedDocumentGridObject.refreshGridData();
      }
      if (this.tutorDataAccess.bankViewAccess) {
        this.bankDetailGridObject.refreshGridData();
      }
      if (this.tutorDataAccess.activePackageViewAccess) {
        this.currentPackagesGridObject.refreshGridData();
      }
      if (this.tutorDataAccess.historyPackagesViewAccess) {
        this.historyPackagesGridObject.refreshGridData();
      }
    }, 0);
  }

  public setUpGridMetaData() {
    this.uploadedDocumentGridMetaData = {
      grid: {
        id: 'uploadedDocumentGrid',
        title: 'Uploaded Documents',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/uploadedDocumentList'
        },
        columns: [{
          id: 'documentType',
          headerName: 'Document Type',
          dataType: 'list',
          filterOptions: CommonFilterOptions.documentTypeFilterOptions,
          mapping: 'documentType',
          renderer: AdminCommonFunctions.documentTypeRenderer,
          clickEvent: (record: GridRecord, column: Column) => {
            const documentIdElement: HTMLInputElement = <HTMLInputElement>document.getElementById('tutorDocumentDownloadForm-documentId');
            documentIdElement.value = record.getProperty('documentId');
            this.utilityService.submitForm('tutorDocumentDownloadForm', '/rest/registeredTutor/downloadTutorDocument', 'POST');
          }
        }, {
          id: 'isApproved',
          headerName: 'Is Approved',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isApproved',
          renderer: GridCommonFunctions.yesNoRenderer
        }, {
          id: 'whoActed',
          headerName: 'Who Acted',
          dataType: 'string',
          mapping: 'whoActedName'
        }, {
          id: 'remarks',
          headerName: 'Remarks',
          dataType: 'string',
          mapping: 'remarks',
          lengthyData: true          
        }, {
          id: 'actionDate',
          headerName: 'Action Date',
          dataType: 'date',
          mapping: 'actionDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillisWithTime
        }],
        hasSelectionColumn: this.tutorDataAccess.documentHandleAccess,
        selectionColumn: {
          buttons: [{
            id: 'approveMultiple',
            label: 'Approve',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_document_grid_approve, 
                    selectedRecords,
                    'documentId', 
                    this.uploadedDocumentGridObject,
                    'Enter comments to Approve Documents',
                    'Please provide your comments for approving the documents.',
                    false,
                    true);
            }
          }, {
            id: 'sendReminderMultiple',
            label: 'Send Reminder',
            btnclass: 'btnReset',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_document_grid_reminder, 
                    selectedRecords,
                    'documentId', 
                    this.uploadedDocumentGridObject, 
                    'Enter comments to Send Reminder for Documents',
                    'Please provide your comments for reminding the documents.',
                    false,
                    true,
                    true);
            }
          }, {
            id: 'rejectMultiple',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_document_grid_reject, 
                    selectedRecords,
                    'documentId', 
                    this.uploadedDocumentGridObject,
                    'Enter comments to Reject Documents',
                    'Please provide your comments for rejecting the documents.',
                    true,
                    true);
            }
          }]
        },
        hasActionColumn: true,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'approve',
            label: 'Approve',
            clickEvent: (record: GridRecord, button: ActionButton) => {              
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_document_grid_approve, 
                    [record],
                    'documentId', 
                    this.uploadedDocumentGridObject,
                    'Enter comments to Approve Document',
                    'Please provide your comments for approving the document.',
                    false);
            }
          }, {
            id: 'sendReminder',
            label: 'Remind',
            btnclass: 'btnReset',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_document_grid_reminder, 
                    [record],
                    'documentId', 
                    this.uploadedDocumentGridObject,
                    'Enter comments to Send Reminder for Document',
                    'Please provide your comments for reminding the document.',
                    false,
                    false,
                    true);
            }
          }, {
            id: 'reject',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_document_grid_reject, 
                    [record],
                    'documentId', 
                    this.uploadedDocumentGridObject,
                    'Enter comments to Reject Document',
                    'Please provide your comments for rejecting the document.');
            }
          }]
        }
      },
      htmlDomElementId: 'uploaded-document-grid',
      hidden: false,
    };

    this.bankDetailGridMetaData = {
      grid: {
        id: 'bankDetailGrid',
        title: 'Bank Details',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/bankDetailList'
        },
        columns: [{
          id: 'bankName',
          headerName: 'Bank Name',
          dataType: 'string',
          mapping: 'bankName'
        }, {
          id: 'accountNumber',
          headerName: 'Account Number',
          dataType: 'string',
          mapping: 'accountNumber'
        }, {
          id: 'ifscCode',
          headerName: 'IFSC Code',
          dataType: 'string',
          mapping: 'ifscCode'
        }, {
          id: 'accountHolderName',
          headerName: 'Account Holder Name',
          dataType: 'string',
          mapping: 'accountHolderName'
        }, {
          id: 'isDefault',
          headerName: 'Is Default',
          dataType: 'list',
          filterOptions: CommonFilterOptions.yesNoFilterOptions,
          mapping: 'isDefault',
          renderer: GridCommonFunctions.yesNoRenderer
        }],
        hasSelectionColumn: this.tutorDataAccess.bankHandleAccess,
        selectionColumn: {
          buttons: [{
            id: 'approveMultiple',
            label: 'Approve',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_bank_grid_approve, 
                    selectedRecords,
                    'bankAccountId', 
                    this.bankDetailGridObject, 
                    'Enter comments to Approve Bank Accounts',
                    'Please provide your comments for approving the accounts.',
                    false,
                    true);

            }
          }, {
            id: 'rejectMultiple',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_bank_grid_reject, 
                    selectedRecords,
                    'bankAccountId', 
                    this.bankDetailGridObject, 
                    'Enter comments to Reject Bank Accounts',
                    'Please provide your comments for rejecting the accounts.',
                    true,
                    true);
            }
          }]
        },
        hasActionColumn: true,
        actionColumn: {
          label: 'Take Action',
          buttons: [{
            id: 'approve',
            label: 'Approve',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_bank_grid_approve, 
                    [record],
                    'bankAccountId', 
                    this.bankDetailGridObject,
                    'Enter comments to Approve Bank Account',
                    'Please provide your comments for approving the account.',
                    false);
            }
          }, {
            id: 'makeDefault',
            label: 'Default',
            btnclass: 'btnReset',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              this.helperService.showPromptDialog({
                required: false,
                titleText: 'Enter comments to Make Default this Bank Account',
                placeholderText: 'Please provide your comments for making the account Default.',
                onOk: (message) => {
                  const data = {
                    bankAccountId: record.getProperty('bankAccountId'),
                    tutorId: this.tutorRecord.getProperty('tutorId'),
                    comments: message
                  };
                  this.utilityService.makeRequestWithoutResponseHandler(LcpRestUrls.tutor_bank_grid_make_default, 'POST', this.utilityService.urlEncodeData(data),
                    'application/x-www-form-urlencoded').subscribe(result => {
                    let response = result['response'];
                    response = this.utilityService.decodeObjectFromJSON(response);
                    if (response != null) {
                      if (response['success'] === false) {
                        this.helperService.showAlertDialog({
                          isSuccess: response['success'],
                          message: response['message'],
                          onButtonClicked: () => {
                          }
                        });
                      } else {
                        this.bankDetailGridObject.refreshGridData();
                      }
                    }
                  }, error2 => {
                    const myListener: AlertDialogEvent = {
                      isSuccess: false,
                      message: 'Communication failure!! Something went wrong',
                      onButtonClicked: () => {
                      }
                    };
                    this.helperService.showAlertDialog(myListener);
                  });  
                },
                onCancel: () => {
                }
              });
            }
          }, {
            id: 'reject',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              this.makeRestCallForGridOperation(
                    LcpRestUrls.tutor_bank_grid_reject, 
                    [record],
                    'bankAccountId', 
                    this.bankDetailGridObject,
                    'Enter comments to Reject Bank Account',
                    'Please provide your comments for rejecting the account.');
            }
          }]
        }
      },
      htmlDomElementId: 'bank-detail-grid',
      hidden: false,
    };

    this.currentPackagesGridMetaData = {
      grid: {
        id: 'currentPackagesGrid',
        title: 'Current Packages',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/currentPackageList'
        },
        columns: [{
          id: 'customerName',
          headerName: 'Customer Name',
          dataType: 'string',
          mapping: 'customerName'
        }, {
          id: 'totalHours',
          headerName: 'Total Hours',
          dataType: 'number',
          mapping: 'totalHours'
        }, {
          id: 'startDate',
          headerName: 'Start Date',
          dataType: 'date',
          mapping: 'startDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'completedHours',
          headerName: 'Completed Hours',
          dataType: 'number',
          mapping: 'completedHours'
        }]
      },
      htmlDomElementId: 'current-packages-grid',
      hidden: false,
    };

    this.historyPackagesGridMetaData = {
      grid: {
        id: 'historyPackagesGrid',
        title: 'History Packages',
        store: {
          isStatic: false,
          restURL: '/rest/registeredTutor/historyPackageList'
        },
        columns: [{
          id: 'customerName',
          headerName: 'Customer Name',
          dataType: 'string',
          mapping: 'customerName'
        }, {
          id: 'totalHours',
          headerName: 'Total Hours',
          dataType: 'number',
          mapping: 'totalHours'
        }, {
          id: 'startDate',
          headerName: 'Start Date',
          dataType: 'date',
          mapping: 'startDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }, {
          id: 'endDate',
          headerName: 'End Date',
          dataType: 'date',
          mapping: 'endDateMillis',
          renderer: GridCommonFunctions.renderDateFromMillis
        }]
      },
      htmlDomElementId: 'history-packages-grid',
      hidden: false
    };
  }

  makeRestCallForGridOperation(
          url: string, 
          selectedRecords: GridRecord[], 
          property: string, 
          gridComponent: GridComponent, 
          commentPopupTitleText: string,
          commentPopupPlaceholderText: string,
          commentsMandatory: boolean = true, 
          multipleRecords: boolean = false,
          showAlertMessageAndDoNotRefreshGrid: boolean = false
  ) {
    let selectedIdsList = [];
    if (multipleRecords) {
      selectedIdsList = GridCommonFunctions.getSelectedRecordsPropertyList(selectedRecords, property);
    } else {
      selectedIdsList = [selectedRecords[0].getProperty(property)];
    }
    if (selectedIdsList.length === 0) {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: LcpConstants.grid_generic_no_record_selected_error,
        onButtonClicked: () => {
        }
      });
    } else {
      this.helperService.showPromptDialog({
        required: commentsMandatory,
        titleText: commentPopupTitleText,
        placeholderText: commentPopupPlaceholderText,
        onOk: (message) => {
          const data = {
            allIdsList: selectedIdsList.join(';'),
            tutorId: this.tutorRecord.getProperty('tutorId'),
            comments: message
          };
          this.utilityService.makeRequestWithoutResponseHandler(url, 'POST', this.utilityService.urlEncodeData(data),
            'application/x-www-form-urlencoded').subscribe(result => {
            let response = result['response'];
            response = this.utilityService.decodeObjectFromJSON(response);
            if (response != null) {
              if (response['success'] === false) {
                this.helperService.showAlertDialog({
                  isSuccess: response['success'],
                  message: response['message'],
                  onButtonClicked: () => {
                  }
                });
              } else {
                if (showAlertMessageAndDoNotRefreshGrid) {
                  const myListener: AlertDialogEvent = {
                    isSuccess: response['success'],
                    message: response['message'],
                    onButtonClicked: () => {
                    }
                  };
                  this.helperService.showAlertDialog(myListener);
                } else {
                  gridComponent.refreshGridData();
                }
              }
            }
          }, error2 => {
            const myListener: AlertDialogEvent = {
              isSuccess: false,
              message: 'Communication failure!! Something went wrong',
              onButtonClicked: () => {
              }
            };
            this.helperService.showAlertDialog(myListener);
          });  
        },
        onCancel: () => {
        }
      });     
    }
  }

  getDateForDateInputParam(value: any) {
    return CommonUtilityFunctions.getDateForDateInputParam(value);
  }

  updateTutorProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {    
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.tutorUpdatedData, this.tutorRecord, deselected, isAllOPeration);
  }
  
  updateTutorRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.tutorUpdatedData, this.tutorRecord.getProperty('tutorId'));
    if (this.panCard) {
      data.append('inputFilePANCard', this.panCard);
    }
    if (this.aadharCard) {
      data.append('inputFileAadhaarCard', this.aadharCard);
    }
    if (this.photograph) {
      data.append('inputFilePhoto', this.photograph);
    }
    this.utilityService.makerequest(this, this.onUpdateTutorRecord, LcpRestUrls.tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateTutorRecord(context: any, response: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (response['success']) {
      context.editRecordForm = false;
      context.detachAllFiles();
    } 
  }

  attachFile(event: any, type: any) {
    if (type === 'pan_card') {
      this.panCard = event.target.files[0];
    }
    if (type === 'aadhar_card') {
      this.aadharCard = event.target.files[0];
    }
    if (type === 'photo') {
      this.photograph = event.target.files[0];
    }
  }

  detachFile(type: any) {
    if (type === 'pan_card') {
      this.panCard = null;
    }
    if (type === 'aadhar_card') {
      this.aadharCard = null;
    }
    if (type === 'photo') {
      this.photograph = null;
    }
  }

  detachAllFiles() {
    this.panCard = null;
    this.aadharCard = null;
    this.photograph = null;    
  }
}
