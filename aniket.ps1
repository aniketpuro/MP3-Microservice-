# Variables
$version = "v0.50.18"
$url = "https://github.com/derailed/k9s/releases/download/$version/k9s_Windows_amd64.zip"
$installDir = "C:\Program Files\k9s"
$zipPath = "$env:TEMP\k9s.zip"

# Create install directory
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Path $installDir | Out-Null
}

# Download k9s
Write-Host "Downloading k9s..."
Invoke-WebRequest -Uri $url -OutFile $zipPath

# Extract zip
Write-Host "Extracting..."
Expand-Archive -Path $zipPath -DestinationPath $installDir -Force

# Add to PATH (system-wide)
Write-Host "Adding to PATH..."
$currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)

if ($currentPath -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$currentPath;$installDir",
        [EnvironmentVariableTarget]::Machine
    )
}

# Cleanup
Remove-Item $zipPath -Force

Write-Host "✅ k9s installed successfully!"
Write-Host "Restart your terminal and run: k9s version"