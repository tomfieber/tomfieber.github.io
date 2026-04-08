---
date: 2026-04-08T07:35:00
tags:
  - htb
  - cwes
  - appsec
title: "HackTheBox Certified Web Exploitation Specialist: Review and Recommendations"
draft: false
summary: My review of the HackTheBox Certified Web Exploitation Specialist (CWES) exam. I'll discuss my thoughts on the exam and make recommendations for how to best prepare for it.
categories:
  - certifications
  - htb
---
## Overview

I recently attempted (and thankfully passed) the HackTheBox Certified Web Exploitation Specialist (CWES) certification exam. This is my review of the HTB Academy Web Penetration Tester job role path, which is a prerequisite for attempting the exam, and the exam itself. Obviously I won't go into too much detail on the exam to stay out of HTB jail, but I'll try to give a good enough summary to maybe help anyone who is on the fence. 

## TL;DR

The CWES is a really good entry-level web application pentesting certification. The Web Penetration Tester learning path on HTB Academy does a really good job of taking someone from having basic Linux knowledge to being able to perform a web application test at an intermediate level. I feel like this was the most challenging web certification I've done up to this point. The CWES exam is harder than the TCM PWPP and is MUCH (much, much, much) harder than the eWPT from INE. Having said that, the learning path teaches everything that's needed to pass the exam, albeit with some "HTB-isms" thrown in that can be tricky. The concept of "Keep It Simple, Stupid" definitely applies here. You've got seven days to perform the test and submit the report, so you'll probably run out of ideas before you run out of time. If you start to get stuck, refer back to the material to make sure you're not missing something. 

## The Learning Path

![](Pasted%20image%2020260406074305.png)

The Web Penetration Tester path on HTB Academy consists of 20 modules ranging from "Fundamental" to "Medium" difficulty. A brief summary of each module is listed below:

**Web Requests**
: This module covers the basics of HTTP requests and shows students how to send HTTP requests using various tools and with different HTTP methods.

**Introduction to Web Applications**
: Covers the basics of web applications, including common architectures, the meaning of "front-end" and "back-end", and a very brief overview of common web vulnerabilities. This module also provides an introduction to APIs and the OWASP Web Application Top-10.

**Using Web Proxies**
: This module covers how to set up and use web proxies. The module covers Burp Suite Community and ZAP. I used Caido on the exam and it worked just fine, so if you're more comfortable with Caido, you don't need to switch for this exam. 

**Information Gathering - Web Edition**
: This modules goes over the fundamentals of web reconnaissance, including WHOIS, DNS, subdomains, virtual hosts, web crawling, and how to fingerprint web technologies in use. 

**Web Fuzzing**
: This section covers how to use a variety of tools to uncover hidden directories, files, and/or parameters to identify additional vulnerabilities. 

**JavaScript Deobfuscation**
: Covers the basics of deobfuscating client-side code to uncover sensitive data or vulnerabilities hidden by "security through obscurity". 

**Cross-Site Scripting**
: This module provides an introduction to cross-site scripting (XSS), including a discussion on what XSS is, where and how it occurs, how it can be exploited, and how it can be prevented.

**SQL Injection Fundamentals**
: This section goes over the basics of what a database is, what is meant by "SQL injection" and how SQL injection can be used to subvert web application logic and/or bypass authentication. Additionally, it goes over how to read and write local files via SQL injection and how to mitigate SQL injection vulnerabilities.

**SQLMap Essentials**
: This module goes over installing and using SQLMap to find and exploit SQL injection vulnerabilities in web applications. The module goes over advanced usage and tuning to bypass different types of protections. 

**Command Injections**
: The command injections module teaches how to identify inputs that may be vulnerable to injection vulnerabilities, creating injection payloads, bypassing filters, and offers an introduction to secure coding principles to prevent command injection vulnerabilities. 

**File Upload Attacks**
: This module focuses on how to identify file upload vulnerabilities and how to bypass filters to upload restricted file types. 

**Server-Side Attacks**
: This module provides an introduction to Server-Side Request Forgery, Server-Side Template Injection, Server-Side Includes, and Extensible Stylesheet Language Transformations (XSLT). 

