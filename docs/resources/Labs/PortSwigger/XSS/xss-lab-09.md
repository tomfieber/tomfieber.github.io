---
tags:
  - xss
---
# Reflected XSS into a JavaScript string with angle brackets HTML encoded

## Instructions

This lab contains a reflected cross-site scripting vulnerability in the search query tracking functionality where angle brackets are encoded. The reflection occurs inside a JavaScript string. To solve this lab, perform a cross-site scripting attack that breaks out of the JavaScript string and calls the `alert`function.

## Solution

Note that when we enter a term in the search bar, that term is reflected inside of a `<script>` tag. 

![](attachments/xss-lab-09/file-20251124113610695.png)

Since this is being reflected inside of JavaScript already, it is not necessary to add another script tag, we can just try to break out of the current context and add a new argument to the existing tag. 

Try the following string:

```js title="Working payload"
test123';alert(document.domain);//
```

![](attachments/xss-lab-09/file-20251124113610698.png)

This triggers our alert and solves the lab. 

## Lesson learned

If input is reflected in a JS string, try to just add another function to the existing script tag. It may be necessary to comment out the remainder of the string to avoid errors. 