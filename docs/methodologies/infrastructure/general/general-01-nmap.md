# Scanning

## Nmap

### Discovery

```bash
sudo nmap -iL scope.txt -sn -PS21,22,23,25,80,110,135,137,139,389,443,445,636,990,992,1433,2049,3306,5060,8080,8090,8088,8888,9090,10000 -PU53,69,88,123,161,500,514,623,5060 -PE
```

### TCP

```bash
sudo nmap -iL live_hosts.txt -Pn -p- -sV -sC --max-rtt-timeout 600ms --max-retries 2 --host-timeout 180m -oA nmap_tcp -vv --open
```

### UDP

```bash
sudo nmap -iL live_hosts.txt -Pn -sU --top-ports 20 -sV -sC --max-rtt-timeout 600ms --host-timeout 180m --max-retries 2 -oA nmap_udp -vv --open
```

## Scanning Options

|**Nmap Option**|**Description**|
|---|---|
|`10.10.10.0/24`|Target network range.|
|`-sn`|Disables port scanning.|
|`-Pn`|Disables ICMP Echo Requests|
|`-n`|Disables DNS Resolution.|
|`-PE`|Performs the ping scan by using ICMP Echo Requests against the target.|
|`--packet-trace`|Shows all packets sent and received.|
|`--reason`|Displays the reason for a specific result.|
|`--disable-arp-ping`|Disables ARP Ping Requests.|
|`--top-ports=<num>`|Scans the specified top ports that have been defined as most frequent.|
|`-p-`|Scan all ports.|
|`-p22-110`|Scan all ports between 22 and 110.|
|`-p22,25`|Scans only the specified ports 22 and 25.|
|`-F`|Scans top 100 ports.|
|`-sS`|Performs an TCP SYN-Scan.|
|`-sA`|Performs an TCP ACK-Scan.|
|`-sU`|Performs an UDP Scan.|
|`-sV`|Scans the discovered services for their versions.|
|`-sC`|Perform a Script Scan with scripts that are categorized as "default".|
|`--script <script>`|Performs a Script Scan by using the specified scripts.|
|`-O`|Performs an OS Detection Scan to determine the OS of the target.|
|`-A`|Performs OS Detection, Service Detection, and traceroute scans.|
|`-D RND:5`|Sets the number of random Decoys that will be used to scan the target.|
|`-e`|Specifies the network interface that is used for the scan.|
|`-S 10.10.10.200`|Specifies the source IP address for the scan.|
|`-g`|Specifies the source port for the scan.|
|`--dns-server <ns>`|DNS resolution is performed by using a specified name server.|

## Output Options

|**Nmap Option**|**Description**|
|---|---|
|`-oA filename`|Stores the results in all available formats starting with the name of "filename".|
|`-oN filename`|Stores the results in normal format with the name "filename".|
|`-oG filename`|Stores the results in "grepable" format with the name of "filename".|
|`-oX filename`|Stores the results in XML format with the name of "filename".|

## Performance Options

| **Nmap Option**              | **Description**                                              |
| ---------------------------- | ------------------------------------------------------------ |
| `--max-retries <num>`        | Sets the number of retries for scans of specific ports.      |
| `--stats-every=5s`           | Displays scan's status every 5 seconds.                      |
| `-v/-vv`                     | Displays verbose output during the scan.                     |
| `--initial-rtt-timeout 50ms` | Sets the specified time value as initial RTT timeout.        |
| `--max-rtt-timeout 100ms`    | Sets the specified time value as maximum RTT timeout.        |
| `--min-rate 300`             | Sets the number of packets that will be sent simultaneously. |
| `-T <0-5>`                   | Specifies the specific timing template.                      |