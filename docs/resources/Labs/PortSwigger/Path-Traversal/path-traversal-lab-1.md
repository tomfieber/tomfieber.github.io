---
tags:
  - path-traversal
---
# File path traversal, simple case

## Instructions

This lab contains a path traversal vulnerability in the display of product images.

To solve the lab, retrieve the contents of the `/etc/passwd` file.

## Solution

When we first access the lab, notice how the images are loaded.

```text title="How are the images loaded?"
GET /image?filename=9.jpg HTTP/1.1
Host: 0af5009504f8b49b8042770700cd00c6.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Connection: keep-alive
Referer: https://0af5009504f8b49b8042770700cd00c6.web-security-academy.net/
Cookie: session=KSPI74XXUKySfZDX7aiAdN07PzPaMrWt
Sec-Fetch-Dest: image
Sec-Fetch-Mode: no-cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: orange
Priority: u=5, i


```

Send this request to repeater.

We can use a basic path traversal sequence (`../`) to navigate "up" out of the current directory to the root of the file system and access the `/etc/passwd` file as shown below. In this case, there are no filters in place to prevent this.

![](attachments/path-traversal-lab-1/file-20251124113610552.png)

This solves the lab.

## Lesson learned

Whenever you see a file being retrieved like this, try to see if you can load other files by navigating out of the current directory using a path traversal sequence. 