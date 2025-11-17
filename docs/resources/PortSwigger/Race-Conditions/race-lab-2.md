---
tags:
  - race-conditions
---
# Single-endpoint race conditions

## Instructions

This lab's email change feature contains a race condition that enables you to associate an arbitrary email address with your account.

Someone with the address `carlos@ginandjuice.shop` has a pending invite to be an administrator for the site, but they have not yet created an account. Therefore, any user who successfully claims this address will automatically inherit admin privileges.

To solve the lab:

1. Identify a race condition that lets you claim an arbitrary email address.
2. Change your email address to `carlos@ginandjuice.shop`.
3. Access the admin panel.
4. Delete the user `carlos`

You can log in to your own account with the following credentials: `wiener:peter`.

## Solution

Notice that the application has a feature that allows you to change your email. We also have access to an email client where the confirmation link will be sent. 

![](attachments/race-lab-2/file-20251117100315252.png)

In repeater, we can create a tab group with one tab containing an email belonging to our own email server, as shown below:

![](attachments/race-lab-2/file-20251117100418143.png)

And the second tab containing the target email address, as shown below:

![](attachments/race-lab-2/file-20251117100447656.png)

Then send the requests in parallel to try to exploit the race window. I needed to do this several times before I got a confirmation email to change my email address to carlos. 

![](attachments/race-lab-2/file-20251117100547641.png)

Confirm the change and then delete carlos from the admin panel to complete the lab.

