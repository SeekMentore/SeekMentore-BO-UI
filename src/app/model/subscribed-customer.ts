import { GridCommonFunctions } from "../utils/grid/grid-common-functions";
import { GridRecord } from "../utils/grid/grid-record";
import { User } from "./user";

export class SubscribedCustomer extends User {
	customerSerialId: string;
	findTutorSerialId: string;
	studentGrades: string;
	interestedSubjects: string;
	location: string;
	additionalDetails: string;
	addressDetails: string;
	isBlacklisted: string;
	blacklistedRemarks: string;
	blacklistedDateMillis: number;
	whoBlacklisted: string;
	whoBlacklistedName: string;
	unblacklistedRemarks: string;
	unblacklistedDateMillis: number;
	whoUnBlacklisted: string;
	whoUnBlacklistedName: string;

  constructor() {
		super();
	}
  
  setValuesFromGridRecord(record: GridRecord) {
		GridCommonFunctions.setGridRecordPropertiesInCustomObject(record, this);
  }
}
