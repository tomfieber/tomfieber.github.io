# Domain Testing

## Domain Data

### Domain users

=== "NetExec"
	```bash
	nxc smb 10.3.10.10 -u "user" -p "password" --users
	```
	
	```bash
	nxc ldap 10.3.10.10 -u "user" -p "password" --users
	```

=== "LDAP"
	```bash
	ldeep ldap -d domain.com -u "user" -p "password" -s ldap://10.3.10.10 users
	```

=== "PowerView"
	```powershell
	Get-DomainUser
	```

=== "AD Module"
	```powershell
	Get-ADUser -Filter * -Properties *
	```



- [ ] Domain groups
```
nxc smb 10.3.10.10 -u 'user' -p 'password' --groups
```
- [ ] Domain password policy
```
nxc smb 10.3.10.10 -u 'user' -p 'password' --pass-pol
```
- [ ] Domain trusts
- [ ] Domain GPOs
- [ ] Bloodhound
=== "bloodhound-python"
	```bash
	something
	```
=== "SharpHound"
	```powershell
	something
	```
=== "AzureHound"
	```powershell
	something
	```


