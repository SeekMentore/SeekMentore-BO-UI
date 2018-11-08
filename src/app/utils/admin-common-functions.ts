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

    public static applicationStatusRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.applicationStatusFilterOptions); 
    }

    public static complaintUserRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.complaintUserFilterOptions); 
    }
    
    public static complaintUserMultiRenderer(record: GridRecord, column: Column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.complaintUserFilterOptions, ';'); 
    }
}