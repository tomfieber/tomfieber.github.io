---
tags:
  - authn
  - username-enum
  - response-timing
---
# Username enumeration via response timing

## Instructions

This lab is vulnerable to username enumeration using its response times. To solve the lab, enumerate a valid username, brute-force this user's password, then access their account page.

- Your credentials: `wiener:peter`
- [Candidate usernames](https://portswigger.net/web-security/authentication/auth-lab-usernames)
- [Candidate passwords](https://portswigger.net/web-security/authentication/auth-lab-passwords)

??? warning "Hint"

	To add to the challenge, the lab also implements a form of IP-based brute-force protection. However, this can be easily bypassed by manipulating HTTP request headers.

## Solution

Log in with the credentials provided and note the response time. 

![](attachments/authn-lab-5/file-20251121082955738.png)

Also note the response time when using an invalid username and a long, complex password. 

![](attachments/authn-lab-5/file-20251121082955743.png)

The round-trip response time when trying to log in with a valid username and a long password is significantly longer. 

![](attachments/authn-lab-5/file-20251121082955745.png)

We can use this to filter in intruder. 

Remember that there is a IP block in place, so in the intruder request, add an `X-Forwarded-For` header, and set it to `127.0.0.1`. Set a placeholder on the last octet, and set the payload to numbers, 1-255. Set another placeholder on the username and set the payload to the list of usernames provided. 

Start the pitchfork/parallel attack, and look for round trip time around what we noticed before for a valid username. 

![](attachments/authn-lab-5/file-20251121082955746.png)

So we have a username -- `app`. Send this login request back to intruder and set the placeholders on the last octet of the X-Forwarded-For host and the password.

Run the next parallel attack and look for a response that stands out from the rest somehow.

There is one request that is a 302 status code, showing the correct password is `summer`. 

![](attachments/authn-lab-5/file-20251121082955752.png)

Log in as the `app` user to solve the lab.

