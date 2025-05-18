# Low Hanging Fruit

## Common Checks

### Find platform information disclosed

```bash
httpx -l urls.txt -title -sc -fr -srd httpx-out
```

From inside the `response` directory
```bash
egrep -r -i "Server .*/."
```

```bash
egrep -r -i "x-powered-by: .*/."
```
You might also need to check for ASPNET and ASPNETMVC versions disclosed

### Check ciphers

```bash
nmap -sV --script +ssl-enum-ciphers -p443 -iL hosts.txt
```
