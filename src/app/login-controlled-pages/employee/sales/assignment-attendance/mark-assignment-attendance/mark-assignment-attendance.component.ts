import { Component, Input, OnInit } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { AssignmentAttendanceMarkingAccess } from '../assignment-attendance.component';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';

@Component({
  selector: 'app-mark-assignment-attendance',
  templateUrl: './mark-assignment-attendance.component.html',
  styleUrls: ['./mark-assignment-attendance.component.css']
})
export class MarkAssignmentAttendanceComponent implements OnInit {

  @Input()
  selectedAssignmentRecord: GridRecord = null;

  @Input()
  assignmentAttendanceMarkingAccess: AssignmentAttendanceMarkingAccess = null;

  @Input()
  selectedRecordGridType: string = null;

  formEditMandatoryDisbaled = true;
  editAttendanceMarkForm = false;

  constructor() { }

  ngOnInit() {
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  updateAssignmentAttendanceProperty(key: string, event: any, data_type: string, deselected: boolean = false, isAllOPeration: boolean = false) {
   // CommonUtilityFunctions.updateRecordProperty(key, event, data_type, this.subscriptionPackageUpdatedRecord, this.subscriptionPackageRecord, deselected, isAllOPeration);
  }

}
