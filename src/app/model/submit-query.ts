import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { PublicApplication } from './public-application';

export class SubmitQuery extends PublicApplication {
	querySerialId: string;
	queryStatus: string;
	emailId: string;
	queryDetails: string;
	registeredTutor: string;
	tutorSerialId: string;
	subscribedCustomer: string;
	customerSerialId: string;
	isContacted: string;
	whoContacted: string;
	queryResponse: string;
	notAnswered: string;
	notAnsweredReason: string;
	whoNotAnswered: string;
	queryRequestedDateMillis: number;
	contactedDateMillis: number;
	recordLastUpdatedMillis: number;
	updatedBy: string;
	whoContactedName: string;
	whoNotAnsweredName: string;
	updatedByName: string;
	isMailSent: string;
	mailSentMillis: number;

  	constructor() {
		super();
	}
  
	setValuesFromGridRecord(record: GridRecord) {
		GridCommonFunctions.setGridRecordPropertiesInCustomObject(record, this);
	}
}
