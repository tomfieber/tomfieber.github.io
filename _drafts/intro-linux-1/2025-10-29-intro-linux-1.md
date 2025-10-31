---
title: Introduction to Linux - Part 1
date: 2025-10-29 12:00 -0500
categories:
  - walkthroughs
  - linux
tags:
  - linux
description: The Bandit wargame on OverTheWire provides a solid introduction to Linux. This is part 1 of our Bandit walkthrough.
author: tomfieber
comments: "true"
image:
---
## Introduction

Linux is an important skillset to have as you get started in information security. In this series of articles I'm going to walk through the Bandit wargame on [OverTheWire](https://overthewire.org/wargames/bandit/). Although this series will not attempt to cover everything there is to know about Linux, I hope that it will serve as a decent jumping-off point. 

## How the Wargame Works

On OverTheWire, individual levels of each wargame have their own password, which is the "flag" from the previous level. So for example, the flag on level 1 will be the password to access level 2. 

There are 34 levels in the Bandit wargame, so I'll probably break this series up into (maybe) three parts, but we'll see. 

## Let's Get Started

### Level 0

The objective of this level is just to get familiar with using SSH, or Secure Shell. SSH allows us to establish a secure, encrypted connection to another computer. In this case, we're connecting to the server at **bandit.labs.overthewire.org** on port **2222**. 

Before we move on, it's important to understand the concept of ports. 

>[!warning] Explain services and ports here

Connect to the service with the following command: `ssh bandit0@bandit.labs.overthewire.org -p 2220`.

If asked if you're sure you want to continue connecting due to an unknown server fingerprint, select yes to continue connecting. 

![](assets/img/2025-10-29-intro-linux-1/file-20251031104212527.png){: .shadow .rounded-image }

Level 1 password

```
ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If
```

As you can see in the image above, there are a couple commands we need to use on this level. 

[ls](https://explainshell.com/explain/1/ls)
: List directory contents

[cat](https://explainshell.com/explain/1/cat)
: Stands for "concatenate", but for now just know that the `cat` command can be used to print out the content of a file. 

Now we've got the password for Level 1, so we can move on to that level. 

### Level 1

![](assets/img/2025-10-29-intro-linux-1/file-20251031104212529.png){: .shadow .rounded-image }
_The - character causes some problems, so we need to specify the current directory with ./_

Level 2 password

```
263JGJPfgU6LtdEvgfWU1XP5yac29mFx
```


### Level 2

Note that we need to escape the spaces

![](assets/img/2025-10-29-intro-linux-1/file-20251031104212531.png){: .shadow .rounded-image }
_We need to escape spaces here_


Level 3 password

```
MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx
```

### Level 3

Note the hidden file. Also need to address `cd` here.

![](assets/img/2025-10-29-intro-linux-1/file-20251031104212532.png){: .shadow .rounded-image }

Level 4 password 

```
2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ
```



### Level 4

This starts getting a bit trickier

Level 5 password

```
4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw
```

