$ErrorActionPreference = "Stop"

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$entries = @(
    "127.0.0.1 example.localhost",
    "127.0.0.1 real-estate.example.localhost",
    "127.0.0.1 finance.example.localhost",
    "127.0.0.1 visa.example.localhost",
    "127.0.0.1 admin.example.localhost",
    "127.0.0.1 cms.example.localhost"
)

$current = Get-Content -LiteralPath $hostsPath -ErrorAction Stop
$missing = $entries | Where-Object { $current -notcontains $_ }

if ($missing.Count -eq 0) {
    Write-Host "All Rezaei local subdomains already exist in hosts."
    exit 0
}

Add-Content -LiteralPath $hostsPath -Value ""
Add-Content -LiteralPath $hostsPath -Value "# Rezaei local Docker sites"
$missing | ForEach-Object { Add-Content -LiteralPath $hostsPath -Value $_ }

Write-Host "Added Rezaei local subdomains to hosts:"
$missing | ForEach-Object { Write-Host "  $_" }
