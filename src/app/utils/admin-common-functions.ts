import { GridCommonFunctions } from "../login-controlled-pages/grid/grid-common-functions";
import { CommonFilterOptions } from "./common-filter-options";

export class AdminCommonFunctions {
    public static genderRenderer(record, column) {			
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.genderFilterOptions); 
    }

    public static genderMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.genderFilterOptions, ';'); 
    }
    
    public static qualificationRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.qualificationFilterOptions); 
    }

    public static qualificationMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.qualificationFilterOptions, ';'); 
    }
    
    public static transportModeRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.transportModeFilterOptions); 
    }

    public static transportModeMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.transportModeFilterOptions, ';'); 
    }
    
    public static primaryProfessionRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.primaryProfessionFilterOptions); 
    }

    public static primaryProfessionMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.primaryProfessionFilterOptions, ';'); 
    }

    public static studentGradesRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.studentGradesFilterOptions); 
    }
    
    public static studentGradesMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.studentGradesFilterOptions, ';'); 
    }

    public static subjectsRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.subjectsFilterOptions); 
    }
    
    public static subjectsMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.subjectsFilterOptions, ';'); 
    }

    public static locationsRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.locationsFilterOptions); 
    }
    
    public static locationsMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.locationsFilterOptions, ';'); 
    }
}