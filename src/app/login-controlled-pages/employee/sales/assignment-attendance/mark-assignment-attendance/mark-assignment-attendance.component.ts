import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { Column } from 'src/app/utils/grid/column';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { GridComponent, GridDataInterface } from 'src/app/utils/grid/grid.component';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AssignmentAttendanceMarkingAccess } from '../assignment-attendance.component';

@Component({
  selector: 'app-mark-assignment-attendance',
  templateUrl: './mark-assignment-attendance.component.html',
  styleUrls: ['./mark-assignment-attendance.component.css']
})
export class MarkAssignmentAttendanceComponent implements OnInit {

  @Input()
  packageAssignmentSerialId: string = null;

  @Input()
  assignmentAttendanceMarkingAccess: AssignmentAttendanceMarkingAccess = null;  

  @ViewChild('assignmentAttendanceGrid')
  assignmentAttendanceGridObject: GridComponent;
  assignmentAttendanceGridMetaData: GridDataInterface;

  selectedPackageAssignmentRecord: GridRecord;
  selectedAssignmentAttendanceRecord: GridRecord;

  formEditMandatoryDisbaled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;
  happinessIndexFilterOptions = CommonFilterOptions.happinessIndexFilterOptions;

  isFormDirty: boolean = false;
  assignmentAttendanceFormMaskLoaderHidden: boolean = true;
  
  // Modal Properties
  assignmentAttendanceUpdatedRecord = {};
  isInsertion: boolean;
  isTimeUpdated: boolean;
  packageAssignmentSerialId_Modal: any;
  assignmentAttendanceSerialId_Modal: any;
  totalHours_Modal: any;
  completedHours_Modal: any;
  completedMinutes_Modal: any;
  entryDateTimeMillis_Modal: any;
  entryDate_Modal: any;
  entryTime_Modal: any;
  exitDateTimeMillis_Modal: any;
  exitDate_Modal: any;
  exitTime_Modal: any;
  topicsTaught_Modal: any;
  tutorRemarks_Modal: any;
  punctualityRemarks_Modal: any;
  expertiseRemarks_Modal: any;
  knowledgeRemarks_Modal: any;
  studentRemarks_Modal: any;
  selectedIsClassworkProvidedOptions: any[] = [];
  selectedIsHomeworkProvidedOptions: any[] = [];
  selectedIsTestProvidedOptions: any[] = [];
  selectedTutorPunctualityIndexOptions: any[] = [];
  selectedTutorExpertiseIndexOptions: any[] = [];
  selectedTutorKnowledgeIndexOptions: any[] = [];
  remainingHours: number = null;
  remainingMinutes: number = null;
  isOverdue: boolean = false;
  durationHours: number = null;
  durationMinutes: number = null;
  totalFiles: number = 0;
  classworkFile: any = null;
  classworkFileExists: boolean = false;
  homeworkFile: any = null;
  homeworkFileExists: boolean = false;
  testFile: any = null;
  testFileExists: boolean = false;
  otherFile: any = null;
  otherFileExists: boolean = false;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {    
    this.assignmentAttendanceGridMetaData = null;
  }

  ngOnInit() {
    this.setUpGridMetaData();   
    this.getPackageAssignmentGridRecord(this.packageAssignmentSerialId);  
  }

