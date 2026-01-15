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

![](../../../../../site/_drafts/labs/PortSwigger/DOM-Based/attachments/dom-lab-4/file-20251124113610526.webp)

Clicking that link and reviewing the response shows the following in the "onclick" attribute of the anchor tag:

![](../../../../../site/_drafts/labs/PortSwigger/DOM-Based/attachments/dom-lab-4/file-20251124113610527.webp)

So we can potentially add a `url` parameter to the request pointing to an address under our control. To solve this lab, point to the exploit server URL.

![](../../../../../site/_drafts/labs/PortSwigger/DOM-Based/attachments/dom-lab-4/file-20251124113610528.webp)

This solves the lab.

## Lesson learned

Always check responses carefully to identify additional parameters.