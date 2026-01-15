---
tags:
  - BAC
  - BFLA
  - BOLA
  - IDOR
---
# Broken Access Control
## Definition of Terms

## Checks

- [ ] What is in scope?
- [ ] Subdomain recon
	- [ ] What is Internet facing?
- [ ] What is on each subdomain
	- [ ] Search engine dorking
	- [ ] gau/waymore
	- [ ] GitHub
	- [ ] Fuzzing - can we fuzz URI paths?
- [ ] Manually walk the application
	- [ ] Web browser
	- [ ] Load JS files
	- [ ] Find hidden pages/endpoints
- [ ] How can I register?
	- [ ] Create an account or sign up for service
	- [ ] Are you willing to buy things?
	- [ ] Make transactions
		- Can I make transactions for other users? 
		- Can I see previous orders/payment details/etc.?
- [ ] Understand how the application works
    - [ ] How does it fetch/create/modify/delete data?
- [ ] Read JS until your eyes bleed
	- [ ] Passwords, credentials, secrets
	- [ ] API keys
	- [ ] Paths, URIs, API structure
	- [ ] Object identifiers
- [ ] Look for numerical id's in requests
    - [ ] URL query string
    - [ ] POST body
    - [ ] etc.
- [ ] Create a list of interesting object ID
	- [ ] Request params
	- [ ] Response params
	- [ ] URI path params
	- [ ] Headers
- [ ] Try object IDs as params
	- [ ] Swap values
- [ ] Test with two users and swap ids to see if you can access the other user's data
- [ ] Look for any encrypted/encoded data that may be used to fetch data.
    - [ ] Try to understand how it's created and see if we can spoof it
- [ ] Check to see if there is a way to leak the UUID of the other user, if used.
    - [ ] Report a user
    - [ ] Look at the profile image
    - [ ] Any other way of interacting with a user
- [ ] Find the open windows if the front door is shut

!!! warning 
	Not every IDOR/BAC constitutes a security vulnerability. If the only thing leaked is information that is already accessible on the site, then it's not a valid vulnerability. Be sure to carefully review the impact for any IDOR/BAC you identify to make sure that it's an actual vulnerability.


