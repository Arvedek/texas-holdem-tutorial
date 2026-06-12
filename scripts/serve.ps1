param(
  [int]$Port = 5173
)

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Prefix = "http://localhost:$Port/"
$Listener = [System.Net.HttpListener]::new()
$Listener.Prefixes.Add($Prefix)

function Get-ContentType($Path) {
  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8" }
    ".css" { "text/css; charset=utf-8" }
    ".js" { "text/javascript; charset=utf-8" }
    ".json" { "application/json; charset=utf-8" }
    ".svg" { "image/svg+xml" }
    ".png" { "image/png" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    default { "application/octet-stream" }
  }
}

$Listener.Start()
Write-Host "Serving $Root at $Prefix"
Write-Host "Press Ctrl+C to stop."

try {
  while ($Listener.IsListening) {
    $Context = $Listener.GetContext()
    $RequestPath = [System.Net.WebUtility]::UrlDecode($Context.Request.Url.AbsolutePath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($RequestPath)) {
      $RequestPath = "index.html"
    }

    $Candidate = Join-Path $Root $RequestPath
    $FullPath = [System.IO.Path]::GetFullPath($Candidate)

    if (-not $FullPath.StartsWith($Root.Path, [System.StringComparison]::OrdinalIgnoreCase)) {
      $Context.Response.StatusCode = 403
      $Context.Response.Close()
      continue
    }

    if (-not [System.IO.File]::Exists($FullPath)) {
      $Context.Response.StatusCode = 404
      $Context.Response.Close()
      continue
    }

    $Bytes = [System.IO.File]::ReadAllBytes($FullPath)
    $Context.Response.ContentType = Get-ContentType $FullPath
    $Context.Response.ContentLength64 = $Bytes.Length
    $Context.Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
    $Context.Response.Close()
  }
}
finally {
  $Listener.Stop()
  $Listener.Close()
}
