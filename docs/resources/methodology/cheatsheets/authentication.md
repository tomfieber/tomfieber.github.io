---
tags:
  - authn
  - cheatsheet
---
# Authentication

## Approaching login pages

- [ ] Check for rate limiting/account lockout
- [ ] Check for weak credentials (`admin`, `password`, common/leaked password lists)
- [ ] Does the application respond differently to valid and invalid usernames?
	- Check for subtle differences as well, including timing disparities
- [ ] Password reset flow
	- Can we leak password reset tokens
	- Email injection
- [ ] Is there MFA?
	- Is it enforced?
	- Can the MFA be brute forced?
	- Bypassed?
- [ ] Content discovery to find hidden registration pages
- [ ] Check client-side JS files for additional endpoints that may allow registration
- [ ] Review responses to see if tokens or any sensitive information is returned
	- Consider fuzzing API endpoints to see if any return tokens or information that could be used
- [ ] Carefully review password reset email requests
	- Is there a way to change where the reset token gets sent?
- [ ] Can we bypass auth with IP spoofing?
- [ ] Check for mass assignment vulnerabilities
- [ ] Check SSO
- [ ] Carefully review SAML/OAuth2