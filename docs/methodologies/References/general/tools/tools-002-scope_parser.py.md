# scope_parser.py

```python
#!/usr/bin/env python3

import argparse
import ipaddress
import sys
from tabulate import tabulate
import re
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s: %(message)s',
)
logger = logging.getLogger(__name__)

def is_valid_domain(domain):
    """Check if a string is a valid domain name."""
    # Basic domain name validation pattern
    pattern = r"^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$"
    return bool(re.match(pattern, domain))

def parse_scope_file(file_path):
    """Parse the scope file and categorize entries."""
    ips = set()
    domains = set()
    
    try:
        with open(file_path, 'r') as f:
            for line in f:
                entry = line.strip()
                if not entry or entry.startswith('#'):
                    continue
                    
                try:
                    # Try to parse as CIDR or IP
                    if '/' in entry:
                        # This is a CIDR notation
                        network = ipaddress.ip_network(entry, strict=True)
                        # Expand CIDR if it's not a /32 (single IP)
                        if network.prefixlen < 32:
                            logger.info(f"Expanding CIDR: {entry}")
                            # Only add individual IPs for smaller networks to avoid memory issues
                            if network.num_addresses <= 1024:  # Limit to reasonable size
                                for ip in network:
                                    ips.add(str(ip))
                            else:
                                logger.warning(f"CIDR {entry} too large to expand (contains {network.num_addresses} addresses). Keeping as CIDR.")
                                ips.add(entry)
                        else:
                            # Just a single IP in CIDR format
                            ips.add(str(network.network_address))
                    else:
                        # Try to parse as a single IP
                        ip = ipaddress.ip_address(entry)
                        ips.add(str(ip))
                except ValueError:
                    # If not an IP/CIDR, check if it's a domain
                    if is_valid_domain(entry):
                        domains.add(entry)
                    else:
                        logger.error(f"Invalid entry (not IP, CIDR, or domain): {entry}")
    except FileNotFoundError:
        logger.error(f"Scope file not found: {file_path}")
        sys.exit(1)
    except PermissionError:
        logger.error(f"Permission denied when accessing scope file: {file_path}")
        sys.exit(1)
    
    return sorted(ips), sorted(domains)

def display_results(ips, domains):
    """Display parsed results in a simple format for easy copy/paste."""
    # Display IP addresses
    print("\n== IP Addresses ==")
    if ips:
        for ip in ips:
            print(ip)
        print(f"\nTotal unique IP addresses: {len(ips)}")
    else:
        print("No valid IP addresses found in scope file.")
    
    # Display domains
    print("\n== Domain Names ==")
    if domains:
        for domain in domains:
            print(domain)
        print(f"\nTotal unique domains: {len(domains)}")
    else:
        print("No valid domain names found in scope file.")

def main():
    parser = argparse.ArgumentParser(description='Parse a scope file containing IP addresses, CIDR ranges, and domains.')
    parser.add_argument('scope_file', help='Path to the scope file')
    parser.add_argument('-v', '--verbose', action='store_true', help='Enable verbose output')
    args = parser.parse_args()
    
    if args.verbose:
        logger.setLevel(logging.DEBUG)
    
    ips, domains = parse_scope_file(args.scope_file)
    display_results(ips, domains)

if __name__ == '__main__':
    main()

```