---
tags:
  - open-redirect
  - cheatsheet
---
# Open Redirect Cheatsheet

Lack of server-side validation to ensure that redirect URLs are legitimate

## Checks

- [ ] Try to add a domain we control in any redirect parameter, url=, redirect=, redirect_url=, etc.
- [ ] Check for misconfigured filtering. 
	- google.com.demo instead of google.com
- [ ] Try // instead of https://

## SSO

TBD