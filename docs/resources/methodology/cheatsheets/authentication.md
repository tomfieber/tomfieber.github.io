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

## OAuth 2.0

Enables applications to request limited access to a user's account on another application (e.g., log in with Google)

- User does not need to give their credentials to the requesting application

From PortSwigger

- **Client application** - The website or web application that wants to access the user's data.
- **Resource owner** - The user whose data the client application wants to access.
- **OAuth service provider** - The website or application that controls the user's data and access to it. They support OAuth by providing an API for interacting with both an authorization server and a resource server.

### Checks

- [ ] Look for requests to `/authorization` in a web proxy
	- [ ] Specifically look for `client_id`, `redirect_uri`, and `response_type` parameters
- [ ] Check for:
	- [ ] `/.well-known/oauth-authorization-server`
	- [ ] `/well-known/openid-configuration`
- [ ] Check for CSRF protection
	- [ ] Make sure the request contains a `state` parameter
	- [ ] 