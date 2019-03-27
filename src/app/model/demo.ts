import { GridCommonFunctions } from "../utils/grid/grid-common-functions";
import { GridRecord } from "../utils/grid/grid-record";

export class Demo {
	demoSerialId: string;
	tutorMapperSerialId: string;
	demoDateAndTimeMillis: number;
	demoOccurred: string;
	demoStatus: string;
	clientRemarks: string;
	tutorRemarks: string;
	clientSatisfiedFromTutor: string;
	tutorSatisfiedWithClient: string;
	adminSatisfiedFromTutor: string;
	adminSatisfiedWithClient: string;
	whoActed: string;
	whoActedName: string;
	isDemoSuccess: string;
	needPriceNegotiationWithClient: string;
	clientNegotiationRemarks: string;
	needPriceNegotiationWithTutor: string;
	tutorNegotiationRemarks: string;
	adminRemarks: string;
	negotiatedOverrideRateWithClient: number;
	negotiatedOverrideRateWithTutor: number;
	adminActionDateMillis: number;
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
	enquiryLocation: string;
	enquiryAddressDetails: string;
	enquiryAdditionalDetails: string;
	enquiryPreferredTeachingType: string;
	enquiryQuotedClientRate: number;
	enquiryNegotiatedRateWithClient: number;
	enquiryClientNegotiationRemarks: string;
	tutorMapperQuotedTutorRate: number;
	tutorMapperNegotiatedRateWithTutor: number;
	tutorMapperTutorNegotiationRemarks: string;
	adminFinalizingRemarks: string;
	reschedulingRemarks: string;
	reScheduleCount: number;
	entryDateMillis: number;
	isSubscriptionCreated: string;
	subscriptionCreatedMillis;
	isEnquiryClosed: string;
	enquiryClosedMillis: number;
	enquiryEmail: string;
	enquiryContactNumber: string;
	isEnquiryEmailSameAsCustomerEmail: boolean;
	isEnquiryContactNumberSameAsCustomerContactNumber: boolean;

  constructor() {}
  
  setValuesFromGridRecord(record: GridRecord) {
    GridCommonFunctions.setGridRecordPropertiesInCustomObject(record, this);
    this.customerSerialId = record.getProperty('customerId');
    this.tutorSerialId = record.getProperty('tutorId');
	this.enquirySerialId = record.getProperty('enquiryId');
	this.tutorMapperSerialId = record.getProperty('tutorMapperId');
	this.isEnquiryEmailSameAsCustomerEmail = (this.enquiryEmail === this.customerEmail);
	this.isEnquiryContactNumberSameAsCustomerContactNumber = (this.enquiryContactNumber === this.customerContactNumber);
  }
}
