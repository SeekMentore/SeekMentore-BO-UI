import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';
import { CommonUtilityFunctions } from "src/app/utils/common-utility-functions";

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
	rescheduledFromDemoSerialId: string;
	entryDateMillis: number;
	isSubscriptionCreated: string;
	subscriptionCreatedMillis: number;
	isEnquiryClosed: string;
	enquiryClosedMillis: number;
	enquiryEmail: string;
	enquiryContactNumber: string;
	isEnquiryEmailSameAsCustomerEmail: boolean;
	isEnquiryContactNumberSameAsCustomerContactNumber: boolean;
	isRescheduled: boolean;

  constructor() {}
  
  setValuesFromGridRecord(record: GridRecord) {
    GridCommonFunctions.setGridRecordPropertiesInCustomObject(record, this);
	this.isEnquiryEmailSameAsCustomerEmail = (this.enquiryEmail === this.customerEmail);
	this.isEnquiryContactNumberSameAsCustomerContactNumber = (this.enquiryContactNumber === this.customerContactNumber);
	this.isRescheduled = CommonUtilityFunctions.checkNonNegativeNonZeroNumberAvailability(this.reScheduleCount);
  }
}
