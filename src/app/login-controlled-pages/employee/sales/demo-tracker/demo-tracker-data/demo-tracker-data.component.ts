import { Component, OnInit, Input } from '@angular/core';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { DemoTrackerModifyAccess } from '../demo-tracker.component';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AppUtilityService } from 'src/app/utils/app-utility.service';
import { HelperService } from 'src/app/utils/helper.service';
import { CommonUtilityFunctions } from 'src/app/utils/common-utility-functions';
import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { LcpRestUrls } from 'src/app/utils/lcp-rest-urls';
import { AlertDialogEvent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-demo-tracker-data',
  templateUrl: './demo-tracker-data.component.html',
  styleUrls: ['./demo-tracker-data.component.css']
})
export class DemoTrackerDataComponent implements OnInit {

  @Input()
  demoTrackerRecord: GridRecord = null;

  @Input()
  demoTrackerModifyAccess: DemoTrackerModifyAccess = null;

  demoTrackerUpdatedRecord = {};

  showEmployeeActionDetails = false;

  mandatoryDisbaled = true;
  superAccessAwarded = false;
  editRecordForm = false;

  singleSelectOptions = CommonFilterOptions.singleSelectOptionsConfiguration;

  multiSelectOptions = CommonFilterOptions.multiSelectOptionsConfiguration;

  demoStatusFilterOptions = CommonFilterOptions.demoStatusFilterOptions;
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

  updateDemoTrackerProperty(key: string, value: string, data_type: string) {
    CommonUtilityFunctions.updateRecordProperty(key, value, data_type, this.demoTrackerUpdatedRecord, this.demoTrackerRecord);
  }

  updateDemoTrackerRecord() {
    const data = CommonUtilityFunctions.encodedGridFormData(this.demoTrackerUpdatedRecord, this.demoTrackerRecord.getProperty('demoTrackerId'));
    this.utilityService.makerequest(this, this.onUpdateDemoTrackerRecord, LcpRestUrls.demo_tracker_update_record, 'POST',
      data, 'multipart/form-data', true);
  }

  onUpdateDemoTrackerRecord(context: any, data: any) {
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
