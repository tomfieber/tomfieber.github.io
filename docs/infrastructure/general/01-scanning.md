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

