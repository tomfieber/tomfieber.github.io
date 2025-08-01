# Cross-Origin Resource Sharing (CORS)

Cross-Origin Resource Sharing (CORS) is a browser security feature that allows a web page from one domain (the "origin") to access resources on another domain. It is an extension of the Same-Origin Policy (SOP) and provides a way to relax its restrictions in a controlled manner.

While CORS adds flexibility, a misconfigured policy can open the door to cross-domain attacks. It is important to note that **CORS is not a protection against Cross-Site Request Forgery (CSRF)**.

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

The SOP generally allows a domain to *send* requests to other domains, but it prevents the requesting domain from *reading* the responses.

## How CORS Works

CORS allows servers to explicitly specify which origins are permitted to access their resources. This is done through HTTP headers.

- **`Access-Control-Allow-Origin`:** This is the most important CORS header. The server includes this header in its response to indicate which origins are allowed. For example:
    ```http
    Access-Control-Allow-Origin: https://www.trusted-site.com
    ```
    A wildcard (`*`) can be used, but this is often insecure as it allows any domain to access the resource.

- **Preflight Requests:** For requests that can modify data (e.g., `PUT`, `DELETE`) or use certain headers, the browser first sends a "preflight" request using the `OPTIONS` method. This request checks if the server understands and approves the actual request. If the server responds favorably to the `OPTIONS` request, the browser then sends the actual request.

