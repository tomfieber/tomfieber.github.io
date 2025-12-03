---
title: Bugforge - Copypasta - IDOR
description: Abusing a poorly configured API endpoint to access another user's private information.
categories:
  - writeups
  - bugforge
tags:
  - idor
  - api
date: 2025-12-03T08:35:00
author: tom
image: /assets/img/copypasta-idor-thumbnail.png
---
## Description

This version of Copypasta is an easy rated lab on [Bugforge](https://bugforge.io). This lab involves identifying a poorly configured API endpoint that allows unauthorized users to view private code snippets; this is a good example of a Broken Object Level Authorization (BOLA) vulnerability.

## Attack Path

From walking the application, we can see that there is functionality to create new snippets, and we have the choice to either make them public or private.

![](assets/img/2025-12-03-copypasta-idor/file-20251203083141967.png){: .shadow .rounded-corners }
_Creating a new public snippet_

On our own dashboard, we can see all of our own snippets.

![](assets/img/2025-12-03-copypasta-idor/file-20251203083213188.png){: .shadow .rounded-corners }
_Viewing our own snippets_

If we subsequently change the visibility of one of our snippets from `Public` to `Private`, then we can see that reflected in the UI.

The following `PUT` request shows making the snippet private by changing the `is_public` parameter to `false`.

```
PUT /api/snippets/11 HTTP/1.1
Host: 76d8e51d0f5f.labs.bugforge.io
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJ0ZXN0ZXIyIiwiaWF0IjoxNzY0NzY5NjE1fQ.-aTOEynyngVCPCCofOmqgo9wpy1lruxQsSsOf7qvJVc
Content-Length: 123
Origin: <https://76d8e51d0f5f.labs.bugforge.io>
Connection: keep-alive
Referer: <https://76d8e51d0f5f.labs.bugforge.io/edit/11>
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: orange
Priority: u=0

{"title":"Test snippet 2","code":"print('Hello world!')","language":"python","description":"Hello world","is_public":false}
```

As I mentioned, we still have the ability to view all of our own snippets, but are private snippets actually private? What happens if we try to access this private snippet as another user?

The following request/response shows viewing the private snippet as the owner, `tester2`:

![](assets/img/2025-12-03-copypasta-idor/file-20251203083243618.png){: .shadow .rounded-corners }
_Request to view a private snippet as the owner_

Note the `"is_public": 0` in the response. This confirms that the snippet is private. Now, the following request/response shows a `GET` request to view that private snippet as another user, `tester1`:

![](assets/img/2025-12-03-copypasta-idor/file-20251203083323991.png){: .shadow .rounded-corners }
_Request to view a private snippet as an "attacker"_

## Impact

Since the snippet IDs are sequential, an attacker is able to view private snippets belonging to other users by incrementing the snippet ID. The specific impact of this finding depends on the nature of the information stored in the snippet. The severity of this issue would rise significantly if API keys, credentials, or other sensitive information was found to be stored in private snippets.

## Recommendation

Ensure access controls are applied on all objects to prevent unauthorized disclosure of sensitive data. Additionally, consider using a UUID for the snippet ID instead of sequential numbering. If UUIDs are used, ensure that UUIDs for private snippets are not leaked in HTTP responses from any other part of the application.

Consider implementing server-side checks to ensure that the authenticated user has permission to view the requested data. Furthermore, the use of authorization middleware to validate ownership prior to returning sensitive data could help mitigate the risk associated with this issue.

Finally, ensure that access control checks are implemented on every API endpoint; removing the option for viewing data or performing an action from the UI is not sufficient to protect against unauthorized disclosure and/or malicious activity.

## Key Takeaway

Always be sure to test any request that is using IDs for IDOR vulnerabilities. Walk the app thoroughly to identify any endpoints that use an ID to access an resource. Once you've identified one, test for Broken Object Level Authorization and/or Broken Functional Level Authorization as another user. 

## References

- [PortSwigger - IDOR](https://portswigger.net/web-security/access-control/idor)