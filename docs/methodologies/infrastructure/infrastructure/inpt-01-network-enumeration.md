# Network Enumeration

## Recon

- [ ] Parse scope file - [scope_parser.py](../../general/tools/tools-002-scope_parser.py.md)
- [ ] Check acquisitions
	- [ ] Crunchbase
- [ ] Check ASNs
	- [ ] bgp.he.net
	```
	amass enum --asn {asn}
	```
- [ ] Get apex domains from TLS certificates

```bash
tlsx -l scope.txt -silent -nc -cn -san -o tlsx_out | awk '{print $2}' | tr -d '[]' | awk 'BEGIN{FS=".";}{if(NF>1 && $2!="") print $0;}' | anew output/temp_subdomains
```

- [ ] Perform reverse DNS lookup with DNSX

```bash
dnsx -l {scope_file} -silent -nc -ptr -re -o dnsx_out | anew output/temp_subdomains
```

- [ ] Subdomain enumeration for apex domains
	- [ ] subfinder

		```bash
		subfinder -silent -dL {apex_file} -all -oI -nW -o subfinder_out | awk -F ',' '{print $1}' | anew output/temp_subdomains
		```

	- [ ] chaos

		```bash
		chaos -silent -dL apex_domains | anew output/temp_subdomains
		```

	- [ ] shuffledns

		```bash
		shuffledns -l {apex_file} -w ~/Testing/wordlists/all.txt -r ~/Testing/wordlists/resolvers.txt -mode bruteforce -o shuffledns_out
		```

- [ ] Resolve all found subdomains

```bash
dnsx -nc -silent -l output/temp_subdomains -resp -o {resolved_file}
```
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
	- [ ] Look for LLMNR, NBNS, and MDNS
	```
	sudo responder -I eth0 -A 
	```

### Port Scanning

- [ ] Run [nmap](../../general/general-01-nmap.md) scans
	- [ ] Discovery

	```bash
	sudo nmap -iL scope.txt -sn -PS21,22,23,25,80,110,135,137,139,389,443,445,636,990,992,1433,2049,3306,5060,8080,8090,8088,8888,9090,10000 -PU53,69,88,123,161,500,514,623,5060 -PE
	```

	- [ ] TCP

	```bash
	sudo nmap -iL live_hosts.txt -Pn -p- -sV -sC --max-rtt-timeout 600ms --max-retries 2 --host-timeout 180m -oA nmap_tcp -vv --open
	```

	- [ ] UDP

	```bash
	sudo nmap -iL live_hosts.txt -Pn -sU --top-ports 20 -sV -sC --max-rtt-timeout 600ms --host-timeout 180m --max-retries 2 -oA nmap_udp -vv --open
	```


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

