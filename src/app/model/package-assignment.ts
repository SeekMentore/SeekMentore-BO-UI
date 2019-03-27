import { GridCommonFunctions } from "../utils/grid/grid-common-functions";
import { GridRecord } from "../utils/grid/grid-record";

export class PackageAssignment {
  packageAssignmentSerialId: string;
	subscriptionPackageSerialId: string;
	createdMillis: number;
	startDateMillis: number;
	totalHours: number;
	completedHours: number;
	completedMinutes: number;
	endDateMillis: number;
	isCustomerGrieved: string;
	customerHappinessIndex: string;
	customerRemarks: string;
	isTutorGrieved: string;
	tutorHappinessIndex: string;
	tutorRemarks: string;
	adminRemarks: string;
	actionDateMillis: number;
	whoActed: string;
	whoActedName: string;
	recordLastUpdatedMillis: number;
	updatedBy: string;
	updatedByName: string;
	customerSerialId: string;
	customerName: string;
	customerEmail: string;
	customerContactNumber: string;
	tutorSerialId: string;
	tutorName: string;
	tutorEmail: string;
	tutorContactNumber: string;
	enquirySerialId: string;
	enquirySubject: string;
	enquiryGrade: string;
	enquiryEmail: string;
  enquiryContactNumber: string;

  constructor() {}
  
  setValuesFromGridRecord(record: GridRecord) {
    GridCommonFunctions.setGridRecordPropertiesInCustomObject(record, this);
    this.customerSerialId = record.getProperty('customerId');
    this.tutorSerialId = record.getProperty('tutorId');
    this.enquirySerialId = record.getProperty('enquiryId');
  }
}
