import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { PublicApplication } from './public-application';

export class BecomeTutor extends PublicApplication {
	becomeTutorSerialId: string;
	applicationStatus: string;
	dateOfBirth: any; // Date signature property
	contactNumber: string;
	emailId: string;
	firstName: string;
	lastName: string;
	gender: string;
	qualification: string;
	primaryProfession: string;
	transportMode: string;
	teachingExp: number;
	studentGrade: string;
	subjects: string;
	locations: string;
	preferredTimeToCall: string;
	additionalDetails: string;
	isContacted: string;
	whoContacted: string;
	contactedRemarks: string;
	isAuthenticationVerified: string;
	whoVerified: string;
	verificationRemarks: string;
	isToBeRecontacted: string;
	whoSuggestedForRecontact: string;
	suggestionRemarks: string;
	whoRecontacted: string;
	recontactedRemarks: string;
	isSelected: string;
	whoSelected: string;
	selectionRemarks: string;
	isRejected: string;
	whoRejected: string;
	rejectionRemarks: string;
	rejectionCount;
	reference: string;
	preferredTeachingType: string;
	reApplied: string;
	addressDetails: string;
	applicationDateMillis: number;
	contactedDateMillis: number;
	verificationDateMillis: number;
	suggestionDateMillis: number;
	recontactedDateMillis: number;
	selectionDateMillis: number;
	rejectionDateMillis: number;
	previousApplicationDateMillis: number;
	recordLastUpdatedMillis: number;
	updatedBy: string;
	whoContactedName: string;
	whoVerifiedName: string;
	whoSuggestedForRecontactName: string;
	whoRecontactedName: string;
	whoSelectedName: string;
	whoRejectedName: string;
	updatedByName: string;
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
