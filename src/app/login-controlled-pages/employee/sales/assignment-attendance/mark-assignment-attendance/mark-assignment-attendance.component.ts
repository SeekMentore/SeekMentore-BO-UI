import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { AppConstants } from 'src/app/utils/app-constants';
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
import { PackageAssignment } from 'src/app/model/package-assignment';
import { AssignmentAttendance } from 'src/app/model/assignment-attendance';

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

  assignmentAttendanceInsertedOrUpdatedRecord = {};

  formEditMandatoryDisbaled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;
  happinessIndexFilterOptions = CommonFilterOptions.happinessIndexFilterOptions;

  isRecordUpdateFormDirty: boolean = false;
  assignmentAttendanceFormMaskLoaderHidden: boolean = true;
  showRecordUpdateForm: boolean = false;
  showRecordUpdateEditControlSection: boolean = false;
  documentRemovalAccess: boolean = false;
  showRecordInsertButton: boolean = false;
  showRecordUpdateButton: boolean = false;

  dirtyFlagList: string[] = ['RECORD_INSERT_UPDATE'];

  isInsertion: boolean;
  isTimeUpdated: boolean;
  
  // Modal Properties
  packageAssignmentRecord: PackageAssignment;
  assignmentAttendanceRecord: AssignmentAttendance;
  assignmentAttendanceSerialId: string = null;
  assignmentAttendanceRecordLastUpdatedDateDisplayTime: string = null;
  entryDateInputParam: any;
  entryTimeInputParam: any;
  exitDateInputParam: any;
  exitTimeInputParam: any;
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
    this.packageAssignmentRecord = new PackageAssignment();
    this.assignmentAttendanceRecord = new AssignmentAttendance();
  }

  ngOnInit() {
    this.setUpGridMetaData();   
    this.getPackageAssignmentGridRecord(this.packageAssignmentSerialId);  
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.assignmentAttendanceGridObject.init();
      this.assignmentAttendanceGridObject.addExtraParams('packageAssignmentSerialId', this.packageAssignmentSerialId);
    }, 100);
    setTimeout(() => {
      this.assignmentAttendanceGridObject.refreshGridData();
    }, 100);
  }

  private showRecordUpdateFormLoaderMask() {
    this.assignmentAttendanceFormMaskLoaderHidden = false;
  }

  private hideRecordUpdateFormLoaderMask() {
    this.assignmentAttendanceFormMaskLoaderHidden = true;
  }

  public setRecordUpdateFormEditStatus(isEditable: boolean) {
    this.editRecordForm = isEditable;
    this.setSectionShowParams();
  }

  private setSectionShowParams() {
    this.showRecordUpdateForm = this.assignmentAttendanceMarkingAccess.assignmentAttendanceMarkingAccess 
                      && (!this.formEditMandatoryDisbaled || (this.formEditMandatoryDisbaled && CommonUtilityFunctions.checkStringAvailability(this.assignmentAttendanceSerialId)));
    this.showRecordUpdateEditControlSection = this.assignmentAttendanceMarkingAccess.assignmentAttendanceMarkingAccess && !this.formEditMandatoryDisbaled;
    this.documentRemovalAccess = !this.formEditMandatoryDisbaled;
    this.showRecordInsertButton = this.showRecordUpdateEditControlSection && this.editRecordForm && this.isInsertion; 
    this.showRecordUpdateButton = this.showRecordUpdateEditControlSection && this.editRecordForm && !this.isInsertion; 
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
          case 'RECORD_INSERT_UPDATE' : {
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
          case 'RECORD_INSERT_UPDATE' : {
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
          case 'RECORD_INSERT_UPDATE' : {
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
          case 'RECORD_INSERT_UPDATE' : {
            this.isRecordUpdateFormDirty = true;
            break;
          }
        }
      });
    }
  }

  private getPackageAssignmentGridRecord(packageAssignmentSerialId: string) {
    this.showRecordUpdateFormLoaderMask();
    const data = {
      parentSerialId: packageAssignmentSerialId
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
      context.formEditMandatoryDisbaled = gridRecordObject.additionalProperties['assignmentMarkAndUpdateAttendanceFormEditDisbaled'];
      context.setUpDataModal(gridRecordObject.record, null, true);
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
      context.helperService.showAlertDialog({
        isSuccess: false,
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    }
  }

  private setUpPackageAssignmentDataModalFromRecord(packageAssignmentRecord: PackageAssignment, isInsertion: boolean) {
    this.packageAssignmentRecord = packageAssignmentRecord;
    this.packageAssignmentSerialId = this.packageAssignmentRecord.packageAssignmentSerialId;
    this.isTimeUpdated = false;
    this.isInsertion = isInsertion;
    this.assignmentAttendanceInsertedOrUpdatedRecord = {};
    let remainingTime: {
      remainingHours: number,
      remainingMinutes: number
    } = CommonUtilityFunctions.calculateRemainingHoursMinutesSecondsFromTotalAndCompletedHoursMinutesSeconds(
      this.packageAssignmentRecord.totalHours, 0, 0,
      this.packageAssignmentRecord.completedHours,
      this.packageAssignmentRecord.completedMinutes, 0
    );
    this.remainingHours = remainingTime.remainingHours;
    this.remainingMinutes = remainingTime.remainingMinutes;
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  private setUpAssignmentAttendanceDataModalFromRecord(assignmentAttendanceRecord: AssignmentAttendance) {
    if (CommonUtilityFunctions.checkObjectAvailability(assignmentAttendanceRecord)) {
      this.assignmentAttendanceRecord = assignmentAttendanceRecord;
      this.assignmentAttendanceSerialId = this.assignmentAttendanceRecord.assignmentAttendanceSerialId;
      this.durationHours = this.assignmentAttendanceRecord.durationHours;
      this.durationMinutes = this.assignmentAttendanceRecord.durationMinutes;
      this.entryDateInputParam = CommonUtilityFunctions.getDateForDateMillisParam(this.assignmentAttendanceRecord.entryDateTimeMillis);
      this.entryTimeInputParam = CommonUtilityFunctions.getTimeForDateMillisParam(this.assignmentAttendanceRecord.entryDateTimeMillis);
      this.exitDateInputParam = CommonUtilityFunctions.getDateForDateMillisParam(this.assignmentAttendanceRecord.exitDateTimeMillis);
      this.exitTimeInputParam = CommonUtilityFunctions.getTimeForDateMillisParam(this.assignmentAttendanceRecord.exitDateTimeMillis);
      this.assignmentAttendanceRecordLastUpdatedDateDisplayTime = CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(this.assignmentAttendanceRecord.recordLastUpdatedMillis);
      this.selectedIsClassworkProvidedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.assignmentAttendanceRecord.isClassworkProvided);
      this.selectedIsHomeworkProvidedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.assignmentAttendanceRecord.isHomeworkProvided);
      this.selectedIsTestProvidedOptions = CommonUtilityFunctions.getSelectedFilterItems(this.yesNoFilterOptions, this.assignmentAttendanceRecord.isTestProvided);
      this.selectedTutorPunctualityIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.assignmentAttendanceRecord.tutorPunctualityIndex);
      this.selectedTutorExpertiseIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.assignmentAttendanceRecord.tutorExpertiseIndex);
      this.selectedTutorKnowledgeIndexOptions = CommonUtilityFunctions.getSelectedFilterItems(this.happinessIndexFilterOptions, this.assignmentAttendanceRecord.tutorKnowledgeIndex);
      CommonUtilityFunctions.setHTMLInputElementValue('topicsTaught', this.assignmentAttendanceRecord.topicsTaught);
      CommonUtilityFunctions.setHTMLInputElementValue('tutorRemarks', this.assignmentAttendanceRecord.tutorRemarks);
      CommonUtilityFunctions.setHTMLInputElementValue('punctualityRemarks', this.assignmentAttendanceRecord.punctualityRemarks);
      CommonUtilityFunctions.setHTMLInputElementValue('expertiseRemarks', this.assignmentAttendanceRecord.expertiseRemarks);
      CommonUtilityFunctions.setHTMLInputElementValue('knowledgeRemarks', this.assignmentAttendanceRecord.knowledgeRemarks);
      CommonUtilityFunctions.setHTMLInputElementValue('studentRemarks', this.assignmentAttendanceRecord.studentRemarks);
    } else {
      this.assignmentAttendanceRecord = new AssignmentAttendance();
      this.assignmentAttendanceRecord.assignmentAttendanceSerialId = '';
      this.assignmentAttendanceSerialId = this.assignmentAttendanceRecord.assignmentAttendanceSerialId;      
      this.entryDateInputParam = CommonUtilityFunctions.getDateForDateMillisParam(new Date().getTime());
      this.entryTimeInputParam = CommonUtilityFunctions.getTimeForDateMillisParam(new Date().getTime());
      this.exitDateInputParam = CommonUtilityFunctions.getDateForDateMillisParam(new Date().getTime());
      this.exitTimeInputParam = CommonUtilityFunctions.getTimeForDateMillisParam(new Date().getTime() + (1 * 60 * 60 * 1000));
      this.durationHours = 1;
      this.durationMinutes = 0;
      this.assignmentAttendanceRecord.topicsTaught = '';
      this.selectedIsClassworkProvidedOptions = null;
      this.selectedIsHomeworkProvidedOptions = null;
      this.selectedIsTestProvidedOptions = null;
      this.assignmentAttendanceRecord.tutorRemarks = '';
      this.selectedTutorPunctualityIndexOptions = null;
      this.assignmentAttendanceRecord.punctualityRemarks = '';
      this.selectedTutorExpertiseIndexOptions = null;
      this.assignmentAttendanceRecord.expertiseRemarks = '';
      this.selectedTutorKnowledgeIndexOptions = null;
      this.assignmentAttendanceRecord.knowledgeRemarks = '';
      this.assignmentAttendanceRecord.studentRemarks = '';
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
    this.detachAllFiles();
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);
  }

  private setUpDataModal(packageAssignmentGridRecord: GridRecord, assignmentAttendanceGridRecord: GridRecord = null, isInsertion: boolean = false) {
    this.packageAssignmentRecord.setValuesFromGridRecord(packageAssignmentGridRecord);
    this.setUpPackageAssignmentDataModalFromRecord(this.packageAssignmentRecord, isInsertion);
    if (CommonUtilityFunctions.checkObjectAvailability(assignmentAttendanceGridRecord)) {
      this.assignmentAttendanceRecord.setValuesFromGridRecord(assignmentAttendanceGridRecord);
      this.setUpAssignmentAttendanceDataModalFromRecord(this.assignmentAttendanceRecord);
    } else {
      this.setUpAssignmentAttendanceDataModalFromRecord(null);
    }
    setTimeout(() => {
      this.editRecordForm = false;
      this.setSectionShowParams();
      this.hideRecordUpdateFormLoaderMask();
    }, 500);    
  } 

  feedAttendance() {
    if (!this.isFlagListDirty()) {
      this.showRecordUpdateFormLoaderMask();
      this.setUpPackageAssignmentDataModalFromRecord(this.packageAssignmentRecord, true);
      this.setUpAssignmentAttendanceDataModalFromRecord(null);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.showRecordUpdateFormLoaderMask();
          this.setUpPackageAssignmentDataModalFromRecord(this.packageAssignmentRecord, true);
          this.setUpAssignmentAttendanceDataModalFromRecord(null);
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
    this.setFlagListDirty(false, ['RECORD_INSERT_UPDATE']);
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
      message: 'Are you sure you want to remove the "' + type + '" file for Attendance Record ' + this.assignmentAttendanceSerialId,
      onOk: () => {
        const data = {
          assignmentAttendanceSerialId: this.assignmentAttendanceSerialId,
          documentType: type
        };
        this.showRecordUpdateFormLoaderMask();    
        this.utilityService.makerequest(this, this.onRemoveAssignmentAttendanceDocumentUploadedFile, LcpRestUrls.remove_assignment_attendance_document_file, 
                                        'POST', this.utilityService.urlEncodeData(data), 'application/x-www-form-urlencoded');
      },
      onCancel: () => {
        this.helperService.showAlertDialog({
          isSuccess: false,
          message: 'File not removed',
          onButtonClicked: () => {
          }
        });
      }
    });
  }

  onRemoveAssignmentAttendanceDocumentUploadedFile(context: any, response: any) {
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
        context.helperService.showAlertDialog({
          isSuccess: true,
          message: 'Successfully removed document',
          onButtonClicked: () => {
          }
        });
      }
    } else {
      context.helperService.showAlertDialog({
        isSuccess: false,
        message: response['message'],
        onButtonClicked: () => {
        }
      });
    }
    context.hideRecordUpdateFormLoaderMask();
  }

  downloadAssignmentAttendanceDocumentFile(type: any) {
    this.showRecordUpdateFormLoaderMask();
    CommonUtilityFunctions.setHTMLInputElementValue('downloadAttendanceDocument-assignmentAttendanceSerialId', this.assignmentAttendanceSerialId);
    CommonUtilityFunctions.setHTMLInputElementValue('downloadAttendanceDocument-documentType', type);
    this.utilityService.submitForm('attendanceDocumentDownloadForm', '/rest/sales/downloadAssignmentAttendanceDocumentFile', 'POST');
    setTimeout(() => {
      this.hideRecordUpdateFormLoaderMask();
    }, 5000);
  }

  downloadAssignmentAttendanceAllDocuments() {
    if (this.totalFiles > 0) {
      this.showRecordUpdateFormLoaderMask();
      CommonUtilityFunctions.setHTMLInputElementValue('downloadAttendanceDocument-assignmentAttendanceSerialId', this.assignmentAttendanceSerialId);
      this.utilityService.submitForm('attendanceDocumentDownloadForm', '/rest/sales/downloadAssignmentAttendanceAllDocuments', 'POST');
      setTimeout(() => {
        this.hideRecordUpdateFormLoaderMask();
      }, (this.totalFiles * 5000));
    } else {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: 'No files are present for this Attendance Record',
        onButtonClicked: () => {
        }
      });
    }
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
          if (!this.isFlagListDirty()) {
            this.showRecordUpdateFormLoaderMask();
            this.getAssignmentAttendanceUploadedDocumentCountAndExistence(column.getValueForColumn(record));
            this.setUpPackageAssignmentDataModalFromRecord(this.packageAssignmentRecord, false);
            this.assignmentAttendanceRecord.setValuesFromGridRecord(record);
            this.setUpAssignmentAttendanceDataModalFromRecord(this.assignmentAttendanceRecord);
          } else {
            this.helperService.showConfirmationDialog({
              message: this.getConfirmationMessageForFormsDirty(),
              onOk: () => {
                this.setFlagListNotDirty();
                this.showRecordUpdateFormLoaderMask();
                this.getAssignmentAttendanceUploadedDocumentCountAndExistence(column.getValueForColumn(record));
                this.setUpPackageAssignmentDataModalFromRecord(this.packageAssignmentRecord, false);
                this.assignmentAttendanceRecord.setValuesFromGridRecord(record);
                this.setUpAssignmentAttendanceDataModalFromRecord(this.assignmentAttendanceRecord);
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

  updateAssignmentAttendanceProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
    this.setFlagListDirty(false, ['RECORD_INSERT_UPDATE']);
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.assignmentAttendanceInsertedOrUpdatedRecord, this.assignmentAttendanceRecord, deselected, isAllOPeration);
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
      CommonUtilityFunctions.updateRecordProperty(null, null, 'predefined_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null, AppConstants.VARIABLE_LOCAL_TZ_OFFSET_MS);
      const entryDate: HTMLInputElement = <HTMLInputElement>document.getElementById('entryDate');
      const entryTime: HTMLInputElement = <HTMLInputElement>document.getElementById('entryTime');
      const exitDate: HTMLInputElement = <HTMLInputElement>document.getElementById('exitDate');
      const exitTime: HTMLInputElement = <HTMLInputElement>document.getElementById('exitTime');
      CommonUtilityFunctions.updateRecordProperty('entryDateMillis', entryDate.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('entryTimeMillis', entryTime.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('exitDateMillis', exitDate.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('exitTimeMillis', exitTime.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
      const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.assignmentAttendanceInsertedOrUpdatedRecord, this.packageAssignmentSerialId);
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
      this.showRecordUpdateFormLoaderMask();
      this.utilityService.makerequest(this, this.onInsertOrUpdateAssignmentAttendanceRecord, LcpRestUrls.insert_assignment_attendance, 'POST',
        data, 'multipart/form-data', true);
    } else {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: 'Please select a valid Class Duration before Inserting Attendance',
        onButtonClicked: () => {
        }
      });      
    }
  }

  updateAssignmentAttendanceRecord() {
    if (CommonUtilityFunctions.checkNonNegativeNumberAvailability(this.durationHours) && CommonUtilityFunctions.checkNonNegativeNumberAvailability(this.durationMinutes)) {
      CommonUtilityFunctions.updateRecordProperty('packageAssignmentSerialId', this.packageAssignmentSerialId.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('oldEntryDateTimeMillis', this.assignmentAttendanceRecord.entryDateTimeMillis.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
      CommonUtilityFunctions.updateRecordProperty('oldExitDateTimeMillis', this.assignmentAttendanceRecord.exitDateTimeMillis.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
      if (this.isTimeUpdated) {
        const entryDate: HTMLInputElement = <HTMLInputElement>document.getElementById('entryDate');
        const entryTime: HTMLInputElement = <HTMLInputElement>document.getElementById('entryTime');
        const exitDate: HTMLInputElement = <HTMLInputElement>document.getElementById('exitDate');
        const exitTime: HTMLInputElement = <HTMLInputElement>document.getElementById('exitTime');
        CommonUtilityFunctions.updateRecordProperty('entryDateMillis', entryDate.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
        CommonUtilityFunctions.updateRecordProperty('entryTimeMillis', entryTime.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
        CommonUtilityFunctions.updateRecordProperty('exitDateMillis', exitDate.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
        CommonUtilityFunctions.updateRecordProperty('exitTimeMillis', exitTime.valueAsNumber.toString(), 'direct_value', this.assignmentAttendanceInsertedOrUpdatedRecord, null, null, null);
      }
      const data = CommonUtilityFunctions.encodeFormDataToUpdatedJSONWithParentSerialId(this.assignmentAttendanceInsertedOrUpdatedRecord, this.assignmentAttendanceSerialId);
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
      this.showRecordUpdateFormLoaderMask();
      this.utilityService.makerequest(this, this.onInsertOrUpdateAssignmentAttendanceRecord, LcpRestUrls.update_assignment_attendance, 'POST',
        data, 'multipart/form-data', true);
    } else {
      this.helperService.showAlertDialog({
        isSuccess: false,
        message: 'Please select a valid Class Duration before Updating Attendance',
        onButtonClicked: () => {
        }
      });      
    }
  }

  onInsertOrUpdateAssignmentAttendanceRecord(context: any, response: any) {
    context.helperService.showAlertDialog({
      isSuccess: response['success'],
      message: response['message'],
      onButtonClicked: () => {
      }
    });
    if (response['success']) {
      context.editRecordForm = false;
      context.getPackageAssignmentGridRecord(context.packageAssignmentSerialId);
      context.assignmentAttendanceGridObject.refreshGridData();
      context.setFlagListNotDirty();
    } else {
      context.hideRecordUpdateFormLoaderMask();
    }
  }

  resetAssignmentAttendanceRecord() {
    if (!this.isFlagListDirty()) {
      this.showRecordUpdateFormLoaderMask();
      this.getAssignmentAttendanceUploadedDocumentCountAndExistence(this.assignmentAttendanceSerialId);
      this.setUpPackageAssignmentDataModalFromRecord(this.packageAssignmentRecord, false);
      this.setUpAssignmentAttendanceDataModalFromRecord(this.assignmentAttendanceRecord);
    } else {
      this.helperService.showConfirmationDialog({
        message: this.getConfirmationMessageForFormsDirty(),
        onOk: () => {
          this.setFlagListNotDirty();
          this.showRecordUpdateFormLoaderMask();
          this.getAssignmentAttendanceUploadedDocumentCountAndExistence(this.assignmentAttendanceSerialId);
          this.setUpPackageAssignmentDataModalFromRecord(this.packageAssignmentRecord, false);
          this.setUpAssignmentAttendanceDataModalFromRecord(this.assignmentAttendanceRecord);
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
