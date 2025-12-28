# Resources

Multiple resources, how-tos, and methodologies. Constantly updated.


## Login page

- [ ] Does the app allow self-registration
	- [ ] Two accounts with the same name
	- [ ] Unicode normalization issues?
- [ ] Check for weak credentials
- [ ] Check for default credentials
- [ ] Check for rate limiting
- [ ] Check for account lockout
- [ ] Test for [sqli](docs/resources/methodology/cheatsheets/sqli.md){ data-preview }
- [ ] Test for NoSQLi
- [ ] Check for username enumeration
	- [ ] Error messages
	- [ ] Timing disparity
	- [ ] Content-length
	- [ ] Try with a very long password
- [ ] Is there MFA
	- [ ] Can it be bypassed?
	- [ ] Brute forced if no rate limiting?
	- [ ] How are MFA tokens handled?
		- [ ] Do they expire?
		- [ ] Can they be used more than once?
	- [ ] Navigate directly to authenticated functionality
- [ ] Forgot password functionality?
	- [ ] How is it handled?
	- [ ] Current password required?
	- [ ] Can we change where email goes?
- [ ] Is it using SAML/OAUTH?
- [ ] Check for issues in client-side JS
- [ ] Can we bypass auth with IP spoofing?
- [ ] Check for [open redirects](methodology/cheatsheets/open-redirects.md){ data-==previ==ew }

## Registration

- [ ] Can anyone register? 
- [ ] What is required for registration?
- [ ] Check for mass assignment
- [ ] Check for unicode normalization issues
- [ ] Registration via API endpoints

## User input

- [ ] Is the input reflected anywhere on the page?
	- [ ] What is the context?
- [ ] Check for [XSS](methodology/cheatsheets/xss.md){ data-==previ==ew }
- [ ] Check for [SQLi](methodology/cheatsheets/sqli.md){ data-==previ==ew }
- [ ] Check for SSTI
- [ ] What is the content-type of the request?
	- [ ] Check for [XXE](methodology/cheatsheets/xxe.md){ data-==previ==ew }
	- [ ] Try converting JSON to XML

## State-Changing Actions

- [ ] Check for [CSRF](methodology/cheatsheets/csrf.md){ data-==previ==ew }
- [ ] Check for [broken access control](methodology/cheatsheets/broken-access-control.md){ data-==previ==ew }

## Sensitive data returned

- [ ] Check [CORS](methodology/cheatsheets/cors.md){ data-==previ==ew }
- [ ] Try to send a `POST` or `PUT` request with the data in the body to see if it's possible to update

## Query strings

- [ ] Check for [local file read](methodology/cheatsheets/local-file-read.md){ data-==previ==ew } or file inclusion
- [ ] Check for SQLi

## File Upload

- [ ] What technologies are in use?
    - Important to note to understand what type of web shell might work.
- [ ] What file types are allowed?
- [ ] Is it possible to upload other filetypes by:
    - Changing the extension
    - Changing the content type
        - Try changing to text/html with an XSS payload
    - Removing the content type
    - Appending an allowed file extension
- [ ] Is the check done on the client-side or the server-side?
- [ ] How is a normal file upload processed?
    - Is the filename changed?
    - Is the file stored in a predictable place?
    - Is it possible to access the uploaded file? How?
- [ ] Is it possible to store the file in another location?
    - Check for path traversal in the filename
    - Try over-writing sensitive files, e.g., authorized_keys -- **Be careful with this!**
- [ ] Is the filename reflected in the response?
    - Check for an XSS or RCE in the filename
- [ ] Try uploading an html file with an XSS payload
    - Make sure this is not intended behavior before reporting this. This is common in S3 buckets, but there's very little (if any) impact.
- [ ] Can we upload an SVG
    - Check for XSS depending on where the file is uploaded. Remember that XSS executes in the context of the site.
    - Check for XXE within the SVG if there is some kind of server-side functionality
- [ ] Keep an eye out for CSP bypasses or uses in other parts of the app
    - If we can upload js and use that to bypass CSP with XSS in another part of the app
    - Is there another functionality that uses XML files from uploads? SVGs?

