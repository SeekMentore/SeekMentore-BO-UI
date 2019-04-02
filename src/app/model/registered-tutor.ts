import { GridCommonFunctions } from "../utils/grid/grid-common-functions";
import { GridRecord } from "../utils/grid/grid-record";
import { User } from "./user";

export class RegisteredTutor extends User {
	tutorSerialId: string;
	becomeTutorSerialId: string;
	dateOfBirth: any;
	gender: string;
	qualification: string;
	primaryProfession: string;
	transportMode: string;
	teachingExp: number;
	interestedStudentGrades: string;
	interestedSubjects: string;
	comfortableLocations: string;
	additionalDetails: string;
	preferredTeachingType: string;
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
