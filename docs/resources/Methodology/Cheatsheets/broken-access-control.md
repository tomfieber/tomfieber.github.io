---
tags:
  - BAC
  - BFLA
  - BOLA
  - IDOR
---
# Broken Access Control Cheatsheet

## Definition of Terms

**Broken Object Level Authorization**
: Being able to see something you shouldn't be able to see

**Broken Functional Level Authorization**
: Being able to do something you shouldn't be able to do

**Insecure Direct Object Reference**
: Kind of an umbrella term

## Checks

- [ ] Look at the scope
	- What is in scope?
	- What is NOT in scope?
- [ ] Sub-domain recon
	- What is Internet facing?
- [ ] What lives at each sub-domain?
	- Search engine dorking
	- GAU / waymore
	- Github
	- Fuzzing
- [ ] Manually walk the application
	- Web browser
	- Loading JS files
		- REVIEW!
	- Find hidden pages (unknown pages)
- [ ] Does the app allow self-registration? How? 
	- Examples:
		- Open bank account
		- Create a cell phone plan
		- Switch insurance
- [ ] Willing to spend money? 
	- Make transactions
	- Buy products
- [ ] Explore JS until your eyes bleed
	- Passwords
	- Secrets
	- Credentials
	- API keys
	- Paths
	- URIs
	- API structures
	- Other domains
	- Object Identifiers
- [ ] Create a list of important object IDs
	- Request params
	- Response params
	- URI path params
	- headers
- [ ] Try object IDs as params, swapping values
- [ ] Find the open windows...the front door is probably locked.


!!! warning "Important note"

	Not every IDOR/BAC constitutes a security vulnerability. If the only thing leaked is information that is already accessible on the site, then it's not a valid vulnerability. Be sure to carefully review the impact for any IDOR/BAC you identify to make sure that it's an actual vulnerability. 





