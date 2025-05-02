# Configuration and Deployment Management Testing

- [ ]  Test Network Infrastructure Configuration [WSTG-CONF-01](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/01-Test_Network_Infrastructure_Configuration)
- [ ]  Test Application Platform Configuration [WSTG-CONF-02](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/02-Test_Application_Platform_Configuration)
- [ ]  Test File Extensions Handling for Sensitive Information [WSTG-CONF-03](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/03-Test_File_Extensions_Handling_for_Sensitive_Information)
- [ ]  Review Old Backup and Unreferenced Files for Sensitive Information [WSTG-CONF-04](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/04-Review_Old_Backup_and_Unreferenced_Files_for_Sensitive_Information)

	```bash
	ffuf -c -u <https://target.com/FUZZ> -w raft-medium-files.txt -e .bak,.old,.backup -of csv -o old-files.csv
	```

- [ ]  Enumerate Infrastructure and Application Admin Interfaces [WSTG-CONF-05](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/05-Enumerate_Infrastructure_and_Application_Admin_Interfaces)
- [ ]  Test HTTP Methods [WSTG-CONF-06](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/06-Test_HTTP_Methods)

	```bash
	curl -X OPTIONS <https://target.com>
	```

- [ ]  Test HTTP Strict Transport Security [WSTG-CONF-07](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/07-Test_HTTP_Strict_Transport_Security)
- [ ]  ~~Test RIA Cross Domain Policy [WSTG-CONF-08](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/08-Test_RIA_Cross_Domain_Policy)~~
- [ ]  Test File Permission [WSTG-CONF-09](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/09-Test_File_Permission)
- [ ]  Test for Subdomain Takeover [WSTG-CONF-10](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/10-Test_for_Subdomain_Takeover)
- [ ]  Test Cloud Storage [WSTG-CONF-11](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/11-Test_Cloud_Storage)
    
    [Grayhatwarfare](https://grayhatwarfare.com)
    
- [ ]  Testing for Content Security Policy [WSTG-CONF-12](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/12-Test_for_Content_Security_Policy)
- [ ]  Test Path Confusion [WSTG-CONF-13](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/13-Test_for_Path_Confusion)
- [ ]  Test Other HTTP Security Header Misconfigurations [WSTG-CONF-14](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/14-Test_Other_HTTP_Security_Header_Misconfigurations)