  private getPackageAssignmentGridRecord(packageAssignmentSerialId: string) {
    this.showFormLoaderMask();
    const data = {
      parentId: packageAssignmentSerialId
    };    
    this.utilityService.makerequest(this, this.onGetPackageAssignmentGridRecord, LcpRestUrls.get_package_assignment_record, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }

  private getAssignmentAttendanceUploadedDocumentCountAndExistence(assignmentAttendanceSerialId: string) {    
    const data = {
      assignmentAttendanceSerialId: assignmentAttendanceSerialId
    };    
    this.utilityService.makerequest(this, this.onGetAssignmentAttendanceUploadedDocumentCountAndExistence, LcpRestUrls.get_assignment_attendance_uploaded_document_count_and_existence, 
                                    'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
  }
  
  onGetPackageAssignmentGridRecord(context: any, response: any) {
    let gridRecordObject: {
      record: GridRecord,
      isError: boolean,
      errorMessage: string,
      responseMessage: string,
      additionalProperties: any     
    } = CommonUtilityFunctions.extractGridRecordObject(response);
    if (!gridRecordObject.isError) {
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['formEditMandatoryDisbaled'];
      context.setUpDataModal(gridRecordObject.record, null, true);
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: gridRecordObject.errorMessage,
        onButtonClicked: () => {
        }
      };
      context.helperService.showAlertDialog(myListener);
    }
  }

  onGetAssignmentAttendanceUploadedDocumentCountAndExistence(context: any, response: any) {
    CommonUtilityFunctions.logOnConsole(response);
    if (response['success']) {
      let assignmentAttendanceUploadedDocumentCountAndExistenceObject = response['recordObject'];
      if (CommonUtilityFunctions.checkObjectAvailability(assignmentAttendanceUploadedDocumentCountAndExistenceObject)) {
        context.totalFiles = assignmentAttendanceUploadedDocumentCountAndExistenceObject['TOTAL_FILES'];
        context.classworkFileExists = CommonUtilityFunctions.decodeTrueFalseFromYN(assignmentAttendanceUploadedDocumentCountAndExistenceObject['CLASSWORK_FILE_EXIST']);
        context.homeworkFileExists = CommonUtilityFunctions.decodeTrueFalseFromYN(assignmentAttendanceUploadedDocumentCountAndExistenceObject['HOMEWORK_FILE_EXIST']);
        context.testFileExists = CommonUtilityFunctions.decodeTrueFalseFromYN(assignmentAttendanceUploadedDocumentCountAndExistenceObject['TEST_FILE_EXIST']);
        context.otherFileExists = CommonUtilityFunctions.decodeTrueFalseFromYN(assignmentAttendanceUploadedDocumentCountAndExistenceObject['OTHER_FILE_EXIST']);
      }
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: response['message'],
        onButtonClicked: () => {
        }
      };
      context.helperService.showAlertDialog(myListener);
    }
  }

  feedAttendance() {
    if (!this.isFormDirty) {
      this.showFormLoaderMask();
      this.setUpDataModal(this.selectedPackageAssignmentRecord, null, true);
    } else {
      this.helperService.showConfirmationDialog({
        message: 'You have unsaved changes on the form do you still want to continue.',
        onOk: () => {
          this.isFormDirty = false;
          this.showFormLoaderMask();
          this.setUpDataModal(this.selectedPackageAssignmentRecord, null, true);
        },
        onCancel: () => {
          const myListener: AlertDialogEvent = {
            isSuccess: false,
            message: 'Action Aborted',
            onButtonClicked: () => {
            }
          };
          this.helperService.showAlertDialog(myListener);
        }
      });
    }
  }

