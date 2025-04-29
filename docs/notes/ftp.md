# FTP

- [ ] Check for anonymous logon
- [ ] List all files recursively 
	```bash
	ls -R
	```
- [ ] Download files if necessary
	```bash
	wget -m --no-passive ftp://anonymous:anonymous@10.129.14.136
	```
- [ ] Nmap scripts
	```shell-session
	/usr/share/nmap/scripts/ftp-syst.nse
	/usr/share/nmap/scripts/ftp-vsftpd-backdoor.nse
	/usr/share/nmap/scripts/ftp-vuln-cve2010-4221.nse
	/usr/share/nmap/scripts/ftp-proftpd-backdoor.nse
	/usr/share/nmap/scripts/ftp-bounce.nse
	/usr/share/nmap/scripts/ftp-libopie.nse
	/usr/share/nmap/scripts/ftp-anon.nse
	/usr/share/nmap/scripts/ftp-brute.nse
	```
- [ ] Connect using `openssl` for encrypted FTP
	```bash
	openssl s_client -connect 10.129.14.136:21 -starttls ftp
	```
