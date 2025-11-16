---
tags:
  - websockets
  - xss
---
# Manipulating the WebSocket handshake to exploit vulnerabilities

## Instructions

This online shop has a live chat feature implemented using WebSockets.

It has an aggressive but flawed XSS filter.

To solve the lab, use a WebSocket message to trigger an `alert()` popup in the support agent's browser.

## Solution

Notice that if we try to send any kind of malicious string our IP address gets blocked. 

I added a rule to add an `X-Forwarded-For: 1.1.1.1` header to all my requests to get around this. 

Also notice that if we try to enter our XSS payload directly in the chat window that it is properly output encoded, thereby causing the payload to not fire. 

![](attachments/websockets-lab-3/file-20251116070410328.png)

Now, if we intercept the websocket chat request and modify it in the proxy, we get our alert box.

![](attachments/websockets-lab-3/file-20251116070512121.png)


![](attachments/websockets-lab-3/file-20251116070311836.png)

And the lab is solved.

## Lesson learned

Try different IP headers to get around IP-based blocks. Also, if the XSS payload is not working, try various obfuscated payloads since the filter may just be looking for "alert" or something similar, but not variations in casing, encoding, etc.
