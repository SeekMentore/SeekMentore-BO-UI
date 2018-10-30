declare var CKEDITOR: any;

export class CkeditorConfig {
  static completeConfiguration = {
    enterMode: CKEDITOR.ENTER_BR,
    toolbar: [
      {name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']},
      {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
      {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt']},
      {
        name: 'forms',
        items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField']
      },
      {
        name: 'basicstyles',
        items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat']
      },
      {
        name: 'paragraph',
        items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
          'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']
      },
      {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
      {
        name: 'insert',
        items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
      },
      {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
      {name: 'colors', items: ['TextColor', 'BGColor']},
      {name: 'tools', items: ['Maximize', 'ShowBlocks']},
      {name: 'about', items: ['About']}
    ]
  };

  static defaultConfiguration = {
    enterMode: CKEDITOR.ENTER_BR,
    toolbar: [
      {name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']},
      {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
      {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt']},
      {
        name: 'forms',
        items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField']
      },
      {
        name: 'basicstyles',
        items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat']
      },
      {
        name: 'paragraph',
        items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
          'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']
      },
      {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
      {
        name: 'insert',
        items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
      },
      {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
      {name: 'colors', items: ['TextColor', 'BGColor']},
      {name: 'tools', items: ['Maximize', 'ShowBlocks']},
      {name: 'about', items: ['About']}
    ]
  };

  static emailConfiguration = {
    enterMode: CKEDITOR.ENTER_BR,
    toolbar: [
      {name: 'document', items: ['Source']},
      {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
      {name: 'editing', items: ['Find', 'Replace', 'SelectAll']},      
      {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat']},
      {
        name: 'paragraph',
        items: ['NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-']
      },      
      {
        name: 'insert',
        items: ['Table', 'HorizontalRule', 'SpecialChar']
      },
      {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
      {name: 'colors', items: ['TextColor', 'BGColor']},
      {name: 'tools', items: ['Maximize']}
    ]
  };
}



