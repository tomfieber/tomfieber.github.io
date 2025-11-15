---
tags:
  - websockets
  - xss
---
# Manipulating WebSocket messages to exploit vulnerabilities

## Instructions

This online shop has a live chat feature implemented using WebSockets.

==Chat messages that you submit are viewed by a support agent in real time.==

To solve the lab, use a WebSocket message to trigger an `alert()` popup in the support agent's browser.

## Solution

Note that chat messages are viewed by support in real time. 

Intercept or send a WS request to repeater and modify it as follows:

![](attachments/websocket-lab-1/file-20251114170950560.png)

This will trigger the alert and solve the lab. 

## Lesson learned

If websockets are in use, check to see how the data is being handled. If it's being reflected without output encoding, it may be possible to abuse to achieve XSS.

