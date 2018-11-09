export class LcpRestUrls {
  static basic_info_url = '/rest/commons/getLoginBasicInfo';
  static email_templates_url = '/rest/commons/getEmailTemplates';
  static email_template_data_url = '/rest/commons/loadEmailTemplate';
  static logout_url = '/rest/login/logout';
  static send_email_url = '/rest/commons/sendEmail';
  static ui_access_url = '/rest/login/checkUIpathAccess';
  static tutor_data_access = '/rest/admin/registeredTutorCheckDataAccess';
  static blackList_registered_tutors = '/rest/admin/blacklistRegisteredTutors';
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
  static customer_data_access = '/rest/admin/subscribedCustomerCheckDataAccess';
  static blackList_subscribed_customers = '/rest/admin/blacklistSubscribedCustomers';
  static customer_update_record = '/rest/subscribedCustomer/updateCustomerRecord';
  //
  static become_tutor_data_access = '/rest/support/becomeTutorCheckDataAccess';
  static blackList_become_tutors = '/rest/support/blacklistBecomeTutors';
  static become_tutor_update_record = '/rest/support/updateBecomeTutorRecord';
  static enquiry_request_data_access = '/rest/support/enquiryRequestCheckDataAccess';
  static blackList_enquiry_requests = '/rest/support/blacklistEnquiryRequests';
  static enquiry_request_update_record = '/rest/support/updateEnquiryRequestRecord';
  static subscription_request_data_access = '/rest/support/subscriptionRequestCheckDataAccess';
  static blackList_subscription_request = '/rest/support/blacklistSubscriptionRequests';
  static subscription_request_update_record = '/rest/support/updateSubscriptionRequestRecord';
  static submitted_query_data_access = '/rest/support/submittedQueryCheckDataAccess';
  static submitted_query_update_record = '/rest/support/updateSubmittedQueryRecord';
  static complaint_data_access = '/rest/support/complaintCheckDataAccess';
  static complaint_update_record = '/rest/support/updateComplaintRecord';
  //
  static pending_enquiry_data_access = '/rest/sales/pendingEnquiryCheckDataAccess';
  static pending_enquiry_update_record = '/rest/sales/updatePendingEnquiryRecord';
  //
  static map_tutor_to_enquiry_data_access = '/rest/sales/mapTutorToEnquiryCheckDataAccess';
  static map_tutor_to_enquiry_map_registered_tutors = '/rest/sales/mapRegisteredTutors';
  static map_tutor_to_enquiry_map_registered_tutor = '/rest/sales/mapRegisteredTutor';
  static map_tutor_to_enquiry_unmap_registered_tutors = '/rest/sales/unmapRegisteredTutors';
  static map_tutor_to_enquiry_unmap_registered_tutor = '/rest/sales/unmapRegisteredTutor';
}
