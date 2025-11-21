# SQL Injection Cheatsheet

- [ ] Look for any endpoint/functionality that seems like it is touching the DB
	- Try injecting a single or double quote and look for changes in response
	- Try adding comments on login forms to bypass authentication
	- Try to enumerate the database type and version
- [ ] Check if you can trigger an error
	- Visible errors
	- Conditional errors (e.g., divide by zero)
- [ ] Check if you can trigger a conditional response
- [ ] Try to trigger a time delay
	- sleep
- [ ] 
