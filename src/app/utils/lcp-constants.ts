export class LcpConstants {
  static confirmation_dialog_title = 'Please Confirm';
  static success_alert_title = 'Action Success';
  static failure_alert_title = 'Action Failed!!!';
  static email_dialog_title = 'Send Email';
  static replace_email_data = 'You have changes on your Email Form, loading an Email Template ' +
    'will remove your changes. Do you wish to continue?';
  static email_attachment_size_error = 'Attachments size cannot be greater than 10MB';
  static email_attachment_allowed_types = '.doc, .docx, .ppt, .pptx, .xls, .xlsx, .pdf,' +
    ' .txt, .jpg, .jpeg, .gif, .png, .mp4, .mp3';
  static email_attachments_max_number = 4;
  static email_attachemnts_max_size_MB = 10;
  static email_attachments_number_error = 'Maximum 4 attachments are allowed.';
  static email_sent_success_message = 'Email sent';
  static email_dismiss_data_exists_error = 'You have data on the form which you have not sent out as email.' +
    ' Do you still want to dismiss?';
  static auth_token_key = 'client_authentication_token';
  static grid_column_list_filter_dialog_header_suffix = ' - Filter Options';
  static user_type_key = 'user_type';
  static user_type_admin = 'admin';
}
