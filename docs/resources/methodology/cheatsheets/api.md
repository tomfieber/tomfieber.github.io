# API Testing

## Definitions

??? tip "OWASP API top-10"

	All of these are taken directly from APISecUniversity. 
	
	??? example "Broken Object Level Authorization"
		### Broken Object Level Authorization
		![](./attachments/api/image-1.png)
	
	??? example "Broken Authentication"
		### Broken Authentication
		![](./attachments/api/image-2.png)
	
	??? example "Broken Object Property Level Authorization"
		### Broken Object Property Level Authorization
		![](./attachments/api/image-3.png)
	
	??? example "Unrestricted Resource Consumption"
		### Unrestricted Resource Consumption
		![](./attachments/api/image-4.png)
	
	??? example "Broken Function Level Authorization"
		### Broken Function Level Authorization
		![](./attachments/api/image-5.png)
	
	??? example "Unrestricted Access to Sensitive Business Flows"
		### Unrestricted Access to Sensitive Business Flows
		![](./attachments/api/image-6.png)
	
	
	??? example "Server-Side Request Forgery"
		### Server-Side Request Forgery
		![](./attachments/api/image-7.png)
	
	
	??? example "Security Misconfigurations"
		### Security Misconfigurations
		![](./attachments/api/image-8.png)
	
	??? example "Improper Inventory Management"
		### Improper Inventory Management
		![](./attachments/api/image-9.png)
	
	??? example "Unsafe Consumption of APIs"
		### Unsafe Consumption of APIs
		![](./attachments/api/image-10.png)

## API Authentication

??? tip "Types of authentication"

	### Basic Authentication
	
	- Uses the HTTP Authorization header with the "Basic" scheme
	- Base-64 encoded value of the `username:password`
	
	### API Keys
	
	- No standard way of presenting the API key
	- Username and password at once
	- Only machine identity
	
	### TLS Authentication
	
	- Using mutual TLS for authentication
	- Both parties present certificates to authenticate themselves
	- Conveys machine identities

	### OAuth and OpenID Connect
	
	- OAuth is a delegation protocol
		- API access is the main goal
	- OpenID Connect is an Identity layer on top of OAuth
		- Defines user authentication metadata
		- Can control authentication
		- Federation
	

### OAuth

OAuth is a delegation protocol

4 actors

- Resource Owner
	- "The user"
- Client
	- 3rd party application
- Authorization Server
	- The server that handles the delegation auth
- Resource Server
	- Stores the resource owner's data - "the API"

- [ ] OAuth delegates access to applications on a user's behalf
- [ ] Delegation != authorization

## API Recon

### Passive API recon

Perform recon without touching the target.

### Google dorking

```
# Basic

$target api
$target docs
$target developers
$target graphql

# intitle
intitle:"api" site:target.com

# inurl
inurl:"/api/v1" site:target.com
inurl:"/api/v2/" site:target.com
```

### GitHub

Check github for leaked secrets

### Finding API Documentation

- [ ] Check for common documentation paths:

```
/api
/api/docs
/api/swagger
/api/swagger-ui.html
/api/v1/docs
/swagger.json
/openapi.json
/api-docs
/graphql
/graphiql
/altair
/playground
```

- [ ] Check Wayback Machine for old/removed API docs
- [ ] Look for Postman collections shared publicly

## Active Testing

### Authentication & Authorization

- [ ] Test endpoints with no auth token
- [ ] Test with expired tokens
- [ ] Test with tokens from a different user (horizontal privilege escalation)
- [ ] Test with a low-privilege token on admin endpoints (vertical privilege escalation)
- [ ] Check if API keys are in the URL (leaked via logs/Referer)

### HTTP Method Testing

- [ ] Try all methods on each endpoint (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD)
- [ ] Check if `PUT`/`DELETE` are allowed where they shouldn't be

### Input Validation

- [ ] Test with unexpected data types (strings where ints expected, arrays where strings expected)
- [ ] Send oversized payloads
- [ ] Test with special characters and encoding
- [ ] Check for mass assignment — send additional properties in POST/PUT requests

```json
{ "username": "user", "role": "admin" }
```

### Rate Limiting

- [ ] Check if rate limiting exists on sensitive endpoints (login, password reset, OTP)
- [ ] Try bypassing with `X-Forwarded-For` header rotation

### Information Disclosure

- [ ] Check verbose error messages
- [ ] Check for stack traces in responses
- [ ] Look for internal IPs, paths, or debug info in responses
- [ ] Test `Accept` header variations (`application/xml`, `text/html`)

### GraphQL-Specific

- [ ] Test for introspection:

```json
{ "query": "{__schema{types{name,fields{name}}}}" }
```

- [ ] Check for disabled introspection bypass with newline:

```json
{ "query": "\n{__schema{types{name,fields{name}}}}" }
```

- [ ] Look for query batching for brute force
- [ ] Test for excessive depth/complexity (DoS)

---

## References

- [OWASP API Security Top 10](https://owasp.org/API-Security/)
- [PortSwigger - API Testing](https://portswigger.net/web-security/api-testing)
