import { GridCommonFunctions } from 'src/app/utils/grid/grid-common-functions';
import { GridRecord } from 'src/app/utils/grid/grid-record';

export class AssignmentAttendance {
	
	assignmentAttendanceSerialId: string;
	packageAssignmentSerialId: string;
	entryDateTimeMillis: number;
	exitDateTimeMillis: number;
	durationHours: number;
	durationMinutes: number;
	topicsTaught: string;
	isClassworkProvided: string;
	isHomeworkProvided: string;
	isTestProvided: string;
	tutorRemarks: string;
	tutorPunctualityIndex: string;
	punctualityRemarks: string;
	tutorExpertiseIndex: string;
	expertiseRemarks: string;
	tutorKnowledgeIndex: string;
	knowledgeRemarks: string;
	studentRemarks: string;
	recordLastUpdatedMillis: number;
	updatedBy: string;
	updatedByName: string;
	updatedByUserType: string;
	
	constructor() {}
  
  setValuesFromGridRecord(record: GridRecord) {
    GridCommonFunctions.setGridRecordPropertiesInCustomObject(record, this);
  }
}
