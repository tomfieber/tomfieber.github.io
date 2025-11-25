---
tags:
  - xss
  - filter-bypass
---
# Stored XSS into anchor `href` attribute with double quotes HTML-encoded

## Instructions

This lab contains a stored cross-site scripting vulnerability in the comment functionality. To solve this lab, submit a comment that calls the `alert` function when the comment author name is clicked.

## Solution

Go to a blog post and fill out a comment. Use unique strings so it's easy to search for your string. Note that your website input is reflected in an `<a>` tag in the `href` attribute.

![](attachments/xss-lab-08/file-20251124113610689.png)

However, notice that if we try to escape that context, it doesn't work because double quotes and angle brackets are output encoded.

![](attachments/xss-lab-08/file-20251124113610691.png)

We can use the `javascript` scheme to bypass this restriction and get our alert function to trigger by entering the following payload in the website field:

```text title="Use this as the website in the comment form"
javascript:alert(document.domain)
```


![](attachments/xss-lab-08/file-20251124113610692.png)

## Lesson learned

Always double check the context in which our input is reflected. It might be in more than one place. If certain characters are output encoded, try different payloads to see if you can find one that bypasses the restrictions in place. 