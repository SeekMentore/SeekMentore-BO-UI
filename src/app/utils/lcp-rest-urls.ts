export class LcpRestUrls {
  static basicInfoUrl = '/rest/commons/getLoginBasicInfo';
  static emailTemplatesUrl = '/rest/commons/getEmailTemplates';
  static emailTemplateDataUrl = '/rest/commons/loadEmailTemplate';
  static logoutUrl = '/rest/login/logout';
  static sendMailUrl = '/rest/commons/sendEmail';
  static uiAccessUrl = '/rest/login/checkUIpathAccess';
  static tutorDataAccess = '/rest/admin/registeredTutorCheckDataAccess';
  static blackListRegisteredTutors = '/rest/admin/blacklistRegisteredTutors';
  static tutor_document_grid_approve_single = '/rest/registeredTutor/approveTutorDocument';
  static tutor_document_grid_approve_multiple = '/rest/registeredTutor/approveMultipleTutorDocument';
  static tutor_document_grid_reminder_single = '/rest/registeredTutor/sendReminderTutorDocument';
  static tutor_document_grid_reminder_multiple = '/rest/registeredTutor/sendReminderMultipleTutorDocument';
  static tutor_document_grid_reject_single = '/rest/registeredTutor/rejectTutorDocument';
  static tutor_document_grid_reject_multiple = '/rest/registeredTutor/rejectMultipleTutorDocument';
  static tutor_bank_grid_approve_single = '/rest/registeredTutor/approveBankAccount';
  static tutor_bank_grid_approve_multiple = '/rest/registeredTutor/approveMultipleBankAccount';
  static tutor_bank_grid_reject_single = '/rest/registeredTutor/rejectBankAccount';
  static tutor_bank_grid_reject_multiple = '/rest/registeredTutor/rejectMultipleBankAccount';
  static tutor_bank_grid_make_default = '/rest/registeredTutor/makeDefaultBankAccount';
  static tutor_update_record = '/rest/registeredTutor/updateTutorRecord';
  static customerDataAccess = '/rest/admin/subscribedCustomerCheckDataAccess';
  static blackListSubscribedCustomers = '/rest/admin/blacklistSubscribedCustomers';
  static customer_update_record = '/rest/subscribedCustomer/updateCustomerRecord';// param name - 'completeCustomerRecord' send same as the Tutor form
}
