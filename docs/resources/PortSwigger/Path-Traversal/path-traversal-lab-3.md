---
tags:
  - path-traversal
---
# File path traversal, validation of start of path

## Instructions

This lab contains a path traversal vulnerability in the display of product images.

The application transmits the full file path via a request parameter, and validates that the supplied path starts with the expected folder.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

## Solution

Notice that this lab includes the full path in the request.

```text title="Full path is included"
GET /image?filename=/var/www/images/23.jpg HTTP/1.1
Host: 0a3300bf036250d480e5940f00630015.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Connection: keep-alive
Referer: https://0a3300bf036250d480e5940f00630015.web-security-academy.net/
Cookie: session=3p7nurOK3wQCWh3r8GQdS8pKrUVDDZt4
Sec-Fetch-Dest: image
Sec-Fetch-Mode: no-cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: orange
Priority: u=5, i


```

Notice that if we try to replace the entire path with only the path traversal sequences and the target file name, the application complains about it.

![](attachments/path-traversal-lab-3/file-20251113094513513.png)

This suggests that we probably need the full path there.

Since the application is validating that the start of the path, we know that we need to navigate back up three directories to the root directory to access the `/etc/passwd` file. 

![](attachments/path-traversal-lab-3/file-20251113094349250.png)

This solves the lab. 

## Lesson learned

Check to see if the application is validating the start of the path. If so, include that in the request and traverse from there. 