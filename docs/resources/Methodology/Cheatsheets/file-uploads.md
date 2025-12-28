---
tags:
  - file-upload
  - cheatsheet
---
# File Uploads

## Checks

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





