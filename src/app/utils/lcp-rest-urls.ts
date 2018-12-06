export class LcpRestUrls {
  static basic_info_url = '/rest/commons/getLoginBasicInfo';
  static email_templates_url = '/rest/commons/getEmailTemplates';
  static email_template_data_url = '/rest/commons/loadEmailTemplate';
  static logout_url = '/rest/login/logout';
  static send_email_url = '/rest/commons/sendEmail';
  static ui_access_url = '/rest/login/checkUIpathAccess';
  static tutor_data_access = '/rest/admin/registeredTutorCheckDataAccess';
  static blackList_registered_tutors = '/rest/admin/blacklistRegisteredTutors';
  static tutor_document_grid_approve = '/rest/registeredTutor/approveTutorDocumentList';
  static tutor_document_grid_reminder = '/rest/registeredTutor/sendReminderTutorDocumentList';
  static tutor_document_grid_reject = '/rest/registeredTutor/rejectTutorDocumentList';
  static tutor_bank_grid_approve = '/rest/registeredTutor/approveBankAccountList';
  static tutor_bank_grid_make_default = '/rest/registeredTutor/makeDefaultBankAccount';
  static tutor_bank_grid_reject = '/rest/registeredTutor/rejectBankAccountList';
  static tutor_update_record = '/rest/registeredTutor/updateTutorRecord';
  static customer_data_access = '/rest/admin/subscribedCustomerCheckDataAccess';
  static blackList_subscribed_customers = '/rest/admin/blacklistSubscribedCustomers';
  static customer_update_record = '/rest/subscribedCustomer/updateCustomerRecord';  
  static become_tutor_data_access = '/rest/support/becomeTutorCheckDataAccess';
  static blackList_become_tutors = '/rest/support/blacklistBecomeTutorList';
  static take_action_on_become_tutor = '/rest/support/takeActionOnBecomeTutor';
  static become_tutor_update_record = '/rest/support/updateBecomeTutorRecord';
  static enquiry_request_data_access = '/rest/support/enquiryRequestCheckDataAccess';
  static blackList_enquiry_requests = '/rest/support/blacklistEnquiryRequestList';
  static take_action_on_find_tutor = '/rest/support/takeActionOnFindTutor';
  static enquiry_request_update_record = '/rest/support/updateEnquiryRequestRecord';
  static subscription_request_data_access = '/rest/support/subscriptionRequestCheckDataAccess';
  static blackList_subscription_request = '/rest/support/blacklistSubscriptionRequestList';
  static take_action_on_subscription = '/rest/support/takeActionOnSubscription';
  static subscription_request_update_record = '/rest/support/updateSubscriptionRequestRecord';
  static take_action_on_submit_query = '/rest/support/takeActionOnSubmitQuery';
  static submitted_query_data_access = '/rest/support/submitQueryCheckDataAccess';
  static submitted_query_update_record = '/rest/support/updateSubmitQueryRecord';
  static complaint_data_access = '/rest/support/complaintCheckDataAccess';
  static complaint_update_record = '/rest/support/updateComplaintRecord';  
  static pending_enquiry_data_access = '/rest/sales/pendingEnquiryCheckDataAccess';
  static pending_enquiry_update_record = '/rest/sales/updatePendingEnquiryRecord';  
  static map_tutor_to_enquiry_data_access = '/rest/sales/mapTutorToEnquiryCheckDataAccess';
  static map_tutor_to_enquiry_map_registered_tutors = '/rest/sales/mapRegisteredTutors';
  static map_tutor_to_enquiry_map_registered_tutor = '/rest/sales/mapRegisteredTutor';
  static map_tutor_to_enquiry_unmap_registered_tutors = '/rest/sales/unmapRegisteredTutors';
  static map_tutor_to_enquiry_unmap_registered_tutor = '/rest/sales/unmapRegisteredTutor';
  static mapped_tutor_enquiry_data_access = '/rest/sales/mappedTutorCheckDataAccess';
  static mapped_tutor_update_record = '/rest/sales/updateTutorMapperRecord';
  static mapped_tutor_schedule_demo_access = '/rest/sales/mappedTutorCheckScheduleDemoAccess';
  static schedule_demo_mapped_tutor_update_record = '/rest/sales/updateScheduleDemoMappedTutorRecord';
  static demo_tracker_modify_data_access = '/rest/sales/demoTrackerModifyCheckDataAccess';
  static cancel_demos = '/rest/admin/cancelDemos';
  static demo_tracker_update_record = '/rest/sales/updateDemoTrackerRecord';
}
