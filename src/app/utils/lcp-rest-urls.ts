export class LcpRestUrls {
  static basic_info_url = '/rest/commons/getLoginBasicInfo';
  static server_info_url = '/rest/commons/getServerInfo';
  static get_email_templates_url = '/rest/commons/getEmailTemplates';
  static email_template_data_url = '/rest/commons/loadEmailTemplate';
  static logout_url = '/rest/login/logout';
  static change_password_url = '/rest/login/changePassword';
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
  static find_tutor_data_access = '/rest/support/findTutorCheckDataAccess';
  static blackList_find_tutors = '/rest/support/blacklistFindTutorList';
  static take_action_on_find_tutor = '/rest/support/takeActionOnFindTutor';
  static find_tutor_update_record = '/rest/support/updateFindTutorRecord';
  static subscribe_with_us_data_access = '/rest/support/subscribeWithUsCheckDataAccess';
  static blackList_subscribe_with_us = '/rest/support/blacklistSubscribeWithUsList';
  static take_action_on_subscribe_with_us = '/rest/support/takeActionOnSubscribeWithUs';
  static subscribe_with_us_update_record = '/rest/support/updateSubscribeWithUsRecord';
  static take_action_on_submit_query = '/rest/support/takeActionOnSubmitQuery';
  static submit_query_data_access = '/rest/support/submitQueryCheckDataAccess';
  static submit_query_update_record = '/rest/support/updateSubmitQueryRecord';
  static complaint_data_access = '/rest/support/complaintCheckDataAccess';
  static complaint_update_record = '/rest/support/updateComplaintRecord';  
  static enquiry_data_access = '/rest/sales/enquiryCheckDataAccess';
  static take_action_on_enquiry = '/rest/sales/takeActionOnEnquiry';
  static pending_enquiry_update_record = '/rest/sales/updateEnquiryRecord';  
  static map_tutor_to_enquiry_map_registered_tutors = '/rest/sales/mapRegisteredTutors';
  static map_tutor_to_enquiry_unmap_registered_tutors = '/rest/sales/unmapRegisteredTutors';
  static take_action_on_mapped_tutor = '/rest/sales/takeActionOnMappedTutor';
  static tutor_mapper_data_access = '/rest/sales/tutorMapperCheckDataAccess';
  static mapped_tutor_update_record = '/rest/sales/updateTutorMapperRecord';
  static schedule_demo = '/rest/sales/scheduleDemo';
  static demo_modify_data_access = '/rest/sales/demoModifyCheckDataAccess';
  static take_action_on_demo = '/rest/sales/takeActionOnDemo';
  static demo_update_record = '/rest/sales/updateDemoRecord';
  static re_schedule_demo = '/rest/sales/reScheduleDemo';
  static subscription_package_data_access = '/rest/sales/subscriptionPackageCheckDataAccess';
  static subscription_package_update_record = '/rest/sales/updateSubscriptionPackageRecord';
  static take_action_on_subscription_package = '/rest/sales/takeActionOnSubscriptionPackage'; 
  static subscription_package_assignment_data_access = '/rest/sales/packageAssignmentCheckDataAccess'; 
  static subscription_package_assignment_update_record = '/rest/sales/updateSubscriptionPackageAssignmentRecord';
  static take_action_on_subscription_package_assignment = '/rest/sales/takeActionOnSubscriptionPackageAssignment'; 
  static assignment_attendance_marking_access = '/rest/sales/assignmentAttendanceMarkingAccess'; 
  static insert_assignment_attendance = '/rest/sales/insertAssignmentAttendance';
  static update_assignment_attendance = '/rest/sales/updateAssignmentAttendance';
  static get_package_assignment_record = '/rest/sales/getPackageAssignmentRecord';
  static get_assignment_attendance_uploaded_document_count_and_existence = '/rest/sales/getAssignmentAttendanceUploadedDocumentCountAndExistence';
  static remove_assignment_attendance_document_file = '/rest/sales/removeAssignmentAttendanceDocumentFile';
  static get_subscription_package_record = '/rest/sales/getSubscriptionPackageRecord';
  static get_demo_record = '/rest/sales/getDemoRecord';
  static get_tutor_mapper_record = '/rest/sales/getTutorMapperRecord';
  static get_subscribed_customer_record = '/rest/subscribedCustomer/getSubscribedCustomerRecord';
  static get_registered_tutor_record = '/rest/registeredTutor/getRegisteredTutorRecord';
  static remove_registered_tutor_document_file = '/rest/registeredTutor/removeRegisteredTutorDocumentFile';
  static get_registered_tutor_document_count_and_existence = '/rest/registeredTutor/getRegisteredTutorDocumentCountAndExistence';
  static get_enquiry_record = '/rest/sales/getEnquiryRecord';
  static get_become_tutor_record = '/rest/support/getBecomeTutorRecord';
  static get_find_tutor_record = '/rest/support/getFindTutorRecord';
  static get_subscribe_with_us_record = '/rest/support/getSubscribeWithUsRecord';
  static get_submit_query_record = '/rest/support/getSubmitQueryRecord';
}
