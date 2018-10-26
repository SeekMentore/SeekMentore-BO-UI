export class LcpRestUrls {
  static basicInfoUrl = '/rest/commons/getLoginBasicInfo';
  static emailTemplatesUrl = '/rest/commons/getEmailTemplates';
  static emailTemplateDataUrl = '/rest/commons/loadEmailTemplate';
  static logoutUrl = '/rest/login/logout';
  static sendMailUrl = '/rest/commons/sendEmail';
  static uiAccessUrl = '/rest/login/checkUIpathAccess';
  static tutorDataAccess = 'rest/admin/registeredTutorCheckDataAccess';
  static blackListRegisteredTutors = 'rest/admin/blacklistRegisteredTutors';
  static tutor_document_grid_approve_multiple = 'rest/registeredTutor/approveMultipleTutorDocument';
  static tutor_document_grid_reminder_multiple = 'rest/registeredTutor/sendReminderMultipleTutorDocument';
  static tutor_document_grid_reject_multiple = 'rest/registeredTutor/rejectMultipleTutorDocument';
}
