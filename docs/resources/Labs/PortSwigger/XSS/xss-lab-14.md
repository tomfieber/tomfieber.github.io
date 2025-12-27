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

![](attachments/xss-lab-14/file-20251124113610709.webp)

If we try to break out of that h1 tag and use an img tag to trigger the print() function, then we get "Tag is not allowed".

![](attachments/xss-lab-14/file-20251124113610711.webp)

Here, we can use PortSwigger's XSS cheatsheet to copy a list of all tags over to automate/intruder to see what tags might bypass this filter. 

Here we see that `<body>` and custom tags are allowed. 

![](attachments/xss-lab-14/file-20251124113610712.webp)

Trying the `<body>` tag we see that it is not blocked.

![](attachments/xss-lab-14/file-20251124113610715.webp)

Repeating a similar process with the attributes, we find that several are allowed, however many require user interaction. One that does not is `onresize`.

![](attachments/xss-lab-14/file-20251124113610716.webp)

Now that we have a tag and attribute that are allowed, we can create a payload to deliver to the victim.

The following payload works.

```html title="Working payload that triggers the print() function"
<iframe src="https://0a3f00c7035f099b809903b40067002e.web-security-academy.net/?search=test123<body%20onresize=print()>" onload=this.document.style.width="1em">
```

This calls the print() function on resize, and then automatically sets the iframe width to "1em", thereby triggering the print function and solving the lab.

## Lesson learned

If common payloads are not working, try fuzzing for other tags and/or attributes that might not be blocked. 