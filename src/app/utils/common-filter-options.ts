export class CommonFilterOptions {
  static yesNoFilterOptions: any [] = [{
                                value : 'Y',
                                label : 'YES'
                              }, {
                                value : 'N',
                                label : 'NO'
                              }];

  static genderFilterOptions: any [] = [
  // Leave it blank right now , I will write this content later
    {
      value : '02',
      label : 'Female'
    },
    {
      value : '01',
      label : 'Male'
    }
  ];

  static qualificationFilterOptions: any [] = [
  // Leave it blank right now , I will write this content later
  ];

  static primaryProfessionFilterOptions: any [] = [
  // Leave it blank right now , I will write this content later
  ];

  static transportModeFilterOptions: any [] = [
  // Leave it blank right now , I will write this content later
  ];

  static studentGradesFilterOptions: any [] = [
  // Leave it blank right now , I will write this content later
  ];

  static subjectsFilterOptions: any [] = [
  // Leave it blank right now , I will write this content later
    {
      value : '01',
      label : 'sub1'
    }, {
      value : '02',
      label : 'sub2'
    },
    {
      value : '03',
      label : 'sub3'
    }, {
      value : '04',
      label : 'sub4'
    },
  ];

  static locationsFilterOptions: any [] = [{
    value : '01',
    label : 'location1'
  }, {
    value : '02',
    label : 'location2'
  },
    {
      value : '03',
      label : 'location3'
    }, {
      value : '04',
      label : 'location4'
    },
    {
      value : '05',
      label : 'location5'
    }, {
      value : '06',
      label : 'location6'
    }];

    static preferredTimeToCallFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

    static referenceFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

    static preferredTeachingTypeFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

    static applicationStatusFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

    static enquiryStatusFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

    static queryStatusFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

    static complaintStatusFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

    static complaintUserFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

    static matchStatusFilterOptions: any [] = [
    // Leave it blank right now , I will write this content later
    ];

  static singleSelectOptions = {
    singleSelection: true,
    idField: 'value',
    textField: 'label',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  static multiSelectOptions = {
    singleSelection: false,
    idField: 'value',
    textField: 'label',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };


  static getSelectedFilterItems(allowedOptions: { value: any, label: any }[], selectedValues: string) {
    const selectedValuesArray = selectedValues.split(';');
    const selectedOptionsArray: any[] = [];
    for (const value of selectedValuesArray) {
      for (const option of allowedOptions) {
        if (option.value === value) {
          selectedOptionsArray.push(option);
        }
      }
    }
    return selectedOptionsArray;
  }

  static updateRecordProperty(key: string, value: string, data_type: string, updatedData: any, parentRecord: any) {
    switch (data_type) {
      case 'list':
        let previous_value = updatedData[key];
        if (!previous_value) {
          previous_value = parentRecord.property[key];
        }
        const previous_value_array = previous_value.split(';');
        if (previous_value_array.includes(value)) {
          previous_value_array.splice(previous_value_array.indexOf(value), 1);

        } else {
          previous_value_array.push(value);
        }
        updatedData[key] = previous_value_array.join(';');
        break;
      default:
        updatedData[key] = value;
    }

    console.log(updatedData);
  }
}



