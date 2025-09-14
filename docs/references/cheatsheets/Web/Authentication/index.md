## Checks

- [ ] Does the response set any cookies that can be modified?
	- [ ] How are tokens generated? Sometimes they're just encoded and can be easily modified -- example: `Set-Cookie: auth=7e58d63b60197ceb55a1c487989a3720`
- [ ] Try to identify how values are compared. Different methods of string comparison can generate different results.
	- [ ] Case insensitivity
	- [ ] Leading or trailing spaces
	- [ ] 

