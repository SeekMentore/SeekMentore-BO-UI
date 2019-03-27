import { GridCommonFunctions } from "../utils/grid/grid-common-functions";
import { GridRecord } from "../utils/grid/grid-record";

export class SubscriptionPackage {
	subscriptionPackageSerialId: string;
	customerSerialId: string;
	customerName: string;
	customerEmail: string;
	customerContactNumber: string;
	tutorSerialId: string;
	tutorName: string;
	tutorEmail: string;
	tutorContactNumber: string;
	tutorMapperSerialId: string;
	tutorMapperQuotedTutorRate: number;
	tutorMapperNegotiatedRateWithTutor: number;
	tutorMapperTutorNegotiationRemarks: string;
	enquirySerialId: string;
	enquirySubject: string;
	enquiryGrade: string;
	enquiryLocation: string;
	enquiryEmail: string;
	enquiryContactNumber: string;
	enquiryAddressDetails: string;
	enquiryAdditionalDetails: string;
	enquiryPreferredTeachingType: string;
	enquiryQuotedClientRate: number;
	enquiryNegotiatedRateWithClient: number;
	enquiryClientNegotiationRemarks: string;
	demoSerialId: string;
	demoClientRemarks: string;
	demoTutorRemarks: string;
	demoClientSatisfiedFromTutor: string;
	demoTutorSatisfiedWithClient: string;
	demoAdminSatisfiedFromTutor: string;
	demoAdminSatisfiedWithClient: string;
	demoNeedPriceNegotiationWithClient: string;
	demoClientNegotiationRemarks: string;
	demoNeedPriceNegotiationWithTutor: string;
	demoTutorNegotiationRemarks: string;
	demoAdminRemarks: string;
	demoNegotiatedOverrideRateWithClient;
	demoNegotiatedOverrideRateWithTutor;
	demoAdminFinalizingRemarks: string;
	createdMillis: number;
	startDateMillis: number;
	finalizedRateForClient: number;
	finalizedRateForTutor: number;
	packageBillingType: string;
	endDateMillis: number;
	isCustomerGrieved: string;
	customerHappinessIndex: string;
	customerRemarks: string;
	isTutorGrieved: string;
	tutorHappinessIndex: string;
	tutorRemarks: string;
	adminRemarks: string;
	additionalDetailsClient: string;
	additionalDetailsTutor: string;
	activatingRemarks: string;
	terminatingRemarks: string;
	actionDateMillis: number;
	whoActed: string;
	whoActedName: string;
	recordLastUpdatedMillis: number;
	updatedBy: string;
	updatedByName: string;
	contractSerialId: string;
	isEnquiryEmailSameAsCustomerEmail: boolean;
	isEnquiryContactNumberSameAsCustomerContactNumber: boolean;

  constructor() {}
  
  setValuesFromGridRecord(record: GridRecord) {
    GridCommonFunctions.setGridRecordPropertiesInCustomObject(record, this);
    this.customerSerialId = record.getProperty('customerId');
    this.tutorSerialId = record.getProperty('tutorId');
	this.enquirySerialId = record.getProperty('enquiryId');
	this.tutorMapperSerialId = record.getProperty('tutorMapperId');
	this.demoSerialId = record.getProperty('demoId');
	this.isEnquiryEmailSameAsCustomerEmail = (this.enquiryEmail === this.customerEmail);
	this.isEnquiryContactNumberSameAsCustomerContactNumber = (this.enquiryContactNumber === this.customerContactNumber);
  }
}
