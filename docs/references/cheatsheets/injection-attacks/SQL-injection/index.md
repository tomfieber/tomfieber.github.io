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