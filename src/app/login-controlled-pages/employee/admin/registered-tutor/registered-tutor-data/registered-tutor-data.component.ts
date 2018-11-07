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
  editRecordForm = false;

  tutorUpdatedData = {};

  genderFilterOptions = CommonFilterOptions.genderFilterOptions;
  qualificationFilterOptions = CommonFilterOptions.qualificationFilterOptions;
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

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;


  aadharCard;
  panCard;
  photograph;


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
    this.selectedProfessionOption = CommonUtilityFunctions.getSelectedFilterItems(this.selectedProfessionOption, this.tutorRecord.getProperty('primaryProfession'));
    this.selectedProfessionOption = CommonUtilityFunctions.getSelectedFilterItems(this.selectedTransportOption, this.tutorRecord.getProperty('transportMode'));
    this.selectedSubjectOptions = CommonUtilityFunctions.getSelectedFilterItems(this.subjectsFilterOptions, this.tutorRecord.getProperty('interestedSubjects'));
    this.selectedLocationOptions = CommonUtilityFunctions.getSelectedFilterItems(this.locationsFilterOptions, this.tutorRecord.getProperty('comfortableLocations'));
    this.selectedStudentGrades = CommonUtilityFunctions.getSelectedFilterItems(this.studentGradesFilterOptions, this.tutorRecord.getProperty('interestedStudentGrades'));
    this.setUpGridMetaData();
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
          restURL: '/rest/registeredTutor/uploadedDocuments'
        },
        columns: [{
          id: 'filename',
          headerName: 'Filename',
          dataType: 'string',
          mapping: 'filename'
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
          mapping: 'whoActed'
        }, {
          id: 'remarks',
          headerName: 'Remarks',
          dataType: 'string',
          mapping: 'remarks',
          lengthyData: true,
          clickEvent: (record: GridRecord, column: Column) => {
            alert(column.headerName);
          }
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
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_approve_multiple, selectedRecords,
                'documentId', this.uploadedDocumentGridObject, true);
            }
          }, {
            id: 'sendReminderMultiple',
            label: 'Send Reminder',
            btnclass: 'btnReset',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_reminder_multiple, selectedRecords,
                'documentId', this.uploadedDocumentGridObject, true);
            }
          }, {
            id: 'rejectMultiple',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_reject_multiple, selectedRecords,
                'documentId', this.uploadedDocumentGridObject, true);
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
              // '/rest/registeredTutor/approveTutorDocument'
              // param name - 'selectedId'
              // param value - record.property('documentId')
              // response - If success = true -> refresh grid if false - show Alert Failure with message
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_approve_single, [record],
                'documentId', this.uploadedDocumentGridObject);
            }
          }, {
            id: 'sendReminder',
            label: 'Remind',
            btnclass: 'btnReset',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              // '/rest/registeredTutor/sendReminderTutorDocument'
              // param name - 'selectedId'
              // param value - record.property('documentId')
              // response - If success = true -> refresh grid if false - show Alert Failure with message
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_reminder_single, [record],
                'documentId', this.uploadedDocumentGridObject);
            }
          }, {
            id: 'reject',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              // '/rest/registeredTutor/rejectTutorDocument'
              // param name - 'selectedId'
              // param value - record.property('documentId')
              // response - If success = true -> refresh grid if false - show Alert Failure with message
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_document_grid_reject_single, [record],
                'documentId', this.uploadedDocumentGridObject);
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
          restURL: '/rest/registeredTutor/bankDetails'
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
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_bank_grid_approve_multiple, selectedRecords,
                'bankAccountId', this.bankDetailGridObject, true);

            }
          }, {
            id: 'rejectMultiple',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (selectedRecords: GridRecord[], button: ActionButton) => {
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_bank_grid_reject_multiple, selectedRecords,
                'bankAccountId', this.bankDetailGridObject, true);
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
              // '/rest/registeredTutor/approveBankAccount'
              // param name - 'selectedId'
              // param value - record.property('bankAccountId')
              // response - If success = true -> refresh grid if false - show Alert Failure with message
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_bank_grid_approve_single, [record],
                'bankAccountId', this.bankDetailGridObject);
            }
          }, {
            id: 'makeDefault',
            label: 'Default',
            btnclass: 'btnReset',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              // '/rest/registeredTutor/makeDefaultBankAccount'
              // param name - 'selectedId'
              // param value - record.property('bankAccountId')
              // response - If success = true -> refresh grid if false - show Alert Failure with message
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_bank_grid_make_default, [record],
                'bankAccountId', this.bankDetailGridObject);

            }
          }, {
            id: 'reject',
            label: 'Reject',
            btnclass: 'btnReject',
            clickEvent: (record: GridRecord, button: ActionButton) => {
              // '/rest/registeredTutor/rejectBankAccount'
              // param name - 'selectedId'
              // param value - record.property('bankAccountId')
              // response - If success = true -> refresh grid if false - show Alert Failure with message
              this.makeRestCallForGridOperation(LcpRestUrls.tutor_bank_grid_reject_single, [record],
                'bankAccountId', this.bankDetailGridObject);
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
          restURL: '/rest/registeredTutor/currentPackages'
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
          restURL: '/rest/registeredTutor/historyPackages'
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

  makeRestCallForGridOperation(url: string, selectedRecords: GridRecord[], property: string, gridComponent: GridComponent, multipleRecords: boolean = false) {

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
      const data = {
        params: selectedIdsList.join(';')
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
            gridComponent.refreshGridData();
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
    }
  }



  updateTutorProperty(key: string, value: string, data_type: string) {
    CommonUtilityFunctions.updateRecordProperty(key, value, data_type, this.tutorUpdatedData, this.tutorRecord);
  }

  updateTutorRecord() {
    const data = this.helperService.encodedGridFormData(this.tutorUpdatedData, this.tutorRecord.getProperty('tutorId'));
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

  onUpdateTutorRecord(context: any, data: any) {
    if (data['success'] === true) {

    } else {

    }
  }

  attachFile(event, type) {
    if (type === 'pan_card') {
      this.panCard = event.target.files[0];
    }
    if (type === 'aadhar_card') {
      this.aadharCard = event.target.files[0];
    }
    if (type === 'photo') {
      this.photograph = event.target.files[0];
    }

    console.log(this.photograph);

  }
}
