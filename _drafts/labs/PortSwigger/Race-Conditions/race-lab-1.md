---
tags:
  - race-conditions
  - limit-overrun
---
# Limit overrun race conditions

## Instructions

This lab's purchasing flow contains a race condition that enables you to purchase items for an unintended price.

To solve the lab, successfully purchase a **Lightweight L33t Leather Jacket**.

You can log in to your account with the following credentials: `wiener:peter`.

For a faster and more convenient way to trigger the race condition, we recommend that you solve this lab using the [Trigger race conditions](https://github.com/PortSwigger/bambdas/blob/main/CustomAction/ProbeForRaceCondition.bambda) custom action. This is only available in Burp Suite Professional.

## Solution

Note the request when adding the coupon code on the checkout screen:

```text title="Adding the coupon code"
POST /cart/coupon HTTP/2
Host: 0aa100a50379543b800bbd220071002f.web-security-academy.net
Cookie: session=fpb8bEw3eNqSn0xbJTeATjn9TAwrbtHC
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 52
Origin: https://0aa100a50379543b800bbd220071002f.web-security-academy.net
Referer: https://0aa100a50379543b800bbd220071002f.web-security-academy.net/cart
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-Pwnfox-Color: magenta
Priority: u=0, i
Te: trailers

csrf=Bz9HFt7nDfwgVx9dpBW57fCQqqhU6LcB&coupon=PROMO20
```

Remove the coupon and then send this request (the one where we're adding the coupon code) to repeater.

In repeater (Burp Pro), select "Custom actions"

![](../../../../../site/_drafts/labs/PortSwigger/Race-Conditions/attachments/race-lab-1/file-20251124113610568.webp)

Select **New -> From Template** and then select **Trigger race condition**.

![](../../../../../site/_drafts/labs/PortSwigger/Race-Conditions/attachments/race-lab-1/file-20251124113610573.webp)

Once that's done, click the "play" icon back in repeater. 

![](../../../../../site/_drafts/labs/PortSwigger/Race-Conditions/attachments/race-lab-1/file-20251124113610575.webp)

You'll find that the coupon has been applied many times, and you're able to purchase the jacket with your available store credit. 

## Lesson learned

Always keep an eye out for instances where there are single-use items -- like coupon codes -- and test for race conditions. 

