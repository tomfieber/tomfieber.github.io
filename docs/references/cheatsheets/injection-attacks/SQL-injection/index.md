# SQL Injection 

## Overview

SQL Injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It occurs when user-supplied data is insecurely included in a database query.

- **Core Vulnerability**: Mixing user **data** with database query **code**.
    
- **Classic Example**: Bypassing a login form.
    
    - **Input**: `admin' OR '1'='1' --`
        
    - **Resulting Query**: `SELECT * FROM users WHERE username = 'admin' OR '1'='1' --' AND password = '...';`
        
    - **Effect**: The `WHERE` clause becomes true for all users, and the password check is ignored (`--` is a comment), allowing a login bypass.

---

## Detection Methods

Methods for discovering SQLi vulnerabilities from the outside.

### Error-Based SQLi

- **Concept**: Provoking the database to return an error message by injecting special characters (`'`, `"`, `--`).
    
- **Indicator**: The application returns a verbose database error (e.g., `"You have an error in your SQL syntax..."`). This confirms the vulnerability and often reveals the database type.

### Blind SQLi

Used when no errors are returned. The attacker infers information based on the application's behavior.

- **Boolean-Based Blind SQLi**:
    
    - **Concept**: Asking the database a series of True/False questions and observing a change in the page content.
        
    - **Example**:
        
        - `... AND '1'='1'` → Page loads normally (True).
            
        - `... AND '1'='2'` → Page returns "not found" or changes (False).
            
    - **Result**: The difference in response acts as a "yes/no" signal.
        
- **Time-Based Blind SQLi**:
    
    - **Concept**: Forcing the database to "sleep" or "wait" for a specified time if a condition is true.
        
    - **Example**: `... AND IF(1=1, SLEEP(5), 0)`
        
    - **Result**: If the page takes 5 seconds longer to load, the condition is true. This is a last resort as it is very slow and noisy.

!!! alert "SQL Injection points"

	Most SQL injection exists in the `WHERE` clause of the `SELECT` statement; however...
	
	Some other common locations where SQL injection arises are:
	
	- In `UPDATE` statements, within the updated values or the `WHERE` clause.
	- In `INSERT` statements, within the inserted values.
	- In `SELECT` statements, within the table or column name.
	- In `SELECT` statements, within the `ORDER BY` clause.

!!! warning "Caution using `OR 1=1`"

	Take care when injecting the condition `OR 1=1` into a SQL query. Even if it appears to be harmless in the context you're injecting into, it's common for applications to use data from a single request in multiple different queries. If your condition reaches an `UPDATE` or `DELETE` statement, for example, it can result in an accidental loss of data.

??? example "PortSwigger SQL Injection Lab 1: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data"

	**Instructions**
	
	To solve the lab, perform a SQL injection attack that causes the application to display one or more unreleased products.
	
	**Exploit**
	
	On this shopping site, we can filter by category. For example, when "accessories" is selected, only three items are shown. 
	
	![](../../../../assets/screenshots/sqli/Pasted%20image%2020250803065121.png)
	
	The following request and response show this:
	
	```
	GET /filter?category=Accessories HTTP/1.1
	Host: 0a8000b80463b54380fff8a8001500cc.web-security-academy.net
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0
	Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
	Accept-Language: en-US,en;q=0.5
	Accept-Encoding: gzip, deflate, br, zstd
	Connection: keep-alive
	Referer: https://0a8000b80463b54380fff8a8001500cc.web-security-academy.net/filter?category=Tech+gifts
	Cookie: session=xcf9s6nU2m49EDeOXGJhsUF1dYJzO1uK
	Upgrade-Insecure-Requests: 1
	Sec-Fetch-Dest: document
	Sec-Fetch-Mode: navigate
	Sec-Fetch-Site: same-origin
	Sec-Fetch-User: ?1
	X-PwnFox-Color: magenta
	Priority: u=0, i
	
	
	```
	
	
	```
	HTTP/1.1 200 OK
	Content-Type: text/html; charset=utf-8
	X-Frame-Options: SAMEORIGIN
	Connection: close
	Content-Length: 4789
	
	[...SNIP...]
	```
	
	Note the content length of 4789. When a single quote character is added, the server complains. 
	
	![](../../../../assets/screenshots/sqli/Pasted%20image%2020250803065507.png)
	
	Notice that if we add a second single quote, the applications calms down again and doesn't return an internal error. To view unreleased items, I used the following string:
	
	```
	' AND 1=1-- -
	```
	
	This shows the awesome and unreleased six-pack beer belt, which is a fantastic idea...btw!
	
	![](../../../../assets/screenshots/sqli/Pasted%20image%2020250803070133.png)
	
	Note that the official solution uses `OR 1=1-- -`, but this seemed to have worked for me. 



---

## Exploitation Techniques

Abusing the vulnerability

### `UNION`-Based SQLi

- **Concept**: The `UNION` operator combines the results of the application's legitimate query with the results of a malicious query crafted by the attacker.
    
- **Process**:
    
    1. **Find Column Count**: Determine the number of columns in the original query using `ORDER BY n--` or `UNION SELECT NULL,NULL,...--`.
        
    2. **Extract Data**: Craft a `UNION SELECT` statement to pull data from other tables.
        
- **Example Payload**: `' UNION SELECT username, password FROM users--`
    

### Advanced Exploitation

These attacks depend on excessive database user privileges.

- **File System Access**: Using database functions like `LOAD_FILE()` to read sensitive files from the server (e.g., `/etc/passwd`).
    
- **Remote Code Execution (RCE)**: Using database features like `xp_cmdshell` (MS-SQL) or user-defined functions to execute operating system commands on the server.
    

---

## Prevention Methods

The best way to secure your applications.

### The Gold Standard: Parameterized Queries

- **Also known as**: Prepared Statements.
    
- **Concept**: This method strictly separates the SQL query logic from the user-supplied data. The query structure is sent and compiled first, then the data is sent separately and safely bound to the query.
    
- **Why it works**: User input is **always treated as data, never as executable code**. The `' OR '1'='1'` payload fails because the database literally looks for a value with that string, which doesn't exist.
    

### Defense-in-Depth Strategy

Using multiple layers of security.

1. **Input Validation**: Check if user input is in the expected format (e.g., is it an integer?) before processing it. Use **allow-listing** (only accepting known-good formats).
    
2. **Principle of Least Privilege**: The application's database account should only have the absolute minimum permissions needed to function. This limits the damage if an injection occurs.
    
3. **Web Application Firewall (WAF)**: A device or service that inspects traffic and blocks requests that match known-bad attack signatures. A good layer, but not a substitute for secure code.

---

## Advanced Topics

### Second-Order SQLi
A two-step attack where a malicious payload is first safely stored in the database, only to be executed later when a different, vulnerable function retrieves and uses that data insecurely.

### Out-of-Band (OOB) SQLi
An exfiltration method where the attacker forces the database to make an external network request (e.g., DNS or HTTP) to a server they control, sending data within that request.

### Automation (SQLMap)
A powerful open-source tool that automates the entire process of detecting, exploiting, and exfiltrating data via SQL injection.


--- 
## Other Labs

??? example "YesWeHack Dojo - SQL Injection"

**Lab 1 - Simple Login Bypass**

![](../../../../assets/screenshots/sqli/Pasted%20image%2020250803122836.png)

Payload:

```
pass' or '1'='1
```

![](../../../../assets/screenshots/sqli/Pasted%20image%2020250803123043.png)

![](../../../../assets/screenshots/sqli/Pasted%20image%2020250803123055.png)

