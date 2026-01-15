---
tags:
  - xss
  - reflected
---
# Reflected XSS into HTML context with nothing encoded

## Instructions

This lab contains a simple reflected cross-site scripting vulnerability in the search functionality.

To solve the lab, perform a cross-site scripting attack that calls the `alert` function.

## Solution

Whatever we enter into the search box is reflected in an `<h1>` tag with nothing escaped. 

![](../../../../../site/_drafts/labs/PortSwigger/XSS/attachments/xss-lab-01/file-20251124113610667.webp)

If we send the following payload, we get an alert triggered showing the domain from which the payload executed.

```text title="Working payload"
?search=test123<script>alert(document.domain)</script>
```

![](../../../../../site/_drafts/labs/PortSwigger/XSS/attachments/xss-lab-01/file-20251124113610669.webp)

This solves the lab.

## Lesson learned

Always check the contect in which input is reflected. Use "View as HTML" to see what/how it's being output encoded.