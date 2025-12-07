---
title: Bugforge - Cheesy Does It - Logic Flaw
description: Abusing a business logic flaw to get free pizzas
author: tom
tags:
  - logic-flaw
categories:
  - writeups
  - bugforge
date: 2025-12-06T18:21:00
image: /assets/img/cheesy-logic-flaw-thumbnail.png
---
## Description

This version of Cheesy Does It is an easy rated lab on [bugforge.io](https://bugforge.io). In this lab, we'll abuse a business logic flaw within the pizza ordering flow to get some free pizza! 

## Attack Path

Visiting the main page, we see a pizza ordering application.

![](assets/img/2025-12-06-cheesy-logic-flaw/file-20251206182527342.png){: .shadow .rounded-corners }
_Main menu page_

From walking the application, we can see that there is functionality to order pizzas, including custom pizzas, track order status, and manage personal details like delivery address.

When we order a pizza and go through the payment flow, we see that the total price is displayed in the cart; pretty standard, but keep this in mind for later. 

![](assets/img/2025-12-06-cheesy-logic-flaw/file-20251206182617681.png){: .shadow .rounded-corners }
_Total price is displayed in the cart_

After we go through the dummy payment screen, and we see the order tracking screen.

![](assets/img/2025-12-06-cheesy-logic-flaw/file-20251206182658142.png){: .shadow .rounded-corners }
_The order tracking page showing our recent order_

Cool…so we’ve ordered a pizza. If we review the requests in our proxy, something immediately jumps out.

Look at this `POST` request to `/api/orders`:

```
POST /api/orders HTTP/2
Host: 46dd14392e82.labs.bugforge.io
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJ0ZXN0ZXIxIiwiaWF0IjoxNzY1MDI4MDY5fQ.N5V6O7ZbWRlL3ezPc15kikZaIIkITclIGQYcQMLRX50
Content-Length: 320
Origin: <https://46dd14392e82.labs.bugforge.io>
Referer: <https://46dd14392e82.labs.bugforge.io/checkout>
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

{"items":[{"pizza_name":"Pepperoni Classic","base_name":"Hand Tossed","sauce_name":"Classic Tomato","size":"Medium","toppings":["Pepperoni","Extra Mozzarella"],"quantity":1,"unit_price":12.99,"total_price":12.99,"id":1765028351877}],"delivery_address":"123 Main st","phone":"555-1234","payment_method":"card","notes":""}
```

Notice that the unit price (`unit_price`) and total (`total_price`) are passed in the request. What if we change those values to $0 and resend the request?

![](assets/img/2025-12-06-cheesy-logic-flaw/file-20251206182741801.png){: .shadow .rounded-corners }
_Modifying the unit price and submitting a new order_

We didn’t get an error. Now if we check back on the order tracking page, we see that there is indeed an order totaling $0. We have effectively bypassed the payment confirmation step and modified the prices on the client-side to get ourselves a free pizza. 

![](assets/img/2025-12-06-cheesy-logic-flaw/file-20251206182826918.png){: .shadow .rounded-corners }
_Our modified order went through_

If we view the details of that order, we get the flag.

![](assets/img/2025-12-06-cheesy-logic-flaw/file-20251206182905543.png){: .shadow .rounded-corners }
_We get the flag in the order tracking view_

## Impact

An attacker can completely bypass the payment validation step and send a request directly to the `/api/orders` endpoint which gets processed and put in the order queue. Furthermore, the price is user controllable and is not validated on the server-side. An attacker is able to order multiple products for free, resulting in a potentially significant negative financial impact to the company.

## Recommendation

Ensure requests to `/api/orders` have a corresponding payment validation confirmation.

Do not pass the unit price or total cost in user controlled fields in the `POST` request body. Instead, validate the prices on the server-side to prevent tampering.

## References

- [PortSwigger - Logic Flaws](https://portswigger.net/web-security/logic-flaws)