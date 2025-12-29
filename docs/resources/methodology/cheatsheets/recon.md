---
tags:
  - recon
  - cheatsheet
---
# Recon

## Finding Subdomains

### ASN Recon

- [ ] Search for the target on [bgp.he.net](https://bgp.he.net)
- [ ] DNS recon with [dnschecker](https://dnschecker.org)
	- [ ] Check for owned infrastructure - Akamai and AWS type things aren't helpful.
- [ ] Check [asrank.caida.org](https://asrank.caida.org)
- [ ] Query registrars for known IP ranges
- [ ] Check tenant-domains.sh
- [ ] Example ASN to port scans

	```bash
	echo AS12345 | asnmap -silent | naabu -silent
	```
	
	```bash
	echo AS12345 | asnmap -silent | naabu -silent -nmap-cli 'nmap -sV'
	```

### Shodan

- [ ] Resources

    [GitHub - Dheerajmadhukar/karma_v2: ⡷⠂𝚔𝚊𝚛𝚖𝚊 𝚟𝟸⠐⢾ is a Passive Open Source Intelligence (OSINT) Automated Reconnaissance (framework)](https://github.com/Dheerajmadhukar/karma_v2)
    
    [GitHub - pirxthepilot/wtfis: Passive hostname, domain and IP lookup tool for non-robots](https://github.com/pirxthepilot/wtfis)
    
- [ ] Manual shodan
    
    ```bash
    <https://www.shodan.io/search?query=tesla.com>
    ```
    
    Also check out `karmav2` and `wtfis`
    
- [ ] Find subdomains with `shosubgo`
    
    [GitHub - incogbyte/shosubgo: Small tool to Grab subdomains using Shodan api.](https://github.com/incogbyte/shosubgo)
    

### Acquisitions

- [ ] Resources

    [Technology & Data for Venture Capital, Corp Dev, Investment Banks](https://tracxn.com)

!!! tip
	Make sure that any resources are wholly owned and not just investments

- [ ] Check `tracxn.com`
- [ ] Check `pitchbook.com`

### Cloud Recon ++

- [ ] Connect to an IP and ask for the SSL cert
    - [ ] Parse the CN, OU, and SAN domains out of the certificate
- [ ] If an IP contains an SSL cert that mentions our target in one of those fields, then we know they have infrastructure hosted on that provider
- [ ] Scan a whole IP range, download all the cert fields, and grep for IPs with certs that mention our target.
- [ ] Check subject alt names on certs
- [ ] Check the EC2 Accessibility page
    [EC2 Reachability Test](http://ec2-reachability.amazonaws.com/)
    
- [ ] Check lordalfred’s IP ranges

    [GitHub - lord-alfred/ipranges: 🔨 List all IP ranges from: Google (Cloud & GoogleBot), Bing (Bingbot), Amazon (AWS), Microsoft, Oracle (Cloud), GitHub, Facebook (Meta), OpenAI (GPTBot) and other with daily updates.](https://github.com/lord-alfred/ipranges)
    
- [ ] Use `caduceous` to scan all IP ranges for certificate information

    [GitHub - g0ldencybersec/Caduceus](https://github.com/g0ldencybersec/Caduceus)
    
- [ ] Check `kaeferjaeger.gay`

    [Home • Directory Lister](https://kaeferjaeger.gay/)
    
- [ ] Merklemap is good

    [Subdomain Search: Search, lookup and find subdomains | Merklemap](https://www.merklemap.com/)
    
- [ ] Continuously monitoring certs

    [GitHub - g0ldencybersec/gungnir: CT Log Scanner](https://github.com/g0ldencybersec/gungnir)
    

### Reverse WHOIS

Basically searching for any other sites that an org name or registrant email is listed on

[WHOIS API | WHOIS Lookup API | Domain WHOIS API](https://www.whoxy.com/)

Flow might be **Reverse Whois → httpx**

### Reverse DNS

What other domains use this DNS server?

- [ ] Check whoisXML
    - Requires a sub
- [ ] hakrevdns

	[GitHub - hakluke/hakrevdns: Small, fast tool for performing reverse DNS lookups en masse.](https://github.com/hakluke/hakrevdns)

- [ ] zdns is faster, but not as user friendly

	[GitHub - zmap/zdns: Fast DNS Lookup Library and CLI Tool](https://github.com/zmap/zdns)

- [ ] whoisxml
    
    - Similar to whoxy but for dns data
    - First, find what dns servers the target is using
    
    ```html
    dig +short ns fisglobal.com
    ```
### DMARC Analysis

- [ ] csprecon
- [ ] crossdomain.xml
- [ ] Historical JS/HTML
    - [ ] Waymore

### Ad and Analytics relationships

- [ ] Use builtwith and check relationships

### Subdomain Scraping

- [ ] Use `subfinder`
    
    ```bash
    subfinder -d tesla.com | httpx
    ```
    
    ```bash
    subfinder -d tesla.com | dnsx
    ```
    
- [ ] Use `bbot`
- [ ] APIs
    - Priority
        - Chaos (Priority 1)
        - GitHub (generate new personal access token)
        - Shodan
        - FacebookCT
        - PassiveTotal
        - c99
        - dnsdumpster
        - Cisco Umbrella
        - DNSDB
        - Zetalytics
        - SecurityTrails
        - SpiderFootHX
        - [Netlas.io](http://Netlas.io)

	!!! tip
		Check [https://openintel.nl/news/20190115-umbrella/](https://openintel.nl/news/20190115-umbrella/)

	!!! tip
		Make sure to use `-stats` with subfinder

- [ ] One liner
    
    ```bash
    while IFS=read -r line; do subfinder -d $line -all | httpx -status-code -title -content-length -web-server -asn -location -no-color -follow-redirects -t 15 -ports 80,8080,443,8443,4443,8888 -no-fallback -probe-all-ips -random-agent -o $line -oa; done < fisAPEXES
    ```
    

[Bountycatch.py](http://Bountycatch.py) - Use for filtering out dupes.

### Github Enumeration

- [ ] git-subdomains

	[GitHub - gwen001/github-subdomains: Find subdomains on GitHub.](https://github.com/gwen001/github-subdomains)

- [ ] Use multiple API keys/tokens for this
	- [ ] Probably remove from subfinder if running with this.

!!! tip 
	Interesting subdomains → interesting repos. Check the repo for keys.

Apexes → github-subdomains → trufflehog

- [ ] Github dorking
	- [ ] jhaddix github dorking list

### Subdomain brute forcing

- [ ] puredns

	[GitHub - d3mondev/puredns: Puredns is a fast domain resolver and subdomain bruteforcing tool that can accurately filter out wildcard subdomains and DNS poisoned entries.](https://github.com/d3mondev/puredns)

- [ ] Distributes across multiple resolvers
- [ ] Use trickest resolvers file

	[GitHub - trickest/resolvers: The most exhaustive list of reliable DNS resolvers.](https://github.com/trickest/resolvers)

#### Alteration and permutation BF

- [ ] dnsgen

	[GitHub - AlephNullSK/dnsgen: DNSGen is a powerful and flexible DNS name permutation tool designed for security researchers and penetration testers. It generates intelligent domain name variations to assist in subdomain discovery and security assessments.](https://github.com/AlephNullSK/dnsgen)

	!!! tip 
		This does not do resolving…need to pass to puredns

	Example

	```html
	cat subdomains.txt | dnsgen - | puredns resolve --resolvers resolvers.txt
	```

### Vhost scanning

- [ ] One IP hosting many web apps
- [ ] Based on subdomain name and host header
- [ ] Check certificate (SAN field)

	`vhostscan`

	[GitHub - codingo/VHostScan: A virtual host scanner that performs reverse lookups, can be used with pivot tools, detect catch-all scenarios, work around wildcards, aliases and dynamic default pages.](https://github.com/codingo/VHostScan)

## Screenshotting

- [ ] `httpx`
- [ ] `Eyeballer`

	[GitHub - BishopFox/eyeballer: Convolutional neural network for analyzing pentest screenshots](https://github.com/BishopFox/eyeballer)

- [ ] `go-stare`

	[GitHub - dwisiswant0/go-stare: A fast & light web screenshot without headless browser but Chrome DevTools Protocol!](https://github.com/dwisiswant0/go-stare)

- [ ] gowitness
- [ ] eyewitness

## Prioritizing Recon

Other stuff to watch for:

- Logins
- Default content
- 302s
- Basic auth
- Old looking framework
- Outdated priv policy/trademark
- SSL VPN and IT Portals



