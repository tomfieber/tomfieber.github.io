---
tags:
  - authn
  - cookies
---
# Brute-forcing a stay-logged-in cookie

## Instructions

This lab allows users to stay logged in even after they close their browser session. The cookie used to provide this functionality is vulnerable to brute-forcing.

To solve the lab, brute-force Carlos's cookie to gain access to his **My account** page.

- Your credentials: `wiener:peter`
- Victim's username: `carlos`
- [Candidate passwords](https://portswigger.net/web-security/authentication/auth-lab-passwords)

## Solution

When logging in an selecting the "stay logged in" option, we see that two cookies are set.

![](attachments/authn-lab-9/file-20251111071158334.png)

The session cookie is dynamic and changes every time we log in, but the `stay-logged-in` cookie stays the same. 

Send the login request to sequencer and analyze both cookies. The stay-logged-in cookie entropy is extremely poor.

![](attachments/authn-lab-9/file-20251111072125420.png)

The characters all stay the same, confirming what we observed from sending multiple login requests in repeater. 

![](attachments/authn-lab-9/file-20251111072222538.png)

Looking at the cookie in decoder shows that it is made up of the username and an md5 hash, separated by a colon. We can use this to brute force the password for Carlos. 

![](attachments/authn-lab-9/file-20251111072355745.png)

Send the request for /my-account to intruder. Change the id to carlos, and set a placeholder around the stay-logged-in cookie. Make sure to remove the session token from the intruder request. 

Set the following payload processing rules:

![](attachments/authn-lab-9/file-20251111072701514.png)


After running the attack in intruder, check for responses that stand out. 

![](attachments/authn-lab-9/file-20251111073005269.png)

This solves the lab.