# Pentesting Azure
---

## Azure Blob Container to Initial Access

Get the server information

=== "Linux"

	```bash
	curl -I https://demo.blob.core.windows.net
	```

=== "Windows"

	```powershell
	Invoke-WebRequest -Uri 'https://mbtwebsite.blob.core.windows.net/$web/index.html' -Method Head
	```

Expand headers

```powershell
Invoke-WebRequest -Uri 'https://mbtwebsite.blob.core.windows.net/$web/index.html' -Method Head | Select-Object -ExpandProperty Headers
```

Explore the container

```
https://mbtwebsite.blob.core.windows.net/$web?restype=container&comp=list
```

Check if versioning is enabled

```
https://mbtwebsite.blob.core.windows.net/$web?restype=container&comp=list&include=versions
```

!!! warning
	the `versions`parameter is only supported by version 2019-12-12 and later.

Specify the version number with the `x-ms-version` header

```bash
curl -H "x-ms-version: 2019-12-12" 'https://mbtwebsite.blob.core.windows.net/$web?restype=container&comp=list&include=versions'
```

Download a resource with a specific version ID

```bash
curl -H "x-ms-version: 2019-12-12" 'https://mbtwebsite.blob.core.windows.net/$web/scripts-transfer.zip?versionId=2025-02-18T00:29:19.3854225Z' --output scripts-transfer.zip
```

Azure "whoami"

```powershell
Get-AzADUser -SignedIn | fl
```

## Unlock Access with Azure Key Vault

Azure Key Vaults, which store sensitive data like secrets and certificates, are high-value targets for attackers aiming to compromise multiple services. Additionally, high-privileged contractor accounts that aren't properly managed pose a risk for privilege escalation and are also attractive targets for attackers.

Login

```powershell
az login
```

Logout

```
az logout
```

Show account

```
az account show
```

Get signed in user

```powershell
az ad signed-in-user show
```

Get group membership of user

```powershell
Get-MgUserMemberOf -userid "marcus@megabigtech.com" | select * -ExpandProperty additionalProperties | Select-Object {$_.AdditionalProperties["displayName"]}
```

Check for other resources

```
# Given subscription ID
$CurrentSubscriptionID = "ceff06cb-e29d-4486-a3ae-eaaec5689f94"

# Set output format
$OutputFormat = "table"

# Set the given subscription as the active one
& az account set --subscription $CurrentSubscriptionID

# List resources in the current subscription
& az resource list -o $OutputFormat
```

Check the contents of a vault

```
# Set variables
$VaultName = "ext-contractors"

# Set the current Azure subscription
$SubscriptionID = "ceff06cb-e29d-4486-a3ae-eaaec5689f94"
az account set --subscription $SubscriptionID

# List and store the secrets
$secretsJson = az keyvault secret list --vault-name $VaultName -o json
$secrets = $secretsJson | ConvertFrom-Json

# List and store the keys
$keysJson = az keyvault key list --vault-name $VaultName -o json
$keys = $keysJson | ConvertFrom-Json

# Output the secrets
Write-Host "Secrets in vault $VaultName"
foreach ($secret in $secrets) {
    Write-Host $secret.id
}

# Output the keys
Write-Host "Keys in vault $VaultName"
foreach ($key in $keys) {
    Write-Host $key.id
}
```

View the secrets

```
# Set variables
$VaultName = "ext-contractors"
$SecretNames = @("alissa-suarez", "josh-harvey", "ryan-garcia")

# Set the current Azure subscription
$SubscriptionID = "ceff06cb-e29d-4486-a3ae-eaaec5689f94"
az account set --subscription $SubscriptionID

# Retrieve and output the secret values
Write-Host "Secret Values from vault $VaultName"
foreach ($SecretName in $SecretNames) {
    $secretValueJson = az keyvault secret show --name $SecretName --vault-name $VaultName -o json
    $secretValue = ($secretValueJson | ConvertFrom-Json).value
    Write-Host "$SecretName - $secretValue"
}
```

Compare against Entra AD

```
az ad user list --query "[?givenName=='Alissa' || givenName=='Josh' || givenName=='Ryan'].{Name:displayName, UPN:userPrincipalName, JobTitle:jobTitle}" -o table
```

Get ObjectID for a user

```
Get-MgUser -UserId ext.josh.harvey@megabigtech.com
```

Check permissions of a group - Role assignment

```
Get-AzRoleAssignment -Scope "/subscriptions/ceff06cb-e29d-4486-a3ae-eaaec5689f94" | Select-Object DisplayName, RoleDefinitionName
```

Check the permissions for a specific role

```
az role definition list --custom-role-only true --query "[?roleName=='Customer Database Access']" -o json
```

List storage accounts in an account

```
az storage account list --query "[].name" -o tsv
```

!!! tip
	An Azure Storage Account is a unique namespace that provides a layer of abstraction over Azure Storage services, allowing us to manage and segregate our storage resources.

Check storage tables in a given database

```
az storage table list --account-name custdatabase --output table --auth-mode login
```

Query storage table

```
az storage entity query --table-name customers --account-name custdatabase --output table --auth-mode login
```

