export class ApplicationBreadCrumbConfig {

  /**
   * {
   *    splitPath: 'home', -- path which comes from splitting /
        showLabel: true,   -- tells if label should be shown on breadcrumb or not
        label: 'Home'      -- label that appears in bread crumb
        isLast: false      -- if this would be last bread crumb; if yes the RIGHT arrow does not appear
        isActivated: true  -- if this crumb has a router URL attached or not
        url: '/user/home'  -- router URL which should be opened on click of this crumb
   * }
   */
  static pathListCrumbConfig: {
                                  splitPath: string,
                                  showLabel: boolean,
                                  label: string,
                                  isLast: boolean,
                                  isActivated: boolean,
                                  url: string
                                }[] =   [{
                                          splitPath: 'user',
                                          showLabel: true,
                                          label: 'User',
                                          isLast: false,
                                          isActivated: true,
                                          url: '/user/home'
                                        }, {
                                          splitPath: 'home',
                                          showLabel: true,
                                          label: 'Home',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/home'
                                        }, {
                                          splitPath: 'changepassword',
                                          showLabel: true,
                                          label: 'Change Password',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/changepassword'
                                        }, {
                                          splitPath: 'superadmin',
                                          showLabel: true,
                                          label: 'Super Admin',
                                          isLast: false,
                                          isActivated: false,
                                          url: null
                                        }, {
                                          splitPath: 'controlpanel',
                                          showLabel: true,
                                          label: 'Control Panel',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/superadmin/controlpanel'
                                        }, {
                                          splitPath: 'admin',
                                          showLabel: true,
                                          label: 'Admin',
                                          isLast: false,
                                          isActivated: false,
                                          url: null
                                        }, {
                                          splitPath: 'registeredtutor',
                                          showLabel: true,
                                          label: 'Registered Tutor',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/admin/registeredtutor'
                                        }, {
                                          splitPath: 'subscribedcustomer',
                                          showLabel: true,
                                          label: 'Subscribed Customer',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/admin/subscribedcustomer'
                                        }, {
                                          splitPath: 'sales',
                                          showLabel: true,
                                          label: 'Sales',
                                          isLast: false,
                                          isActivated: false,
                                          url: null
                                        }, {
                                          splitPath: 'allenquiries',
                                          showLabel: true,
                                          label: 'Enquiry Manager',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/sales/allenquiries'
                                        }, {
                                          splitPath: 'maptutortoenquiry',
                                          showLabel: true,
                                          label: 'Tutor Mapping',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/sales/maptutortoenquiry'
                                        }, {
                                          splitPath: 'scheduledemo',
                                          showLabel: true,
                                          label: 'Demo Scheduler',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/sales/scheduledemo'
                                        }, {
                                          splitPath: 'demotracker',
                                          showLabel: true,
                                          label: 'Demo Manager',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/sales/demotracker'
                                        }, {
                                          splitPath: 'subscriptionpackages',
                                          showLabel: true,
                                          label: 'Subscription Packages',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/sales/subscriptionpackages'
                                        }, {
                                          splitPath: 'assignmentattendance',
                                          showLabel: true,
                                          label: 'Assignment Attendance',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/sales/assignmentattendance'
                                        }, {
                                          splitPath: 'support',
                                          showLabel: true,
                                          label: 'Support',
                                          isLast: false,
                                          isActivated: false,
                                          url: null
                                        }, {
                                          splitPath: 'tutorregistration',
                                          showLabel: true,
                                          label: 'Tutor Registration',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/support/tutorregistration'
                                        }, {
                                          splitPath: 'enquiryregistration',
                                          showLabel: true,
                                          label: 'Enquiry Registration',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/support/enquiryregistration'
                                        }, {
                                          splitPath: 'querysubmitted',
                                          showLabel: true,
                                          label: 'Query Submitted',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/support/querysubmitted'
                                        }, {
                                          splitPath: 'subscriptionrequested',
                                          showLabel: true,
                                          label: 'Subscription Requested',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/support/subscriptionrequested'
                                        }, {
                                          splitPath: 'complaints',
                                          showLabel: true,
                                          label: 'Complaints',
                                          isLast: true,
                                          isActivated: true,
                                          url: '/user/employee/support/complaints'
                                        }];
  
  static getBreadCrumbList(routerURL: string) {
    let newCrumbList: {
      label: string,
      url: string,
      isLast: boolean,
      isActivated: boolean
    }[] = [];
    let paths: string[] = routerURL.split('/');
    if (paths.length > 0) {
      paths.forEach(splitPath => {
        for (var i = 0; i < ApplicationBreadCrumbConfig.pathListCrumbConfig.length; i++) {
          let splitPathCrumbConfig = ApplicationBreadCrumbConfig.pathListCrumbConfig[i];
          if (splitPathCrumbConfig.splitPath === splitPath) {
            if (splitPathCrumbConfig.showLabel) {
              newCrumbList.push({
                label: splitPathCrumbConfig.label,
                url: splitPathCrumbConfig.url,
                isLast: splitPathCrumbConfig.isLast,
                isActivated: splitPathCrumbConfig.isActivated
              });
            }
            break;
          }
        }
      });
    }
    return newCrumbList;
  }
}