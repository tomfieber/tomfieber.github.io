# Network Pentesting
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

	![](../../../assets/screenshots/Pasted%20image%2020250518111327.png)

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
- [ ] 

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





## Local Privilege Escalation

something

## Admin Recon

Something

## Lateral Movement

Something

## Post-DA

Something

## Cross-Trust Attacks

