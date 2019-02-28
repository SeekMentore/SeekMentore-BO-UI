import { Component, Input, OnInit } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AssignmentAttendanceMarkingAccess } from '../assignment-attendance.component';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-mark-assignment-attendance',
  templateUrl: './mark-assignment-attendance.component.html',
  styleUrls: ['./mark-assignment-attendance.component.css']
})
export class MarkAssignmentAttendanceComponent implements OnInit {

  @Input()
  packageAssignmentRecord: GridRecord = null;

  @Input()
  assignmentAttendanceMarkingAccess: AssignmentAttendanceMarkingAccess = null;

  @Input()
  selectedRecordGridType: string = null;

  assignmentAttendanceUpdatedRecord = {};

  formEditMandatoryDisbaled = true;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;
  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;
  happinessIndexFilterOptions = CommonFilterOptions.happinessIndexFilterOptions;

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
  // Documents to be attached
  classwork: any = null;
  homework: any = null;
  test: any = null;
  other: any = null;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) {    
  }

  ngOnInit() {
    this.calculateRemainingDuration();
    this.setDisabledStatus();
  }

  private setDisabledStatus() {
    if (this.selectedRecordGridType === 'startedAssignmentGrid') {
      this.formEditMandatoryDisbaled = false;
    }
  }

  attachFile(event: any, type: any) {
    if (type === 'classwork') {
      this.classwork = event.target.files[0];
    }
    if (type === 'homework') {
      this.homework = event.target.files[0];
    }
    if (type === 'test') {
      this.test = event.target.files[0];
    }
    if (type === 'other') {
      this.other = event.target.files[0];
    }
  }

  detachAllFiles() {
    this.classwork = null;
    this.homework = null;
    this.test = null;    
    this.other = null;   
  }

  detachFile(type: any) {
    if (type === 'classwork') {
      this.classwork = null;
    }
    if (type === 'homework') {
      this.homework = null;
    }
    if (type === 'test') {
      this.test = null;
    }
    if (type === 'other') {
      this.other = null;
    }
  }

  private calculateRemainingDuration() {
    let remainingTime: {
      remainingHours: number,
      remainingMinutes: number
    } = CommonUtilityFunctions.calculateRemainingHoursMinutesSecondsFromTotalAndCompletedHoursMinutesSeconds(
      this.packageAssignmentRecord.getProperty('totalHours'), 0, 0,
      this.packageAssignmentRecord.getProperty('completedHours'),
      this.packageAssignmentRecord.getProperty('completedMinutes'), 0
    );
    this.remainingHours = remainingTime.remainingHours;
    this.remainingMinutes = remainingTime.remainingMinutes;
  }

  private updateClassDuration() {
    const entryDateMillis: HTMLInputElement = <HTMLInputElement>document.getElementById('entryDateMillis');
    const entryTimeMillis: HTMLInputElement = <HTMLInputElement>document.getElementById('entryTimeMillis');
    const exitDateMillis: HTMLInputElement = <HTMLInputElement>document.getElementById('exitDateMillis');
    const exitTimeMillis: HTMLInputElement = <HTMLInputElement>document.getElementById('exitTimeMillis');
    let startMillis: number = 0;
    let endMillis: number = 0;
    if (CommonUtilityFunctions.checkObjectAvailability(entryDateMillis) && CommonUtilityFunctions.checkObjectAvailability(entryTimeMillis)) {
      let entryDateMillisValueAsNumber: number = CommonUtilityFunctions.checkNonNegativeNumberAvailability(entryDateMillis.valueAsNumber) ? entryDateMillis.valueAsNumber : 0;
      let entryTimeMillisValueAsNumber: number = CommonUtilityFunctions.checkNonNegativeNumberAvailability(entryTimeMillis.valueAsNumber) ? entryTimeMillis.valueAsNumber : 0;
      if (entryDateMillisValueAsNumber > 0 && entryTimeMillisValueAsNumber > 0) {
        startMillis = entryDateMillisValueAsNumber + entryTimeMillisValueAsNumber;
      }
    }
    if (CommonUtilityFunctions.checkObjectAvailability(exitDateMillis) && CommonUtilityFunctions.checkObjectAvailability(exitTimeMillis)) {
      let exitDateMillisValueAsNumber: number = CommonUtilityFunctions.checkNonNegativeNumberAvailability(exitDateMillis.valueAsNumber) ? exitDateMillis.valueAsNumber : 0;
      let exitTimeMillisValueAsNumber: number = CommonUtilityFunctions.checkNonNegativeNumberAvailability(exitTimeMillis.valueAsNumber) ? exitTimeMillis.valueAsNumber : 0;
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
    CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.assignmentAttendanceUpdatedRecord, this.packageAssignmentRecord, deselected, isAllOPeration);
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
      const data = CommonUtilityFunctions.encodedGridFormData(this.assignmentAttendanceUpdatedRecord, this.packageAssignmentRecord.getProperty('packageAssignmentSerialId'));
      data.append('durationHours', this.durationHours.toString());
      data.append('durationMinutes', this.durationMinutes.toString());
      if (this.classwork) {
        data.append('inputFileClasswork', this.classwork);
      }
      if (this.homework) {
        data.append('inputFileHomework', this.homework);
      }
      if (this.test) {
        data.append('inputFileTest', this.test);
      }
      if (this.test) {
        data.append('inputFileOther', this.other);
      }
      this.utilityService.makerequest(this, this.onInsertAssignmentAttendanceRecord, LcpRestUrls.insert_assignment_attendance, 'POST',
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

  onInsertAssignmentAttendanceRecord(context: any, data: any) {
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
