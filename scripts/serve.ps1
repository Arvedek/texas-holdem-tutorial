param(
  [int]$Port = 5173
)

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Prefix = "http://localhost:$Port/"
$Address = [System.Net.IPAddress]::Parse("127.0.0.1")
$Listener = [System.Net.Sockets.TcpListener]::new($Address, $Port)
$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)

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

function Send-Response($Stream, [int]$StatusCode, [string]$StatusText, [string]$ContentType, [byte[]]$Body) {
  $Header = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`n`r`n"
  $HeaderBytes = $Utf8NoBom.GetBytes($Header)
  $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
  if ($Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
}

function Send-Text($Stream, [int]$StatusCode, [string]$StatusText, [string]$Text) {
  Send-Response $Stream $StatusCode $StatusText "text/plain; charset=utf-8" $Utf8NoBom.GetBytes($Text)
}

$Listener.Start()
Write-Host "Serving $Root at $Prefix"
Write-Host "Press Ctrl+C to stop."

try {
  while ($true) {
    $Client = $Listener.AcceptTcpClient()
    try {
      $Stream = $Client.GetStream()
      $Reader = [System.IO.StreamReader]::new($Stream, $Utf8NoBom, $false, 1024, $true)
      $RequestLine = $Reader.ReadLine()

      if ([string]::IsNullOrWhiteSpace($RequestLine)) {
        Send-Text $Stream 400 "Bad Request" "bad request"
        continue
      }

      while ($true) {
        $Line = $Reader.ReadLine()
        if ([string]::IsNullOrEmpty($Line)) {
          break
        }
      }

      $Parts = $RequestLine.Split(" ")
      if ($Parts.Length -lt 2 -or $Parts[0] -ne "GET") {
        Send-Text $Stream 405 "Method Not Allowed" "method not allowed"
        continue
      }

      $RequestPath = [System.Net.WebUtility]::UrlDecode($Parts[1].Split("?")[0].TrimStart("/"))
      if ([string]::IsNullOrWhiteSpace($RequestPath)) {
        $RequestPath = "index.html"
      }

      $Candidate = Join-Path $Root $RequestPath
      $FullPath = [System.IO.Path]::GetFullPath($Candidate)

      if (-not $FullPath.StartsWith($Root.Path, [System.StringComparison]::OrdinalIgnoreCase)) {
        Send-Text $Stream 403 "Forbidden" "forbidden"
        continue
      }

      if (-not [System.IO.File]::Exists($FullPath)) {
        Send-Text $Stream 404 "Not Found" "not found"
        continue
      }

      $Bytes = [System.IO.File]::ReadAllBytes($FullPath)
      Send-Response $Stream 200 "OK" (Get-ContentType $FullPath) $Bytes
    } finally {
      if ($Reader) {
        $Reader.Dispose()
      }
      if ($Stream) {
        $Stream.Dispose()
      }
      $Client.Close()
    }
  }
} finally {
  $Listener.Stop()
}
