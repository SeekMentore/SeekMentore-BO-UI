import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, GridDataInterface } from 'src/app/login-controlled-pages/grid/grid.component';
import { Column } from 'src/app/login-controlled-pages/grid/column';
import { CommonFilterOptions } from 'src/app/utils/common-filter-options';
import { AdminCommonFunctions } from 'src/app/utils/admin-common-functions';
import { Record } from 'src/app/login-controlled-pages/grid/record';
import { ActionButton } from 'src/app/login-controlled-pages/grid/action-button';

@Component({
  selector: 'app-registered-tutor',
  templateUrl: './registered-tutor.component.html',
  styleUrls: ['./registered-tutor.component.css']
})
export class RegisteredTutorComponent implements OnInit {

  @ViewChild('registeredTutorGrid')
  registeredTutorGridObject: GridComponent;
  registeredTutorGridMetaData: GridDataInterface;

  constructor() {
    this.registeredTutorGridMetaData = null;
    this.setUpGridMetaData();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.registeredTutorGridObject.init();      
    }, 0);
  }

  public setUpGridMetaData() {
    this.registeredTutorGridMetaData = {
      grid: {
              id: 'registeredTutorGrid',
              title: 'Registered Tutors',
              store: {
                isStatic: false,
                restURL: '/rest/admin/registeredTutorsList'
              },
              columns: [{
                id: 'name',
                headerName: 'Name',
                dataType: 'string',
                mapping: 'name',          
                clickEvent: function (record: Record, column: Column) {
                  // Open the Data view port
                }
              }, {
                id: 'contactNumber',
                headerName: 'Contact Number',
                dataType: 'string',
                mapping: 'contactNumber'
              }, {
                id: 'emailId',
                headerName: 'Email Id',
                dataType: 'string',
                mapping: 'emailId'
              }, {
                id: 'gender',
                headerName: 'Gender',
                dataType: 'list',
            filterOptions : CommonFilterOptions.genderFilterOptions,
                mapping: 'gender',
                renderer: AdminCommonFunctions.genderRenderer
              }, {
                id: 'qualification',
                headerName: 'Qualification',
                dataType: 'list',
            filterOptions : CommonFilterOptions.qualificationFilterOptions,
                mapping: 'qualification',
            renderer: AdminCommonFunctions.qualificationRenderer
              }, {
                id: 'primaryProfession',
                headerName: 'Primary Profession',
                dataType: 'list',
            filterOptions : CommonFilterOptions.primaryProfessionFilterOptions,
                mapping: 'primaryProfession',
            renderer: AdminCommonFunctions.primaryProfessionRenderer
              }, {
                id: 'transportMode',
                headerName: 'Transport Mode',
                dataType: 'list',
            filterOptions : CommonFilterOptions.transportModeFilterOptions,
                mapping: 'transportMode',
            renderer: AdminCommonFunctions.transportModeRenderer
              }, {
                id: 'teachingExp',
                headerName: 'Teaching Experience',
                dataType: 'number',
                mapping: 'teachingExp'
              }, {
                id: 'interestedStudentGrades',
                headerName: 'Interested Student Grades',
                dataType: 'list',
            filterOptions : CommonFilterOptions.interestedStudentGradesFilterOptions,
                mapping: 'interestedStudentGrades',
            renderer: AdminCommonFunctions.interestedStudentGradesMultiRenderer
              }, {
                id: 'interestedSubjects',
                headerName: 'Interested Subjects',
                dataType: 'list',
            filterOptions : CommonFilterOptions.interestedSubjectsFilterOptions,
                mapping: 'interestedSubjects',
            renderer: AdminCommonFunctions.interestedSubjectsMultiRenderer
              }, {
                id: 'comfortableLocations',
                headerName: 'Comfortable Locations',
                dataType: 'list',
            filterOptions : CommonFilterOptions.comfortableLocationsFilterOptions,
                mapping: 'comfortableLocations',
            renderer: AdminCommonFunctions.comfortableLocationsMultiRenderer
              }, {
                id: 'additionalDetails',
                headerName: 'Additional Details',
                dataType: 'string',
                mapping: 'additionalDetails'
              }],
          hasSelectionColumn : true,
          selectionColumn : {
            buttons : [{
              id : 'sendEmail',
              label : 'Send Email',
              clickEvent : function(selectedRecords: Record[], button :ActionButton) {
                // Refer document
              }
            }, {
              id : 'blacklist',
              label : 'Blacklist',
              btnclass : 'btnReject',
              clickEvent : function(selectedRecords: Record[], button :ActionButton) {
                // Refer document
              }
            }]
          }
      },
      htmlDomElementId: 'registered-tutor-grid',
      hidden: false
    };
  }

}
