---
tags:
  - authn
  - username-enum
---
# Username enumeration via different responses

## Instructions

This lab is vulnerable to username enumeration and password brute-force attacks. It has an account with a predictable username and password, which can be found in the following wordlists:

- [Candidate usernames](https://portswigger.net/web-security/authentication/auth-lab-usernames)
- [Candidate passwords](https://portswigger.net/web-security/authentication/auth-lab-passwords)

To solve the lab, enumerate a valid username, brute-force this user's password, then access their account page.

## Solution

When attempting to login with `tester:tester`, we get a message saying "Invalid username".

![](../../../../../site/_drafts/labs/PortSwigger/Authentication/attachments/authn-lab-1/file-20251124113610424.webp)

We can send the login request to intruder and select the username parameter. Add the list of usernames provided for this lab.

One of the requests has a different error message, indicating an incorrect password instead of an invalid username. 

![](../../../../../site/_drafts/labs/PortSwigger/Authentication/attachments/authn-lab-1/file-20251124113610428.webp)

Now we have a username, so we can just send this request back to intruder, and brute force the password with the list provided. 

Again, one of the requests is slightly different.

![](../../../../../site/_drafts/labs/PortSwigger/Authentication/attachments/authn-lab-1/file-20251124113610432.webp)

Log in with these credentials and solve the lab.

