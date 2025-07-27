# NoSQL Injection

There are two different types of NoSQL injection:

- Syntax injection - This occurs when you can break the NoSQL query syntax, enabling you to inject your own payload. The methodology is similar to that used in SQL injection. However the nature of the attack varies significantly, as NoSQL databases use a range of query languages, types of query syntax, and different data structures.
- Operator injection - This occurs when you can use NoSQL query operators to manipulate queries.

## Sample document

```
{
  "_id": "some_unique_user_id_123",
  "username": "alex_p_dev",
  "email": "alex@example.com",
  "followers": 150,
  "isAdmin": false,
  "interests": ["pentesting", "bug bounties", "rock climbing"]
}
```

## Sample vulnerable code

```
// WARNING: VULNERABLE CODE EXAMPLE
function login(userInput_username, userInput_password) {
  // Build a query by directly inserting user input
  let query = `{ "username": "` + userInput_username + `", "password": "` + userInput_password + `" }`;

  // Find a user in the database that matches this query
  db.users.find(query);
}
```

## Basic Injection Test

```
{ "username": "admin", "password": {"$ne": "a"} }
```

The database reads this as: "Find a user where the `username` is 'admin' AND the `password` is **not equal to 'a'**."
## Syntax Injection

Attempt to break the query syntax.

Sample fuzzing string

