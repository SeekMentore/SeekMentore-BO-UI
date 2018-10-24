import { GridCommonFunctions } from "../login-controlled-pages/grid/grid-common-functions";
import { CommonFilterOptions } from "./common-filter-options";

export class AdminCommonFunctions {
    public static genderRenderer(record, column) {			
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.genderFilterOptions); 
    }
    
    public static qualificationRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.qualificationFilterOptions); 
    }
    
    public static transportModeRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.primaryProfessionFilterOptions); 
    }
    
    public static primaryProfessionRenderer(record, column) {
        return GridCommonFunctions.lookupRenderer(record, column, CommonFilterOptions.transportModeFilterOptions); 
    }
    
    public static interestedStudentGradesMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.interestedStudentGradesFilterOptions, ';'); 
    }
    
    public static interestedSubjectsMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.interestedSubjectsFilterOptions, ';'); 
    }
    
    public static comfortableLocationsMultiRenderer(record, column) {
        return GridCommonFunctions.lookupMultiRenderer(record, column, CommonFilterOptions.comfortableLocationsFilterOptions, ';'); 
    }
}