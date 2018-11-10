import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { MappedTutorScheduleDemoAccess } from '../schedule-demo.component';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-schedule-demo-data',
  templateUrl: './schedule-demo-data.component.html',
  styleUrls: ['./schedule-demo-data.component.css']
})
export class ScheduleDemoDataComponent implements OnInit {

  @Input()
  mappedTutorRecord: GridRecord = null;

  @Input()
  mappedTutorScheduleDemoAccess: MappedTutorScheduleDemoAccess = null;

  scheduleDemoMappedTutorUpdatedRecord = {};

  showTutorDetails = false;
  showTutorContactedDetails = false;
  showClientContactedDetails = false;
  showEmployeeActionDetails = false;

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  studentGradesFilterOptions = CommonFilterOptions.studentGradesFilterOptions;
  subjectsFilterOptions = CommonFilterOptions.subjectsFilterOptions;
  locationsFilterOptions = CommonFilterOptions.locationsFilterOptions;
  preferredTeachingTypeFilterOptions = CommonFilterOptions.preferredTeachingTypeFilterOptions;
  matchStatusFilterOptions = CommonFilterOptions.matchStatusFilterOptions;
  mappingStatusFilterOptions = CommonFilterOptions.mappingStatusFilterOptions;
  yesNoFilterOptions = CommonFilterOptions.yesNoFilterOptions;

  constructor(private utilityService: AppUtilityService, private helperService: HelperService) { }

  ngOnInit() {
  }

  getDateFromMillis(millis: number) {
    return CommonUtilityFunctions.getDateStringInDDMMYYYYHHmmSS(millis);
  }

  getLookupRendererFromValue(value: any, lookupList: any []) {
    return GridCommonFunctions.lookupRendererForValue(value, lookupList);
  }

  updateScheduleDemoMappedTutorProperty(key: string, value: string, data_type: string) {
    CommonUtilityFunctions.updateRecordProperty(key, value, data_type, this.scheduleDemoMappedTutorUpdatedRecord, this.mappedTutorRecord);
  }

  updateScheduleDemoMappedTutorRecord() {
    const data = this.helperService.encodedGridFormData(this.scheduleDemoMappedTutorUpdatedRecord, this.mappedTutorRecord.getProperty('tutorMapperId'));
    this.utilityService.makerequest(this, this.onUpdateScheduleDemoMappedTutorRecord, LcpRestUrls.schedule_demo_mapped_tutor_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateScheduleDemoMappedTutorRecord(context: any, data: any) {
    const myListener: AlertDialogEvent = {
      isSuccess: data['success'],
      message: data['message'],
      onButtonClicked: () => {
      }
    };
    this.helperService.showAlertDialog(myListener);
    if (data['success']) {
      this.editRecordForm = false;
    }
  }

}
