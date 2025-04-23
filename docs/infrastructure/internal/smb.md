# SMB

## What is where?
- [ ] Find SMB-enabled hosts
	```bash
	nxc smb live_hosts.txt | tee initial_smb_scan.txt
	```

	```bash
	cat initial_smb_scan.txt | awk '{print $2}' | tee smb_enabled_hosts.txt
	```

- [ ] Generate a list of relay targets
	```bash
	cat initial_smb_scan.txt | grep signing:False | awk '{print $2}' | tee smb_relay_list.txt
	```
	
	```bash
	nxc smb live_hosts.txt --gen-relay-list smb_relay_list.txt
	```

- [ ] Identify SMBv1
	```bash
	cat initial_smb_scan.txt | grep SMBv1:True | awk '{print $2}' | tee smbv1_hosts.txt
	```

## Initial Checks

- [ ] Null sessions
- [ ] Guest sessions
- [ ] Signing not required
- [ ] SMBv1

## SMB Shares

- [ ] Unauthenticated shares
- [ ] Filter shares
	- [ ] READ
	- [ ] WRITE
- [ ] Manspider