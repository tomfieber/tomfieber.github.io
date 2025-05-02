# Network Enumeration

### Situational Awareness

- [ ] nslookup

```bash
nslookup localhost
```

- [ ] Packet capture
=== "Linux"
	```bash
	sudo tcpdump -i [interface] -s 65535 -w sound.pcap port not 22
	```
=== "Windows"

	```powershell
	netsh trace start capture=yes tracefile=c:\windows\tasks\output.etl
	```
	
	```powershell
	netsh trace stop
	```

!!! tip
	If you're on Windows and have admin privileges, you can try the following. You'll have to convert the .etl file to a PCAP after.

- [ ] Check DHCP
	- [ ] Identify nameservers and domain names
	```bash
	nmap --script broadcast-dhcp-discover
	```

- [ ] Check DNS
	- [ ] Find the Principal Domain Controller (PDC)
	```bash
	nslookup -type=srv _ldap._tcp.pdc._msdcs.$FQDN_DOMAIN
	```
	- [ ] Find other DCs
	```bash
	nslookup -type=srv _ldap._tcp.dc._msdcs.$FQDN_DOMAIN
	```
	- [ ] Find the Global Catalog
	```bash
	nslookup -type=srv gc._msdcs.$FQDN_DOMAIN
	```
	- [ ] Check other ways to find hosts that **MAY** be DCs
	```bash
	nslookup -type=srv _kerberos._tcp.$FQDN_DOMAIN
	nslookup -type=srv _kpasswd._tcp.$FQDN_DOMAIN
	nslookup -type=srv _ldap._tcp.$FQDN_DOMAIN
	```

- [ ] Run responder in analyze mode
	- [ ] Look for LLMNR, NBNS, and/or MDNS

### Port Scanning

- [ ] Run [nmap](../general/general-01-nmap.md) scans
	- [ ] Discovery
	- [ ] TCP
	- [ ] UDP

### Vulnerability Scanning
- [ ] Nessus
- [ ] Nuclei
```bash
nuclei -l urls.txt -je nuclei-out.json
```
- [ ] TLS
```bash
sslscan --targets=sslscan-scope.txt
```