**Login Brute Forcing**
: Covers the basics of brute forcing logins for various services and provides an introduction to commonly used brute forcing tools, as well as creating custom password lists. 

**Broken Authentication**
: This section provides an overview of authentication methods and means to bypass them, including attacks on password-based authentication and improper session handling.

**Web Attacks**
: This is another broad section that gives students an introduction to HTTP verb tampering, Insecure Direct Object Reference (IDOR), and XML External Entity (XXE) injection. 

**File Inclusion**
: This module is an introduction to file inclusion vulnerabilities, covering Local File Inclusion (LFI), Remote File Inclusion (RFI), bypassing restrictions, and different methods to achieve remote code execution through LFI.

**Attacking GraphQL**
: Pretty much what it says on the tin.

**API Attacks**
: This module goes over the OWASP API Top-10 from 2023 (That's the current version).

**Attacking Common Applications**
: Another broad module. This module provides an introduction to footprinting, enumerating, and attacking WordPress, Joomla, Drupal, Tomcat, Jenkins, Splunk, PRTG Network Monitor, osTicket, GitLab, and more.

**Bug Bounty Hunting Process**
: I feel like this module is a bit of a legacy from when the job role path was first launched as the required learning for the Certified Bug Bounty Hunter certification. It goes over how bug bounty programs are structured and how to write professional findings.

Overall, I believe the learning path is good and is a very solid introduction to web exploitation. If you're coming into this with no prior knowledge, then this path will be perfect. If you've already got some background with Linux, web development, penetration testing, or bug bounty, then the first few modules will probably feel really slow. Having said that, there are still some nuggets in there that can be useful for even experienced testers. Regardless, you can't skip them, so just take good notes and move through them. 

![](Pasted%20image%2020260408055200.png)

## The Exam

### The Good

#### Stable Exam Environment

I've heard mixed reviews, but I found the exam environment to be very stable. I didn't have any major issues with it during the entire 7-day exam window. I've sat in exams where running a basic `nmap` scan would cause the entire environment to panic and go cry in the corner...which subsequently made me want to throw my laptop off the roof. I didn't have that experience here; the exam was generally stable and even though heavy fuzzing on one endpoint did cause a bit of a hiccup on around day 3, the application recovered itself so no big issue. 

#### Exam Difficulty

The exam is challenging. In some cases, I was pretty sure I knew what the attack vector was supposed to be right away, and in others there were a few things that it could have been. That forced me to really look into all the application functionality (which you should be doing anyway) and test multiple things to figure out what was actually exploitable and what was locked down pretty well. Although challenging, I don't feel like anything on the exam was overly _**TECHNICALLY**_ difficult, but not everything will be straightforward and the exam certainly doesn't spoon-feed anything. 

![When you get frustrated - take a break!](Pasted%20image%2020260408061200.png)

There were a couple points where I was 100% certain I was not going to figure the attack out, but after coming back from a break and going back to basics, I'd usually realize that I had missed a check somewhere, and doing the thing that I had missed unlocked the whole thing.

#### Time Allotted

The exam is seven days, which includes testing and reporting. I felt like this was more than enough. I was originally going to scrap my attempt because I can't read a calendar and didn't realize my wife was going to be home from a travel nursing assignment for a few days in the middle of my exam. So even with taking a few days more or less off in the middle of my exam window, I was still able to get all the flags and get my report submitted  with a little bit of time to spare.

On one hand, it might be difficult to take seven days off work; if your job allows you time on the clock to take certifications, awesome! If not, it might be a challenge to work and do the exam in your free time, especially if you're juggling other responsibilities. On the other hand, seven days is PLENTY of time...if you've absorbed the course material and have good notes, you'll probably run out of ideas before you run out of time. Which brings me to the next point...

#### Learning Path Coverage

Unlike some other exams I've taken, the Web Penetration Tester learning path teaches everything required to pass the CWES exam. A word of caution, though...don't rely solely on the cheatsheets provided. When I say everything needed to pass the exam is in the course material, that's a true statement. I didn't say everything needed to pass the exam is in the cheatsheets. I recommend making your own notes/cheatsheets as you go through the material and using the cheatsheets HTB provides to supplement your own notes or to check that you haven't missed anything. What you need might not always be obvious, but it's there. 

### The "Bad"

I put "bad" in quotes because I don't really have any serious complaints about this exam. There are a couple things I think would have been pretty cool, but I feel like going into those would give too much away about the exam, so I'll shut my face hole on those for now. 

One thing I will mention, and take this for what it's worth, is that the report template (.docx file) provided by HTB was extremely difficult for me to read and work with. Maybe I'm just old and my eyes are going, but the combination of colors used was not great. I **STRONGLY** recommend using the HTB templates with [SysReptor](https://github.com/Syslifters/sysreptor). This tool will allow you to write your findings in markdown and automatically format them for you in a pretty, HTB-approved template without needing to fight with the Word document. 

## Recommendations

I do have a few recommendations for preparing for the CWES certification exam. A lot of these are "Your mileage may vary" type things, so either take them or don't. If something else works for you, use that.

- Take detailed notes as you go through the learning material. You don't need to write every word down, but make sure you make note of every concept. For example if there's a blurb in the module about "X can be used to achieve RCE via Y", make note of that. That way, if you see Y in the exam, you'll know to try X. My cheatsheets are [here](https://github.com/tomfieber/appsec-cheatsheets) if anyone cares to take a look. I'm currently updating the structure a little bit, but it should give you an idea of what I mean.
- Take breaks. Like I said, there is plenty of time in this exam, so there's no need to run yourself ragged trying to get it all done in one sitting. Make sure to step away from the computer every so often; eat, drink, touch grass. 
- Keep it simple. While this exam is challenging, it is not an advanced level certification. As I mentioned, nothing on the exam is really technically difficult or convoluted...it might just be tricky. If you find yourself trying some exotic or complicated attack chain, to exploit a thing, you're doing it wrong. If you're trying to brute force something and it doesn't crack in a couple minutes (at most), it's probably not the way. 
- If you start feeling stuck, go back to your notes and/or checklists. I'm willing to bet you missed something simple. Review your checks and go back through them. If that's still not working and you're pretty confident you've got the right attack vector, go back and review the course material.
- Don't get tunnel vision! Most things on the exam seemed pretty obvious, but there were some that were really easy to miss if you're too focused on other stuff. Make sure you test all the application functionality in different ways. Please note these aren't necessarily specific to the exam...they're just examples of things to consider.
	- What happens if I change the request method?
	- What if I provide a string instead of an integer?
	- Can I modify the content type and get a different response?
	- Is there anyone looking at what I'm sending? What can I do with that?
- Report as you go. Take a little bit of time before the exam to get SysReptor (or whatever you feel like using) set up. Get the administrative sections of the report filled out ahead of time. As you go through the exam, write the finding whenever you get a flag. Including screenshots and step-by-step reproduction instructions as you go through will be much easier than trying to go back and do it all at the end (like I did). If you're reading this (Hi Mom!) before you start the Web Penetration Tester learning path, I'd actually recommend getting SysReptor set up when you first start the path, and add finding templates as you go through. Take the finding description, impact, and remediation recommendation from the material and use that to build out the finding in SysReptor. That way, when you go to report it's just a matter of plugging in the reproduction steps and screenshots!

![](Pasted%20image%2020260408071314.png)

## Conclusion

I had a lot of fun with this exam! I didn't do a lot of web application pentests in my last job, and since I left there I've been getting more interested in application security. I feel like going through the Web Penetration Tester job role path and taking the CWES exam has really solidified a lot of the concepts that I previously struggled to wrap my brain around. In the end, I was able to score a 100/100 on this exam, which I definitely wouldn't have been able to do 6 months ago. I highly recommend this path and exam to anyone looking to get into web hacking! 

While I can't go into specifics on the exam, I'm happy to answer any general questions about the learning path, application security, or just chat about anything else "cyber-y". Feel free to connect with me on Discord! 

<div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="26c06e42-eb44-4005-babe-e98a54ef3837" data-share-badge-host="https://www.credly.com"></div><script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>