  private setUpDataModal(packageAssignmentRecord: GridRecord, assignmentAttendanceRecord: GridRecord = null, isInsertion: boolean = false) {
    this.editRecordForm = true;
    this.selectedPackageAssignmentRecord = packageAssignmentRecord;
    this.selectedAssignmentAttendanceRecord = assignmentAttendanceRecord;
    this.isTimeUpdated = false;
    this.isInsertion = isInsertion;
    this.assignmentAttendanceUpdatedRecord = {};
    this.packageAssignmentSerialId_Modal = packageAssignmentRecord.getProperty('packageAssignmentSerialId');
    this.totalHours_Modal = packageAssignmentRecord.getProperty('totalHours');
    this.completedHours_Modal = packageAssignmentRecord.getProperty('completedHours');
    this.completedMinutes_Modal = packageAssignmentRecord.getProperty('completedMinutes');
    let remainingTime: {
      remainingHours: number,
      remainingMinutes: number
    } = CommonUtilityFunctions.calculateRemainingHoursMinutesSecondsFromTotalAndCompletedHoursMinutesSeconds(
      packageAssignmentRecord.getProperty('totalHours'), 0, 0,
      packageAssignmentRecord.getProperty('completedHours'),
      packageAssignmentRecord.getProperty('completedMinutes'), 0
    );
    this.remainingHours = remainingTime.remainingHours;
    this.remainingMinutes = remainingTime.remainingMinutes;
    if (CommonUtilityFunctions.checkObjectAvailability(assignmentAttendanceRecord)) {
      this.assignmentAttendanceSerialId_Modal = assignmentAttendanceRecord.getProperty('assignmentAttendanceSerialId');
      this.entryDateTimeMillis_Modal = assignmentAttendanceRecord.getProperty('entryDateTimeMillis');
      this.entryDate_Modal = this.getDateForDateMillisParam(this.entryDateTimeMillis_Modal);
      this.entryTime_Modal = this.getTimeForDateMillisParam(this.entryDateTimeMillis_Modal);
      this.exitDateTimeMillis_Modal = assignmentAttendanceRecord.getProperty('exitDateTimeMillis');
      this.exitDate_Modal = this.getDateForDateMillisParam(this.exitDateTimeMillis_Modal);
      this.exitTime_Modal = this.getTimeForDateMillisParam(this.exitDateTimeMillis_Modal);
      this.durationHours = assignmentAttendanceRecord.getProperty('durationHours');
      this.durationMinutes = assignmentAttendanceRecord.getProperty('durationMinutes');
      this.topicsTaught_Modal = assignmentAttendanceRecord.getProperty('topicsTaught');
      this.selectedIsClassworkProvidedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, assignmentAttendanceRecord.getProperty('isClassworkProvided'));
      this.selectedIsHomeworkProvidedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, assignmentAttendanceRecord.getProperty('isHomeworkProvided'));
      this.selectedIsTestProvidedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, assignmentAttendanceRecord.getProperty('isTestProvided'));
      this.tutorRemarks_Modal = assignmentAttendanceRecord.getProperty('tutorRemarks');
      this.selectedTutorPunctualityIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, assignmentAttendanceRecord.getProperty('tutorPunctualityIndex'));
      this.punctualityRemarks_Modal = assignmentAttendanceRecord.getProperty('punctualityRemarks');
      this.selectedTutorExpertiseIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, assignmentAttendanceRecord.getProperty('tutorExpertiseIndex'));
      this.expertiseRemarks_Modal = assignmentAttendanceRecord.getProperty('expertiseRemarks');
      this.selectedTutorKnowledgeIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, assignmentAttendanceRecord.getProperty('tutorKnowledgeIndex'));
      this.knowledgeRemarks_Modal = assignmentAttendanceRecord.getProperty('knowledgeRemarks');
      this.studentRemarks_Modal = assignmentAttendanceRecord.getProperty('studentRemarks');
      CommonUtilityFunctions.setHTMLInputElementValue('topicsTaught', this.topicsTaught_Modal);
      CommonUtilityFunctions.setHTMLInputElementValue('tutorRemarks', this.tutorRemarks_Modal);
      CommonUtilityFunctions.setHTMLInputElementValue('punctualityRemarks', this.punctualityRemarks_Modal);
      CommonUtilityFunctions.setHTMLInputElementValue('expertiseRemarks', this.expertiseRemarks_Modal);
      CommonUtilityFunctions.setHTMLInputElementValue('knowledgeRemarks', this.knowledgeRemarks_Modal);
      CommonUtilityFunctions.setHTMLInputElementValue('studentRemarks', this.studentRemarks_Modal);
    } else {      
      this.assignmentAttendanceSerialId_Modal = '';
      this.entryDateTimeMillis_Modal = '';
      this.entryDate_Modal = this.getDateForDateMillisParam(new Date().getTime());
      this.entryTime_Modal = this.getTimeForDateMillisParam(new Date().getTime());
      this.exitDateTimeMillis_Modal = '';
      this.exitDate_Modal = this.getDateForDateMillisParam(new Date().getTime());
      this.exitTime_Modal = this.getTimeForDateMillisParam(new Date().getTime() + (1 * 60 * 60 * 1000));
      this.durationHours = 1;
      this.durationMinutes = 0;
      this.topicsTaught_Modal = '';
      this.selectedIsClassworkProvidedOptions = null;
      this.selectedIsHomeworkProvidedOptions = null;
      this.selectedIsTestProvidedOptions = null;
      this.tutorRemarks_Modal = '';
      this.selectedTutorPunctualityIndexOptions = null;
      this.punctualityRemarks_Modal = '';
      this.selectedTutorExpertiseIndexOptions = null;
      this.expertiseRemarks_Modal = '';
      this.selectedTutorKnowledgeIndexOptions = null;
      this.knowledgeRemarks_Modal = '';
      this.studentRemarks_Modal = '';
      this.isOverdue = false;
      this.totalFiles = 0;
      this.classworkFileExists = false;
      this.homeworkFileExists = false;
      this.testFileExists = false;
      this.otherFileExists = false;
      CommonUtilityFunctions.setHTMLInputElementValue('topicsTaught', '');
      CommonUtilityFunctions.setHTMLInputElementValue('tutorRemarks', '');
      CommonUtilityFunctions.setHTMLInputElementValue('punctualityRemarks', '');
      CommonUtilityFunctions.setHTMLInputElementValue('expertiseRemarks', '');
      CommonUtilityFunctions.setHTMLInputElementValue('knowledgeRemarks', '');
      CommonUtilityFunctions.setHTMLInputElementValue('studentRemarks', '');
    }
    setTimeout(() => {
      this.editRecordForm = false;
      this.hideFormLoaderMask();
    }, 500);    
  }

  getDateForDateMillisParam(value: any) {
    return CommonUtilityFunctions.getDateForDateMillisParam(value);
  }

  getTimeForDateMillisParam(value: any) {
    return CommonUtilityFunctions.getTimeForDateMillisParam(value);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.assignmentAttendanceGridObject.init();
      this.assignmentAttendanceGridObject.addExtraParams('packageAssignmentSerialId', this.packageAssignmentSerialId);
    }, 0);
    setTimeout(() => {
      this.assignmentAttendanceGridObject.refreshGridData();
    }, 0);
  }

  attachFile(event: any, type: any) {
    if (type === 'classwork') {
      this.classworkFile = event.target.files[0];
    }
    if (type === 'homework') {
      this.homeworkFile = event.target.files[0];
    }
    if (type === 'test') {
      this.testFile = event.target.files[0];
    }
    if (type === 'other') {
      this.otherFile = event.target.files[0];
    }
  }

  detachAllFiles() {
    this.classworkFile = null;
    this.homeworkFile = null;
    this.testFile = null;    
    this.otherFile = null;   
  }

  detachFile(type: any) {
    if (type === 'classwork') {
      this.classworkFile = null;
    }
    if (type === 'homework') {
      this.homeworkFile = null;
    }
    if (type === 'test') {
      this.testFile = null;
    }
    if (type === 'other') {
      this.otherFile = null;
    }
  }

  removeAssignmentAttendanceDocumentUploadedFile(type: any) {
    this.helperService.showConfirmationDialog({
      message: 'Are you sure you want to remove the "' + type + '" file for Attendance Record ' + this.selectedAssignmentAttendanceRecord.getProperty('assignmentAttendanceSerialId'),
      onOk: () => {
        const data = {
          assignmentAttendanceSerialId: this.selectedAssignmentAttendanceRecord.getProperty('assignmentAttendanceSerialId'),
          documentType: type
        };
        this.showFormLoaderMask();    
        this.utilityService.makerequest(this, this.onRemoveAssignmentAttendanceDocumentUploadedFile, LcpRestUrls.remove_assignment_attendance_document_file, 
                                        'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
      },
      onCancel: () => {
        const myListener: AlertDialogEvent = {
          isSuccess: false,
          message: 'File not removed',
          onButtonClicked: () => {
          }
        };
        this.helperService.showAlertDialog(myListener);
      }
    });
  }

  onRemoveAssignmentAttendanceDocumentUploadedFile(context: any, response: any) {
    CommonUtilityFunctions.logOnConsole(response);
    if (response['success']) {
      let removedDocumentType = response['removedDocumentType'];
      if (CommonUtilityFunctions.checkObjectAvailability(removedDocumentType)) {
        if (removedDocumentType === 'classwork') {
          context.classworkFileExists = false;
        }
        if (removedDocumentType === 'homework') {
          context.homeworkFileExists = false;
        }
        if (removedDocumentType === 'test') {
          context.testFileExists = false;
        }
        if (removedDocumentType === 'other') {
          context.otherFileExists = false;
        }
        const myListener: AlertDialogEvent = {
          isSuccess: true,
          message: 'Successfully removed document',
          onButtonClicked: () => {
          }
        };
        context.helperService.showAlertDialog(myListener);
      }
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: response['message'],
        onButtonClicked: () => {
        }
      };
      context.helperService.showAlertDialog(myListener);
    }
    context.hideFormLoaderMask();
  }

  downloadAssignmentAttendanceDocumentFile(type: any) {
    this.showFormLoaderMask();
    CommonUtilityFunctions.setHTMLInputElementValue('downloadAttendanceDocument-assignmentAttendanceSerialId', this.selectedAssignmentAttendanceRecord.getProperty('assignmentAttendanceSerialId'));
    CommonUtilityFunctions.setHTMLInputElementValue('downloadAttendanceDocument-documentType', type);
    this.utilityService.submitForm('attendanceDocumentDownloadForm', '/rest/sales/downloadAssignmentAttendanceDocumentFile', 'POST');
    setTimeout(() => {
      this.hideFormLoaderMask();
    }, 5000);
  }

  private showFormLoaderMask() {
    this.assignmentAttendanceFormMaskLoaderHidden = false;
  }

  private hideFormLoaderMask() {
    this.assignmentAttendanceFormMaskLoaderHidden = true;
  }

  public getAssignmentAttendanceGridObject(id: string, title: string, restURL: string, collapsed: boolean = false) {
    let grid = {
      id: id,
      title: title,
      collapsed: collapsed,
      store: {
        isStatic: false,
        restURL: restURL
      },
      columns: [{
        id: 'assignmentAttendanceSerialId',
        headerName: 'Attendance Id',
        dataType: 'string',
        mapping: 'assignmentAttendanceSerialId',
        clickEvent: (record: GridRecord, column: Column, gridComponentObject: GridComponent) => {          
          if (!this.isFormDirty) {
            this.showFormLoaderMask();
            this.getAssignmentAttendanceUploadedDocumentCountAndExistence(record.getProperty('assignmentAttendanceSerialId'));
            this.setUpDataModal(this.selectedPackageAssignmentRecord, record);
          } else {
            this.helperService.showConfirmationDialog({
              message: 'You have unsaved changes on the form do you still want to continue.',
              onOk: () => {
                this.isFormDirty = false;
                this.showFormLoaderMask();
                this.getAssignmentAttendanceUploadedDocumentCountAndExistence(record.getProperty('assignmentAttendanceSerialId'));
                this.setUpDataModal(this.selectedPackageAssignmentRecord, record);
              },
              onCancel: () => {
                const myListener: AlertDialogEvent = {
                  isSuccess: false,
                  message: 'Action Aborted',
                  onButtonClicked: () => {
                  }
                };
                this.helperService.showAlertDialog(myListener);
              }
            });
          }
        }
      },{
        id: 'entryDateTimeMillis',
        headerName: 'Entry Date & Time',
        dataType: 'date',
        mapping: 'entryDateTimeMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      },{
        id: 'exitDateTimeMillis',
        headerName: 'Exit Date & Time',
        dataType: 'date',
        mapping: 'exitDateTimeMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      },{
        id: 'durationHours',
        headerName: 'Duration Hours',
        dataType: 'number',
        mapping: 'durationHours'
      },{
        id: 'durationMinutes',
        headerName: 'Duration Minutes',
        dataType: 'number',
        mapping: 'durationMinutes'
      },{
        id: 'topicsTaught',
        headerName: 'Topics Taught',
        dataType: 'string',
        mapping: 'topicsTaught',
        lengthyData: true
      },{
        id: 'isClassworkProvided',
        headerName: 'Classwork Provided',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isClassworkProvided',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'isHomeworkProvided',
        headerName: 'Homework Provided',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isHomeworkProvided',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'isTestProvided',
        headerName: 'Test Provided',
        dataType: 'list',
        filterOptions: CommonFilterOptions.yesNoFilterOptions,
        mapping: 'isTestProvided',
        renderer: GridCommonFunctions.yesNoRenderer
      },{
        id: 'tutorRemarks',
        headerName: 'Tutor Remarks',
        dataType: 'string',
        mapping: 'tutorRemarks',
        lengthyData: true
      },{
        id: 'tutorPunctualityIndex',
        headerName: 'Tutor Punctuality Index',
        dataType: 'list',
        filterOptions: CommonFilterOptions.happinessIndexFilterOptions,
        mapping: 'tutorPunctualityIndex',
        renderer: AdminCommonFunctions.happinessIndexRenderer
      },{
        id: 'punctualityRemarks',
        headerName: 'Punctuality Remarks',
        dataType: 'string',
        mapping: 'punctualityRemarks',
        lengthyData: true
      },{
        id: 'tutorExpertiseIndex',
        headerName: 'Tutor Expertise Index',
        dataType: 'list',
        filterOptions: CommonFilterOptions.happinessIndexFilterOptions,
        mapping: 'tutorExpertiseIndex',
        renderer: AdminCommonFunctions.happinessIndexRenderer
      },{
        id: 'expertiseRemarks',
        headerName: 'Expertise Remarks',
        dataType: 'string',
        mapping: 'expertiseRemarks',
        lengthyData: true
      },{
        id: 'tutorKnowledgeIndex',
        headerName: 'Tutor Knowledge Index',
        dataType: 'list',
        filterOptions: CommonFilterOptions.happinessIndexFilterOptions,
        mapping: 'tutorKnowledgeIndex',
        renderer: AdminCommonFunctions.happinessIndexRenderer
      },{
        id: 'knowledgeRemarks',
        headerName: 'Knowledge Remarks',
        dataType: 'string',
        mapping: 'knowledgeRemarks',
        lengthyData: true
      },{
        id: 'studentRemarks',
        headerName: 'Student Remarks',
        dataType: 'string',
        mapping: 'studentRemarks',
        lengthyData: true
      },{
        id: 'recordLastUpdatedMillis',
        headerName: 'Record Last Updated',
        dataType: 'date',
        mapping: 'recordLastUpdatedMillis',
        renderer: GridCommonFunctions.renderDateFromMillisWithTime
      },{
        id: 'updatedBy',
        headerName: 'Updated By',
        dataType: 'string',
        mapping: 'updatedByName'
      }]
    };
    return grid;    
  }

  public setUpGridMetaData() {
    this.assignmentAttendanceGridMetaData = {
      grid: this.getAssignmentAttendanceGridObject('assignmentAttendanceGrid', 'Attendance', '/rest/sales/assignmentAttendanceList'),
      htmlDomElementId: 'assignment-attendance-grid',
      hidden: false
    };
  }

  private updateClassDuration() {
    const entryDate: HTMLInputElement = <HTMLInputElement>document.getElementById('entryDate');
    const entryTime: HTMLInputElement = <HTMLInputElement>document.getElementById('entryTime');
    const exitDate: HTMLInputElement = <HTMLInputElement>document.getElementById('exitDate');
    const exitTime: HTMLInputElement = <HTMLInputElement>document.getElementById('exitTime');
    let startMillis: number = 0;
    let endMillis: number = 0;
    if (CommonUtilityFunctions.checkObjectAvailability(entryDate) && CommonUtilityFunctions.checkObjectAvailability(entryTime)) {
      let entryDateMillisValueAsNumber: number = CommonUtilityFunctions.checkNonNegativeNumberAvailability(entryDate.valueAsNumber) ? entryDate.valueAsNumber : 0;
      let entryTimeMillisValueAsNumber: number = CommonUtilityFunctions.checkNonNegativeNumberAvailability(entryTime.valueAsNumber) ? entryTime.valueAsNumber : 0;
      if (entryDateMillisValueAsNumber > 0 && entryTimeMillisValueAsNumber > 0) {
        startMillis = entryDateMillisValueAsNumber + entryTimeMillisValueAsNumber;
      }
    }
    if (CommonUtilityFunctions.checkObjectAvailability(exitDate) && CommonUtilityFunctions.checkObjectAvailability(exitTime)) {
      let exitDateMillisValueAsNumber: number = CommonUtilityFunctions.checkNonNegativeNumberAvailability(exitDate.valueAsNumber) ? exitDate.valueAsNumber : 0;
      let exitTimeMillisValueAsNumber: number = CommonUtilityFunctions.checkNonNegativeNumberAvailability(exitTime.valueAsNumber) ? exitTime.valueAsNumber : 0;
      if (exitDateMillisValueAsNumber > 0 && exitTimeMillisValueAsNumber > 0) {
        endMillis = exitDateMillisValueAsNumber + exitTimeMillisValueAsNumber;
      }
    }
    if (startMillis !== 0 && endMillis !== 0) {
      let intervalTime: {
        remainingHours: number,
        remainingMinutes: number,    
        isOverdue: boolean
      } = CommonUtilityFunctions.calculateIntervalHoursMinutesSecondsFromStartMillisecondsAndEndMilliseconds(startMillis, endMillis);
      this.isOverdue = intervalTime.isOverdue;
      if (!this.isOverdue) {
        this.durationHours = intervalTime.remainingHours;
        this.durationMinutes = intervalTime.remainingMinutes;
        if (!this.isInsertion) {
          this.isTimeUpdated = true;
        }
      } else {
        this.durationHours = null;
        this.durationMinutes = null;
      }
    } else {
      this.durationHours = null;
      this.durationMinutes = null;
      this.isOverdue = false;
    }
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  updateAssignmentAttendanceProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.isFormDirty = true;
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.assignmentAttendanceUpdatedRecord, this.selectedAssignmentAttendanceRecord, deselected, isAllOPeration);
    switch (key) {
      case 'entryDateMillis' :
      case 'entryTimeMillis' : 
      case 'exitDateMillis' : 
      case 'exitTimeMillis' : {
          this.updateClassDuration();
          break;
      }
    }
  }

  insertAssignmentAttendanceRecord() {
    if (CommonUtilityFunctions.checkNonNegativeNumberAvailability(this.durationHours) && CommonUtilityFunctions.checkNonNegativeNumberAvailability(this.durationMinutes)) {
      const data = CommonUtilityFunctions.encodedGridFormData(this.assignmentAttendanceUpdatedRecord, this.packageAssignmentSerialId);
      if (this.classworkFile) {
        data.append('inputFileClasswork', this.classworkFile);
      }
      if (this.homeworkFile) {
        data.append('inputFileHomework', this.homeworkFile);
      }
      if (this.testFile) {
        data.append('inputFileTest', this.testFile);
      }
      if (this.otherFile) {
        data.append('inputFileOther', this.otherFile);
      }
      this.showFormLoaderMask();
      this.utilityService.makerequest(this, this.onInsertOrUpdateAssignmentAttendanceRecord, LcpRestUrls.insert_assignment_attendance, 'POST',
        data, 'multipart/form-data', true);
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Please select a valid Class Duration before Inserting Attendance',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);      
    }
  }

  updateAssignmentAttendanceRecord() {
    if (CommonUtilityFunctions.checkNonNegativeNumberAvailability(this.durationHours) && CommonUtilityFunctions.checkNonNegativeNumberAvailability(this.durationMinutes)) {
      CommonUtilityFunctions.updateRecordProperty('packageAssignmentSerialId', this.packageAssignmentSerialId_Modal.toString(), 'direct_value', this.assignmentAttendanceUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('oldEntryDateTimeMillis', this.entryDateTimeMillis_Modal.toString(), 'direct_value', this.assignmentAttendanceUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('oldExitDateTimeMillis', this.exitDateTimeMillis_Modal.toString(), 'direct_value', this.assignmentAttendanceUpdatedRecord, null, null, null);
      if (this.isTimeUpdated) {
        const entryDate: HTMLInputElement = <HTMLInputElement>document.getElementById('entryDate');
        const entryTime: HTMLInputElement = <HTMLInputElement>document.getElementById('entryTime');
        const exitDate: HTMLInputElement = <HTMLInputElement>document.getElementById('exitDate');
        const exitTime: HTMLInputElement = <HTMLInputElement>document.getElementById('exitTime');
        CommonUtilityFunctions.updateRecordProperty('entryDateMillis', entryDate.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceUpdatedRecord, null, null, null);
        CommonUtilityFunctions.updateRecordProperty('entryTimeMillis', entryTime.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceUpdatedRecord, null, null, null);
        CommonUtilityFunctions.updateRecordProperty('exitDateMillis', exitDate.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceUpdatedRecord, null, null, null);
        CommonUtilityFunctions.updateRecordProperty('exitTimeMillis', exitTime.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceUpdatedRecord, null, null, null);
      }
      const data = CommonUtilityFunctions.encodedGridFormData(this.assignmentAttendanceUpdatedRecord, this.assignmentAttendanceSerialId_Modal);
      if (this.classworkFile) {
        data.append('inputFileClasswork', this.classworkFile);
      }
      if (this.homeworkFile) {
        data.append('inputFileHomework', this.homeworkFile);
      }
      if (this.testFile) {
        data.append('inputFileTest', this.testFile);
      }
      if (this.otherFile) {
        data.append('inputFileOther', this.otherFile);
      }
      this.showFormLoaderMask();
      this.utilityService.makerequest(this, this.onInsertOrUpdateAssignmentAttendanceRecord, LcpRestUrls.update_assignment_attendance, 'POST',
        data, 'multipart/form-data', true);
    } else {
      const myListener: AlertDialogEvent = {
        isSuccess: false,
        message: 'Please select a valid Class Duration before Updating Attendance',
        onButtonClicked: () => {
        }
      };
      this.helperService.showAlertDialog(myListener);      
    }
  }

  onInsertOrUpdateAssignmentAttendanceRecord(context: any, response: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    };
    context.helperService.showAlertDialog(myListener);
    if (response['success']) {
      context.editRecordForm = false;
      context.getPackageAssignmentGridRecord(context.packageAssignmentSerialId);
      context.assignmentAttendanceGridObject.refreshGridData();
      context.isFormDirty = false;
    } else {
      context.hideFormLoaderMask();
    }
  }
}
