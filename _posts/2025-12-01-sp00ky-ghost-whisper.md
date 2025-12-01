---
tags:
  - command-injection
  - ywh
  - python
  - code-review
title: YesWeHack - November Challenge - Sp00ky Ghost Whisper
author: tom
date: 2025-12-01T09:00:00
description: A mysterious website lets you whisper to ghosts. But can you shatter the veil of silence and make your own voice heard?
categories:
  - writeups
  - yeswehack
image: /assets/img/sp00ky-thumbnail.jpeg
---
## **Description**

A mysterious website lets you whisper to ghosts. But can you shatter the veil of silence and make your own voice heard?

This writeup is for the November challenge on [YesWeHack](https://yeswehack.com). This was my first monthly challenge on YesWeHack, but I found it to be really fun, and I definitely learned something new!

## Code

The challenge code is below.

```python
import os, unicodedata
from urllib.parse import unquote
from jinja2 import Environment, FileSystemLoader
template = Environment(
    autoescape=True,
    loader=FileSystemLoader('/tmp/templates'),
).get_template('index.html')
os.chdir('/tmp')

def main():
    whisperMsg = unquote("")

    # Normalize dangerous characters
    whisperMsg = unicodedata.normalize("NFKC", whisperMsg.replace("'", "_"))

    # Run a command and capture its output
    with os.popen(f"echo -n '{whisperMsg}' | hexdump") as stream:
        hextext = f"{stream.read()} | {whisperMsg}"
        print( template.render(msg=whisperMsg, hextext=hextext) )

main()
```

Reviewing this code, we can see that the `unquote()` function is applied to our input before the data is normalized using the NFKC form, in which characters are decomposed by compatibility, then re-composed by canonical equivalence.[^f1]

## Attack Summary

While researching this challenge, I found this [great writeup](https://sim4n6.beehiiv.com/p/unicode-characters-bypass-security-checks) that describes what is happening here pretty well:

I used a “Fullwidth Apostrophe” (U+FF07) **instead** of a normal apostrophe to bypass the check, since it is not the same as the normal apostrophe character.[^f2] Then the late normalization function converts the fullwidth apostrophe back into a normal apostrophe for consistency.

Here we can see that sending the fullwidth apostrophe does, in fact, bypass the filter and is rendered in the UI.

![](assets/img/2025-12-01-sp00ky-ghost-whisper/file-20251201085904703%201.png)

Notice how the challenge code is handling our input, specifically this part:

```python
 # Run a command and capture its output
    with os.popen(f"echo -n '{whisperMsg}' | hexdump") as stream:
        hextext = f"{stream.read()} | {whisperMsg}"
        print( template.render(msg=whisperMsg, hextext=hextext) )
```

Since we can now bypass the filter and inject a single quote, we can likely use that to inject arbitrary OS commands as well. 

To confirm OS command injection, we can use the following string:

```
＇; id; #
```

Which gives us the ID of the current user (`nobody`).

![](assets/img/2025-12-01-sp00ky-ghost-whisper/file-20251201085904703.png)

Looking back at the setup code, we can see that the flag is being stored in an environment variable named `FLAG`.

![](assets/img/2025-12-01-sp00ky-ghost-whisper/file-20251201085904702.png)

So back in our input field we can just echo the value of that environment variable with the following command:

```
＇; echo $FLAG;#
```

And we get the flag!

![](assets/img/2025-12-01-sp00ky-ghost-whisper/file-20251201085904700.png)

## Flag

```python
FLAG{Gh0s7_S4y_BOOO000oooo}
```

## Impact

An attacker can bypass input restrictions by sending unicode characters that are canonically equivalent to blocked characters. The actual impact of this depends largely on the application, but in this case, we were able to abuse the configuration to bypass the filter and achieve remote command execution.

## Recommendation

Ensure that any input is normalized **BEFORE** any security filters are applied to ensure that all filters are run against the normalized string. Then, use the normalized, safe string in any application logic.

---
[^f1]: https://dencode.com/en/string/unicode-normalization
[^f2]: https://www.compart.com/en/unicode/U+FF07
