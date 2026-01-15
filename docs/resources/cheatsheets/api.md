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

Check for:

- [ ] URL naming schemes
- [ ] Look for the use of JSON or XML
	- [ ] `/application/json`, `/application/xml`
- [ ] Watch responses
	- [ ] `{something}`
- [ ] 