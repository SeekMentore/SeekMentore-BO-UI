import { GridCommonFunctions } from "../utils/grid/grid-common-functions";
import { GridRecord } from "../utils/grid/grid-record";

export class TutorMapper {
	tutorMapperSerialId: string;
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
	customerSerialId: string;
	customerName: string;
	customerEmail: string;
	customerContactNumber: string;
	tutorSerialId: string;
	tutorName: string;
	tutorEmail: string;
	tutorContactNumber: string;
	quotedTutorRate: number;
	negotiatedRateWithTutor: number;
	tutorNegotiationRemarks: string;
	isTutorContacted: string;
	tutorContactedDateMillis: number;
	isTutorAgreed: string;
	isTutorRejectionValid: string;
	adminTutorRejectionValidityResponse: string;
	tutorResponse: string;
	adminRemarksForTutor: string;
	isClientContacted: string;
	clientContactedDateMillis: number;
	isClientAgreed: string;
	clientResponse: string;
	isClientRejectionValid: string;
	adminClientRejectionValidityResponse: string;
	adminRemarksForClient: string;
	adminActionDateMillis: number;
	adminActionRemarks: string;
	whoActed: string;
	whoActedName: string;
	isDemoScheduled: string;
	demoDateAndTimeMillis: number;
	mappingStatus: string;
	entryDateMillis: number;
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
	this.isEnquiryEmailSameAsCustomerEmail = (this.enquiryEmail === this.customerEmail);
	this.isEnquiryContactNumberSameAsCustomerContactNumber = (this.enquiryContactNumber === this.customerContactNumber);
  }
}
