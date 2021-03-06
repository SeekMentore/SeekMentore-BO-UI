import { CommonFilterOptions } from "./common-filter-options";
import { GridCommonFunctions } from "./grid/grid-common-functions";
import { GridRecord } from "./grid/grid-record";
import { Column } from "./grid/column";

export class AdminCommonFunctions {
    public static genderRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.genderFilterOptions); 
    }

    public static genderMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.genderFilterOptions, ';'); 
    }
    
    public static qualificationRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.qualificationFilterOptions); 
    }

    public static qualificationMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.qualificationFilterOptions, ';'); 
    }
    
    public static transportModeRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.transportModeFilterOptions); 
    }

    public static transportModeMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.transportModeFilterOptions, ';'); 
    }
    
    public static primaryProfessionRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.primaryProfessionFilterOptions); 
    }

    public static primaryProfessionMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.primaryProfessionFilterOptions, ';'); 
    }

    public static studentGradesRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.studentGradesFilterOptions); 
    }
    
    public static studentGradesMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.studentGradesFilterOptions, ';'); 
    }

    public static subjectsRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.subjectsFilterOptions); 
    }
    
    public static subjectsMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.subjectsFilterOptions, ';'); 
    }

    public static locationsRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.locationsFilterOptions); 
    }
    
    public static locationsMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.locationsFilterOptions, ';'); 
    }

    public static preferredTimeToCallRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.preferredTimeToCallFilterOptions); 
    }
    
    public static preferredTimeToCallMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.preferredTimeToCallFilterOptions, ';'); 
    }

    public static referenceRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.referenceFilterOptions); 
    }
    
    public static referenceMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.referenceFilterOptions, ';'); 
    }

    public static preferredTeachingTypeRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.preferredTeachingTypeFilterOptions); 
    }
    
    public static preferredTeachingTypeMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.preferredTeachingTypeFilterOptions, ';'); 
    }

    public static publicApplicationStatusRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.publicApplicationStatusFilterOptions); 
    }

    public static userRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.userFilterOptions); 
    }
    
    public static userMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.userFilterOptions, ';'); 
    }

    public static tutorDocumentTypeRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.tutorDocumentTypeFilterOptions); 
    }

    public static tutorDocumentTypeMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.tutorDocumentTypeFilterOptions, ';'); 
    }

    public static queryStatusRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.queryStatusFilterOptions); 
    }

    public static complaintStatusRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.complaintStatusFilterOptions); 
    }

    public static matchStatusRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.matchStatusFilterOptions); 
    }

    public static mappingStatusRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.mappingStatusFilterOptions); 
    }

    public static demoStatusRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.demoStatusFilterOptions); 
    }

    public static assignmentAttendanceDocumentTypeRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.assignmentAttendanceDocumentTypeFilterOptions); 
    }

    public static happinessIndexRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.happinessIndexFilterOptions); 
    }
}