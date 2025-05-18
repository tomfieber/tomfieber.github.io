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

		Search for a particular string in user attributes
		
		```powershell
		Get-DomainUser -LDAPFilter "Description=*built*" | Select name,Description
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

