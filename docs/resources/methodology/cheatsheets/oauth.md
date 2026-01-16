---
tags:
  - oauth
---
# OAuth 2.0
## Reconnaissance & Discovery

- [ ] **Identify the Grant Type:** Determine if the application uses Authorization Code, Implicit (legacy), Client Credentials, or Resource Owner Password Credentials.
    
- [ ] **Map Endpoints:** Locate the Authorization Endpoint (`/authorize`), Token Endpoint (`/token`), and UserInfo Endpoint (`/userinfo`).
    
- [ ] **Analyze Client Parameters:** Identify the `client_id` and check if `client_secret` is visible in client-side code (mobile/SPA).
    
- [ ] **Review Discovery Document:** Check `/.well-known/openid-configuration` or `/.well-known/oauth-authorization-server` for supported scopes, claims, and endpoints.
    

## Authorization Request Manipulation (`/authorize`)

- [ ] **Test `redirect_uri` Validation (Exact Match):** Modify the `redirect_uri` to a domain you control.
    
- [ ] **Test `redirect_uri` Traversal:** Attempt path traversal (e.g., `https://site.com/callback/../../attacker.com`).
    
- [ ] **Test `redirect_uri` Fuzzy Matching:** Check if subdomains or related domains are accepted (e.g., `https://attacker.site.com` or `https://site.com.attacker.com`).
    
- [ ] **Check for Open Redirects:** Use an open redirect on the trusted domain in the `redirect_uri` parameter (e.g., `https://site.com/logout?next=https://attacker.com`).
    
- [ ] **Test for CSRF (Missing `state`):** Remove the `state` parameter and replay the flow.
    
- [ ] **Test for CSRF (Static `state`):** Verify if the `state` parameter is random and unique per session.
    
- [ ] **Scope Escalation:** Manually add privileged scopes (e.g., `admin`, `write`, `all`) to the authorization request.

??? example "Testing redirect_uri"

	### Baseline Validation
	
	- [ ] **Identify the Allowed URI:** Capture a legitimate authorization request and note the exact `redirect_uri` value.
	    
	- [ ] **Verify Exact Match Enforcement:** Change a single character in the path or subdomain to see if the server rejects it (e.g., change `/callback` to `/callbac`).
	    
	- [ ] **Check HTTP vs. HTTPS:** Change the protocol to `http://` to see if the server allows downgrades (unless `localhost` is used).
	    
	
	### Domain & Logic Bypasses
	
	- [ ] **Test Subdomain Wildcards:** Attempt to use a different subdomain on the trusted domain (e.g., `api.target.com` instead of `app.target.com`).
	    
	- [ ] **Test "Ends With" Logic:** Register a domain that ends with the target's name (e.g., `target.com.attacker.com`) and test it.
	    
	- [ ] **Test "Contains" Logic:** Create a directory structure that mimics the target domain (e.g., `attacker.com/target.com/callback`).
	    
	- [ ] **Test IPv6/IP Decimal:** Replace the domain name with its IP address, decimal IP representation, or IPv6 literal `[::1]`.
	    
	
	### Syntactic Manipulation & Encoding
	
	- [ ] **The "@" Bypass (Authority Confusion):** Inject `target.com@attacker.com` to treat the target domain as a username credential for the attacker's site.
	    
	- [ ] **Double URL Encoding:** Encode characters like `.` (%252E) and `/` (%252F) to bypass filters that decode only once.
	    
	- [ ] **Null Byte Injection:** Append `%00` to the end of a valid domain followed by your payload (e.g., `target.com%00.attacker.com`).
	    
	- [ ] **Whitespace Injection:** Append tabs (`%09`), newlines (`%0a`), or spaces (`%20`) to the URI.
	    
	- [ ] **Backslash Conversion:** Replace forward slashes `/` with backslashes `\` (common bypass for Windows-based servers).
	    
	
	### Parameter Pollution & Chaining
	
	- [ ] **Parameter Pollution (HPP):** Add a second `redirect_uri` parameter (e.g., `?redirect_uri=VALID&redirect_uri=ATTACKER`).
	    
	- [ ] **Chained Open Redirect:** Identify an open redirect vulnerability on the _trusted_ domain (e.g., `target.com/logout?next=...`) and use it as the `redirect_uri` value.
	    
	- [ ] **Fragment Injection:** Append `#` to truncate the path if the server validation is loose (e.g., `target.com#attacker.com`).


## Token Exchange & Handling (`/token`)

- [ ] **Authorization Code Replay:** Attempt to exchange the same Authorization Code for an access token more than once.
    
- [ ] **PKCE Downgrade:** If PKCE is used, remove the `code_challenge` and `code_challenge_method` from the authorization request.
    
- [ ] **PKCE Method S256 vs plain:** Force the method to `plain` if the server supports it, to bypass hashing requirements.
    
- [ ] **Client Secret Leakage:** Check if the `client_secret` is leaked in JS files, GitHub repos, or mobile app binaries.
    
- [ ] **Token Injection via Implicit Flow:** If the app supports `response_type=token`, try to force this flow even if the app defaults to `code`.
    
- [ ] **Referer Header Leakage:** Check if the Authorization Code or Access Token leaks in the `Referer` header when linking to external sites.
    

## Token Validation & Session Management

- [ ] **JWT Analysis (Algorithm Confusion):** If the token is a JWT, test changing the algorithm from `RS256` to `HS256` (HMAC) using the public key as the secret.
    
- [ ] **JWT "None" Algorithm:** Change the algorithm header to `none` and remove the signature.
    
- [ ] **Token Expiration:** Verify that Access Tokens expire within a reasonable timeframe (e.g., 1 hour).
    
- [ ] **Refresh Token Rotation:** Ensure that using a Refresh Token invalidates the previous one (if rotation is enabled) or that they are securely bound.
    
- [ ] **Session Fixation:** Check if the user's session ID changes after a successful OAuth login.
    
- [ ] **IDOR on UserInfo:** Use an Access Token from User A to request `/userinfo` data for User B (if the endpoint accepts a user identifier).

## Account Takeover (Pre-Authentication)

- [ ] **Pre-Auth Account Takeover:** Create an account with an email address (e.g., `victim@company.com`) manually, then sign in with OAuth using the same email. Check if the accounts merge without verification.
    
- [ ] **Duplicate Email Registration:** Register a manual account with the same email _after_ an OAuth account exists to see if it overwrites the OAuth link.

## The PKCE Downgrade Attack

Proof Key for Code Exchange (PKCE) protects public clients (like mobile apps) that cannot safely store a client secret. It works by hashing a secret code_verifier into a code_challenge.

- **The Vulnerability:** Many servers support PKCE but do not _enforce_ it for all clients.
    
- **The Attack:** An attacker intercepts the initial `/authorize` request and strips out the `code_challenge`. If the server is not configured to mandate PKCE, it will fall back to the standard flow. The attacker can then use the intercepted Authorization Code to get a token without needing the `code_verifier`.
    

