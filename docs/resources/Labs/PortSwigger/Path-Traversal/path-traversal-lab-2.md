---
tags:
  - path-traversal
---
# File path traversal, traversal sequences blocked with absolute path bypass

## Instructions

This lab contains a path traversal vulnerability in the display of product images.

The application blocks traversal sequences but treats the supplied filename as being relative to a default working directory.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

## Solution

Once again, note how the images are being loaded by reviewing the request in your proxy.

```text title="Images being loaded"
GET /image?filename=51.jpg HTTP/1.1
Host: 0a1700a70458b4f380078b6b00b30057.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Connection: keep-alive
Referer: https://0a1700a70458b4f380078b6b00b30057.web-security-academy.net/
Cookie: session=raYLupTJtiMAXdJHwauhLSzQ1SN2uqiu
Sec-Fetch-Dest: image
Sec-Fetch-Mode: no-cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: orange
Priority: u=5, i


```

However, this time if we try the same basic path traversal sequence we're blocked.

![](attachments/path-traversal-lab-2/file-20251124113610556.png)

Since this lab treats the provided file name as being relative to a default working directory, we can just replace the filename with `/etc/passwd` to get the contents of the passwd file and solve the lab. 

![](attachments/path-traversal-lab-2/file-20251124113610557.png)

## Lesson learned

Always try to access the file directly. This is probably a good first check. 