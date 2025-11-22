---
tags:
  - sql
  - injection
---
# No Limit

For this lab, we need to bypass the existing "LIMIT 0" directive to get the flag. The bypass is:

```text title="Limit bypass"
admin' LIMIT 1-- -
```

![](attachments/3-no-limit/file-20251121134238824.png)

