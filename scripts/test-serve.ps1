param(
  [int]$Port = 5180
)

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Server = Start-Process -FilePath "powershell.exe" `
  -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", (Join-Path $PSScriptRoot "serve.ps1"), "-Port", "$Port") `
  -WorkingDirectory $Root `
  -WindowStyle Hidden `
  -PassThru

try {
  $deadline = (Get-Date).AddSeconds(8)
  $index = $null
  while ((Get-Date) -lt $deadline) {
    try {
      $index = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/" -TimeoutSec 1
      break
    } catch {
      Start-Sleep -Milliseconds 250
    }
  }

  if (-not $index -or $index.StatusCode -ne 200 -or $index.Content -notmatch "src/main.js") {
    throw "index.html was not served correctly."
  }

  $tests = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/tests.html" -TimeoutSec 2
  if ($tests.StatusCode -ne 200 -or $tests.Content -notmatch "Browser Test Runner") {
    throw "tests.html was not served correctly."
  }

  Write-Host "serve.ps1 smoke test passed on port $Port"
} finally {
  if ($Server -and -not $Server.HasExited) {
    Stop-Process -Id $Server.Id -Force
  }
}
