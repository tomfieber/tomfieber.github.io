---
tags:
  - xss
  - dom
---
# DOM XSS in `document.write` sink using source `location.search`

## Instructions

This lab contains a DOM-based cross-site scripting vulnerability in the search query tracking functionality. It uses the JavaScript `document.write` function, which writes data out to the page. The `document.write` function is called with data from `location.search`, which you can control using the website URL.

To solve this lab, perform a cross-site scripting attack that calls the `alert` function.

## Solution

What we enter in the search box is reflected in an `<h1>` tag.

![](attachments/xss-lab-03/file-20251124113610684.png)

Note the script on the page:

```js title="How is search input handled?" hl_lines="2 7"
function trackSearch(query) {
    document.write('<img src="/resources/images/tracker.gif?searchTerms='+query+'">');
}
var query = (new URLSearchParams(window.location.search)).get('search');
if(query) {
    trackSearch(query);
}                    
```

On line 2, we can see that the `trackSearch` function directly concatenates the search query into an `<img>` tag. It looks like we'll need to escape the double quotes and add another attribute to trigger our XSS. 

Here we can see what we pass to the `search` parameter is reflected in the img tag in the DOM.

![](attachments/xss-lab-03/file-20251124113610685.png)

The following payload breaks out of the img tag and triggers the alert box to complete this lab. 

```text title="Working payload"
/?search=test123"><script>alert(document.domain)</script>
```



![](attachments/xss-lab-03/file-20251124113610686.png)

## Lesson learned

Pay close attention to client side code to see if there is an indication of how user input is being handled. Try to track the input (source) through to a function that might not be handling it safely (sink). 