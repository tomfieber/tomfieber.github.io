---
tags:
  - dom
  - open-redirect
---
# DOM-based open redirection

## Instructions

This lab contains a DOM-based open-redirection vulnerability. To solve this lab, exploit this vulnerability and redirect the victim to the exploit server.

## Solution

On any blog post, notice that there is a link on the bottom of the page to navigate "Back to Blog".

![](attachments/dom-lab-4/file-20251116074257333.png)

Clicking that link and reviewing the response shows the following in the "onclick" attribute of the anchor tag:

![](attachments/dom-lab-4/file-20251116074417673.png)

So we can potentially add a `url` parameter to the request pointing to an address under our control. To solve this lab, point to the exploit server URL.

![](attachments/dom-lab-4/file-20251116074552022.png)

This solves the lab.

## Lesson learned

Always check responses carefully to identify additional parameters.