# Information Gathering

- [ ]  Conduct Search Engine Discovery Reconnaissance for Information Leakage [WSTG-INFO-01](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/01-Conduct_Search_Engine_Discovery_Reconnaissance_for_Information_Leakage)
- [ ]  Fingerprint Web Server [WSTG-INFO-02](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/02-Fingerprint_Web_Server)
- [ ]  Review Webserver Metafiles for Information Leakage [WSTG-INFO-03](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/03-Review_Webserver_Metafiles_for_Information_Leakage)

```bash
ffuf -c -u <https://target.com/FUZZ> -w common.txt -of csv -o initial-fuzz.csv

```

- [ ]  Enumerate Applications on Webserver [WSTG-INFO-04](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/04-Enumerate_Applications_on_Webserver)
- [ ]  Review Web Page Content for Information Leakage [WSTG-INFO-05](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/05-Review_Web_Page_Content_for_Information_Leakage)

```bash
curl <https://target.com> | grep '<!--'
```

```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent <https://example.com>
```

```bash
trufflehog filesystem .
```

- [ ]  Identify Application Entry Points [WSTG-INFO-06](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/06-Identify_Application_Entry_Points)
    - [ ]  Happy path!!
    - [ ]  Look for parameters in query strings and POST bodies
    - [ ]  Look out for anything that seems different, odd, or custom.
- [ ]  Map Execution Paths Through Application [WSTG-INFO-07](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/07-Map_Execution_Paths_Through_Application)

```bash
katana -u <https://target.com> -js -proxy <http://127.0.0.1:8080>
```

- [ ]  Fingerprint Web Application Framework [WSTG-INFO-08](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework)

```bash
whatweb target.com
```

- [ ]  Fingerprint Web Application [WSTG-INFO-09](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/09-Fingerprint_Web_Application)
- [ ]  Map Application Architecture [WSTG-INFO-10](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/10-Map_Application_Architecture)
    - [ ]  Web server
    - [ ]  Platform-as-a-Service
    - [ ]  Serverless
        AWS Lambda
        ```bash
        X-Amz-Invocation-Type
        X-Amz-Log-Type
        X-Amz-Client-Context
        ```
        Microsoft Azure
        ```bash
        Server: kestrel
        ```
        
    - [ ]  Microservices
    - [ ]  Static storage
        - [ ]  S3
        - [ ]  Azure blob
    - [ ]  Databases in use
    - [ ]  Authentication
    - [ ]  Third-party services and APIs
    - [ ]  Network components - load balancer, CDN
    - [ ]  WAF, IDS, IPS