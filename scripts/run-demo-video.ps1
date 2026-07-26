param(
    [ValidateSet("record", "screenshot")]
    [string]$Mode = "record"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$Storyboard = Join-Path $Root "demo.storyboard.json"
$PwDir = Join-Path $Root "tools\demo-video"
$SkillScript = Join-Path $env:USERPROFILE ".cursor\skills\demo-video-factory\scripts\run_demo_video.ps1"

if (-not (Test-Path $Storyboard)) {
    Write-Error "Missing demo.storyboard.json"
}
if (-not (Test-Path $SkillScript)) {
    Write-Error "Missing demo-video-factory skill script: $SkillScript"
}
if (-not (Test-Path (Join-Path $PwDir "node_modules\playwright"))) {
    Write-Host "Installing Playwright into tools/demo-video ..." -ForegroundColor Yellow
    Push-Location $PwDir
    npm install
    npx playwright install chromium
    npx playwright install ffmpeg
    Pop-Location
}

try {
    $health = Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing -TimeoutSec 5
    if ($health.StatusCode -ge 400) { throw "bad status" }
} catch {
    Write-Error "Demo server not reachable at http://127.0.0.1:3000. Run 'npm start' in another terminal first."
}

Write-Host "Running demo-video-factory ($Mode) ..." -ForegroundColor Cyan
powershell -File $SkillScript -Storyboard $Storyboard -Mode $Mode