```
'"`{ ;$Foo} $Foo \xYZ
```

Using this string -- URL-encoded

```
https://insecure-website.com/product/lookup?category='%22%60%7b%0d%0a%3b%24Foo%7d%0d%0a%24Foo%20%5cxYZ%00
```

If injecting into the JSON context, it would be:

```
'\"`{\r;$Foo}\n$Foo \\xYZ\u0000
```

!!! tip
	To figure out which characters are processed, send individuals characters to see how the application responds.

### Confirm Conditional Behavior

After identifying the vulnerability, try to determine which characters are being processed.

Examples

```
' && 0 && 'x
```

```
' && 1 && 'x
```

If the application behaves differently, this suggests that the false condition impacts the query logic, but the true condition doesn't. This indicates that injecting this style of syntax impacts a server-side query.

### Override Existing Conditions

Attempt to override existing conditions with custom javascript

```
'||'1'=='1
```

!!! warning
    Take care when injecting a condition that always evaluates to true into a NoSQL query. Although this may be harmless in the initial context you're injecting into, it's common for applications to use data from a single request in multiple different queries. If an application uses it when updating or deleting data, for example, this can result in accidental data loss.

Try injecting a null character after the query

```
https://insecure-website.com/product/lookup?category=fizzy'%00
```

## Operator Injection

NoSQL databases often use query operators, which provide ways to specify conditions that data must meet to be included in the query result. Examples of MongoDB query operators include:

- `$where` - Matches documents that satisfy a JavaScript expression.
- `$ne` - Matches all values that are not equal to a specified value.
- `$gt` (greater than) and `$lt` (less than) are perfect. For instance, if you're trying to bypass a check on a numeric field, you could inject `{"$gt": 0}` to match any positive number.
- `$in` is great for checking against an array of possibilities.
- `$regex` is extremely powerful, as it lets you perform complex pattern matching. It can be used to slowly reveal data one character at a time.
- `$where`: This is a very dangerous one. In older versions of MongoDB, it allowed you to pass a JavaScript function to be executed on the server. Finding this is like hitting the jackpot.
- `$exists`: This checks if a field exists or not, which can be useful for figuring out the database schema.

### Interpreting Responses

Sending the payload is only half the battle. A professional pentester needs to carefully observe how the application responds to confirm a vulnerability. You're looking for three main types of clues:

1. **Direct Response / Content Change:** This is the easiest to spot. You inject a payload that evaluates to true, and the content of the page changes. For example, you bypass a login and see a "Welcome, admin!" message, or a search for `"a'"` returns more results than a search for `"a"`.
    
2. **Error-Based:** Sometimes, a bad query will make the database throw an error that gets displayed on the page. This is a huge clue! An error message like `unrecognized operator: $foo` tells you that the application is trying to pass your input to the database. You know you're on the right track.
    
3. **Time-Based (Blind):** This is the most advanced technique. What if the application doesn't change its content or show errors? You can inject a command that tells the database to "sleep" or perform a heavy computation _if_ a certain condition is true. If you inject a payload that says, "If the admin's password starts with 'a', sleep for 5 seconds," and the page takes 5 seconds longer to load, you've just learned the first letter of the password. This is called **blind injection**.

### Sending in GET

Something like this might work in a URL

```
username[$ne]=invalid
```

We can also change GET to POST, and then inject into the body with `Content-Type: application/json`

In the JSON body, test whether the username (example) input is processing the query operator

```
{"username":{"$ne":"invalid"},"password":"peter"}
```

If the `$ne` operator is applied, then it will query all accounts that do NOT have the username "invalid"

This could be used to bypass authentication if both the username and password fields process the operator. 

We can check a list of known usernames:

```
{"username":{"$in":["admin","administrator","superadmin"]},"password":{"$ne":""}}
```

## Prevention

- **Strict Input Validation (Whitelisting):** This is the single most important defense. The application should never trust user input. Instead of trying to remove bad characters (**blacklisting**), it's far safer to only allow known good characters (**whitelisting**). More importantly, the code should perform **type-checking**. If the application expects a username (a string), it should reject any input that is an object (like `{"$ne": null}`). If it expects an age (a number), it should reject strings.
    
- **Use an Object-Document Mapper (ODM):** ODMs are libraries (like Mongoose for Node.js/MongoDB) that act as a middle layer between the application and the database. They allow developers to work with data as programming objects rather than raw database queries. A well-built ODM often handles sanitization and parameterization automatically, making it much harder to introduce an injection flaw.
    
- **Principle of Least Privilege:** The user account that the web application uses to connect to the database should have the minimum permissions necessary. For example, if a part of your application only needs to **read** user profiles, its database account shouldn't have permission to **delete** them. This won't prevent an injection, but it dramatically limits the damage an attacker can do if they find one.

---
# Resources

Here are 4 excellent and free resources where you can safely and legally practice NoSQL injection. Most of these are easily run locally using Docker.

1. **OWASP Juice Shop**
    
    - **What it is:** This is probably the most popular modern web application for security training. It's an intentionally insecure web shop full of vulnerabilities, including several NoSQL injection challenges. The challenges range from basic login bypasses to more advanced data exfiltration.
        
    - **Why it's great:** It puts the vulnerabilities in the context of a real-world application. You have to find the vulnerable input fields first before you can exploit them.
        
    - **How to get it:** It has an official Docker image that is incredibly easy to run. Just search for `owasp/juice-shop` on Docker Hub or follow the simple instructions on their official site.
        
2. **PortSwigger Web Security Academy**
    
    - **What it is:** This is a free, online learning platform created by the makers of Burp Suite. It provides dozens of high-quality, interactive labs that target specific vulnerabilities.
        
    - **Why it's great:** Their NoSQL injection labs are fantastic. They walk you through detecting the vulnerability, bypassing logins, and even exploiting syntax variations. It's all browser-based, so there's no local setup required.
        
    - **How to get it:** Simply register for a free account on the [PortSwigger website](https://portswigger.net/web-security) to get access to all the labs.
        
3. **NoSQLGoat**
    
    - **What it is:** This is a project from OWASP specifically designed to be a vulnerable-by-design application for learning NoSQL injection. It's less of a broad "find the vulnerability" game and more of a focused shooting range for NoSQLi.
        
    - **Why it's great:** It's hyper-focused on our topic. It covers a wide variety of injection types and scenarios related to MongoDB.
        
    - **How to get it:** It's available on GitHub and can be easily deployed using the provided Docker instructions.
        
4. **Hack The Box & TryHackMe**
    
    - **What they are:** These are online platforms where you can hack into retired, realistic machines in a CTF (Capture The Flag) style. They aren't just single web apps, but often entire virtual machines with multiple services.
        
    - **Why they're great:** They provide the most realistic practice. You'll find NoSQL injection vulnerabilities as part of a larger chain of exploitation needed to compromise a system. Many retired machines and dedicated learning "rooms" on these platforms feature NoSQLi.
        
    - **How to get it:** Both platforms operate on a "freemium" model. You can access many retired machines and learning paths for free, with an optional subscription for more content.