# Shady Oaks Financial

## Summary

A tampering vulnerability exists in the `/api/upgrade` endpoint. By modifying the value of the `role` parameter from `insider` to `administrator` an authenticated user can elevate their own privileges to gain access to administrative functionality.

## Description

The Shady Oaks API uses the `role` parameter on the `/api/upgrade` endpoint to initiate a 7-day free trial of their insider access service. The API does correctly validate that the user is authenticated, but it does not validate that the value of the `role` parameter has not been modified from the default value. As a result, any authenticated user can modify the value of the `role` parameter to elevate their own access, including to an administrator level. Application administrators have access to sensitive data, including the `/api/admin/flag` endpoint which contains the challenge flag for this lab. This issue exists because while the API does confirm the user is logged in, it does not perform a server-side validation of the `role` parameter value to ensure it has not been modified or that the logged in user has permission to change it.

## Steps to Reproduce

1. Register an account on the Shady Oaks Financial website
2. Sign up for the 7-day free trial by clicking on the “Upgrade” button on the menu bar
3. Capture the `POST` request to `/api/upgrade` in an interception proxy like Caido or Burp Suite.
4. Send the request to repeater.
5. Modify the value of the `role` parameter value to `administrator`.
6. Copy the value of the JWT returned in the response to the `Authorization` header of any previously captured `GET` request.
7. Send a `GET` request with the new JWT value to the `/api/admin/flag` endpoint to get the flag.

## Proof of Concept

![](attachments/index/file-20251216170022640.png)

![](attachments/index/file-20251216170042240.png)

Here is a short screen recording showing the exploitation steps:

![type:video](attachments/index/shady-oaks-walkthrough.mp4)

## Impact

This vulnerability allows any authenticated user to:

- Modify their own role by changing the value of the `role` parameter in a `POST` request to the `/api/upgrade` endpoint.
- Gain access to sensitive information and administrative functionality without authorization.

Realistic example: An attacker registers for a free account and then signs up for the 7-day free insider trial. The attacker subsequently assigns themselves the `administrator` role via the `/api/upgrade` endpoint and then modifies market trends to influence stock price movements. This results in reputational damage, regulatory penalties, and/or financial loss.

Severity: High

CVSS: 8.1; AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N

## Remediation

Check the value of the `role` parameter on the server side to ensure that it has not been modified from the default or from an expected range of values. Perform an additional check on the server side to ensure that the user making the request is authorized to modify the role and/or implement RBAC to ensure that only designated users/groups can modify user roles.

**Additional recommendations:**

- Implement robust logging and alerting to notify responders when unauthorized modification attempts are made.