---
tags:
  - xpath
  - injection
---
# XPath Injection

XPath injection is similar to SQL injection except for:

- It can only be used to read data, not to insert data
- It does not implement any access control, so if you find an injection point it's likely possible to get the whole document.

## Syntax

### Basic

```txt
admin' or "a"="a
```

```text title="Read the name of any node with name"
name(/db) = 'db'
```

- [ ] We can use `/*` to match any child

- [ ] You can use the position of the node in it's parent as a filter : 
	- `/db/users/user[position() = 42`
### Merging

```text 
a"] | / | /a[b="
```

