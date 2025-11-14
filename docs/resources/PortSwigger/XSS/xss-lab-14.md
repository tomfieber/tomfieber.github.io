---
tags:
  - xss
  - filter-bypass
---
# Reflected XSS into HTML context with most tags and attributes blocked

## Instructions

This lab contains a reflected XSS vulnerability in the search functionality but uses a web application firewall (WAF) to protect against common XSS vectors.

To solve the lab, perform a cross-site scripting attack that bypasses the WAF and calls the `print()`function.

## Solution

Note that our search term is reflected in an `<h1>` tag.

![](attachments/xss-lab-14/file-20251113115027525.png)

If we try to break out of that h1 tag and use an img tag to trigger the print() function, then we get "Tag is not allowed".

![](attachments/xss-lab-14/file-20251113115239661.png)

Here, we can use PortSwigger's XSS cheatsheet to copy a list of all tags over to automate/intruder to see what tags might bypass this filter. 

Here we see that `<body>` and custom tags are allowed. 

![](attachments/xss-lab-14/file-20251113115626060.png)

Trying the `<xss>` tag works and we can see that it is not blocked. 

![](attachments/xss-lab-14/file-20251113120115390.png)

Now we need to figure out what event handlers might be allowed. Add one and check in replay.

Using `onerror` we get the "Attribute not allowed" error

![](attachments/xss-lab-14/file-20251113120235016.png)

