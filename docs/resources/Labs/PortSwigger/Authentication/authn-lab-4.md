---
tags:
  - authn
  - username-enum
---
# Username enumeration via subtly different responses

## Instructions

This lab is subtly vulnerable to username enumeration and password brute-force attacks. It has an account with a predictable username and password, which can be found in the following wordlists:

- [Candidate usernames](https://portswigger.net/web-security/authentication/auth-lab-usernames)
- [Candidate passwords](https://portswigger.net/web-security/authentication/auth-lab-passwords)

To solve the lab, enumerate a valid username, brute-force this user's password, then access their account page.

## Solution

Upon trying to log in with invalid credentials, we get the following error message:

![](attachments/authn-lab-4/file-20251124113610457.png)

Note the period at the end of the message.

Run this through intruder with the username list provided and filter on the previous error message. One username results in a request that is slightly different (no period at the end). 

![](attachments/authn-lab-4/file-20251124113610466.png)

Send that request back to intruder and brute force the correct password with the list of passwords provided. 

```text title="Successful login request"
POST /login HTTP/1.1
Host: 0a43007d046a6c5b853a0a94005800cf.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/x-www-form-urlencoded
Content-Length: 36
Origin: https://0a43007d046a6c5b853a0a94005800cf.web-security-academy.net
Connection: close
Referer: https://0a43007d046a6c5b853a0a94005800cf.web-security-academy.net/login
Cookie: session=dYbWDRS4XMQZ4kYPpHVWUKipIHLqZDVP
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i

username=amarillo&password=123456789
```

Login as amarillo to solve the lab.