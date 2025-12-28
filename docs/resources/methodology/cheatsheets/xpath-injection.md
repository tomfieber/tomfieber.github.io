---
tags:
  - xpath
  - injection
---
# XPath Injection

XPath injection is similar to SQL injection except for:

- It can only be used to read data, not to insert data
- It does not implement any access control, so if you find an injection point it's likely possible to get the whole document.