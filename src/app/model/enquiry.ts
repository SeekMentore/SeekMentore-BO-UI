import { GridCommonFunctions } from "../utils/grid/grid-common-functions";
import { GridRecord } from "../utils/grid/grid-record";

export class Enquiry {
	enquirySerialId: string;
	customerSerialId: string;
	customerName: string;
	customerEmail: string;
	customerContactNumber: string;
	subject: string;
	grade: string;
	quotedClientRate: number;
	negotiatedRateWithClient: number;
	clientNegotiationRemarks: string;
	isMapped: string;
	lastActionDateMillis: number;
	entryDateMillis: number;
	matchStatus: string;
	tutorSerialId: string;
	tutorName: string;
	tutorEmail: string;
	tutorContactNumber: string;
	adminRemarks: string;
	location: string;
	addressDetails: string;
	additionalDetails: string;
	whoActed: string;
	whoActedName: string;
	preferredTeachingType: string;
	enquiryEmail: string;
	enquiryContactNumber: string;
	isEnquiryEmailSameAsCustomerEmail: boolean;
	isEnquiryContactNumberSameAsCustomerContactNumber: boolean;

  constructor() {}
  
  setValuesFromGridRecord(record: GridRecord) {
    GridCommonFunctions.setGridRecordPropertiesInCustomObject(record, this);
		this.isEnquiryEmailSameAsCustomerEmail = (this.enquiryEmail === this.customerEmail);
		this.isEnquiryContactNumberSameAsCustomerContactNumber = (this.enquiryContactNumber === this.customerContactNumber);
  }
}
