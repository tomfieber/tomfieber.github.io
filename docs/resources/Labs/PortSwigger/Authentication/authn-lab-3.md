---
tags:
  - authn
  - password-reset
---
# Password reset broken logic

## Instructions

This lab's password reset functionality is vulnerable. To solve the lab, reset Carlos's password then log in and access his "My account" page.

- Your credentials: `wiener:peter`
- Victim's username: `carlos`

## Solution

The login page has a forgot password functionality, where the user can enter their email to get a reset link.

![](attachments/authn-lab-3/file-20251121082955719.png)

When you get the email, there is a link with a temporary reset token. It's important to not use this token yet, otherwise you'll have to request another one. 

![](attachments/authn-lab-3/file-20251121082955721.png)

Set your proxy to intercept requests and click on the reset link. Keep the intercept proxy on and enter a new password. Note that the username parameter is included in the request. 

![](attachments/authn-lab-3/file-20251121082955723.png)

Change the username from "wiener" to "carlos" and forward the request.

Now you can log in as Carlos and solve the lab.

![](attachments/authn-lab-3/file-20251121082955724.png)

