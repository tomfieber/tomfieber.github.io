---
tags:
  - authn
  - mfa
---
# 2FA simple bypass

## Instructions

This lab's two-factor authentication can be bypassed. You have already obtained a valid username and password, but do not have access to the user's 2FA verification code. To solve the lab, access Carlos's account page.

- Your credentials: `wiener:peter`
- Victim's credentials `carlos:montoya`

## Solution

First, we can log into our own account and see how the login flow works. 

After entering our credentials, we're presented a form to submit our MFA code. 

![](attachments/authn-lab-2/file-20251124113610435.png)

We can check the email for the MFA code.

![](attachments/authn-lab-2/file-20251124113610436.png)
The following request sends the MFA code

```text title="Sending the MFA code"
POST /login2 HTTP/2
Host: 0a89006a043eb46681d875b500b800fa.web-security-academy.net
Cookie: session=Dgm7XzPmB67vOBpTUJ3KoviUjiPBwhnk
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 13
Origin: https://0a89006a043eb46681d875b500b800fa.web-security-academy.net
Referer: https://0a89006a043eb46681d875b500b800fa.web-security-academy.net/login2
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Priority: u=0, i
Te: trailers

mfa-code=0441
```

Then the subsequent request is:

```text title="Post MFA request"
GET /my-account?id=wiener HTTP/2
Host: 0a89006a043eb46681d875b500b800fa.web-security-academy.net
Cookie: session=aUOSkOrcURGd8Pt7uCh5HprVwH1zJE73
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://0a89006a043eb46681d875b500b800fa.web-security-academy.net/login2
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Priority: u=0, i
Te: trailers


```

What happens if we try to bypass the second login request where we send the MFA code and access the my-account page directly?

Note there is no POST request to the /login2 endpoint.

![](attachments/authn-lab-2/file-20251124113610439.png)

We're able to navigate directly past the MFA prompt and solve the lab.

![](attachments/authn-lab-2/file-20251124113610441.png)

