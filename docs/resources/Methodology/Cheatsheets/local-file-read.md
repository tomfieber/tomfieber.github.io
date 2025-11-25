---
tags:
  - file-read
  - LFR
---
# Local File Disclosure Cheatsheet

Could allow an attacker to include a file by exploiting a dynamic file read mechanism. This occurs due to the use of user-supplied input without proper sanitization. 

- Could allow an attacker to read configuration files on the host machine
- Read any other arbitrary files
- Other types of information disclosure depending on how the server is implemented

## Checks

- [ ] Look for anything that looks like it's loading an image or file
	- ?image=
	- ?file=
	- etc.
- [ ] Try to access arbitrary files
- [ ] Test different path traversal sequences
- [ ] Test different encodings
- [ ] Check if path traversal strings are being stripped non-recursively
- [ ] Check if base directories might be hard-coded. If so, include those and traverse from there.
- [ ] Hail mary
	- Append a null byte `%00` or `?` after the path


---
## References

[PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Directory%20Traversal)


[HackTricks](https://angelica.gitbook.io/hacktricks/pentesting-web/file-inclusion)


[AppSecExplained](https://appsecexplained.gitbook.io/appsecexplained/common-vulns/file-inclusion/local-file-inclusion)


