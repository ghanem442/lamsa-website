# PowerShell Script to Update All URLs to Clean URLs
# Run this from the project root directory

Write-Host "🔄 Starting Clean URL Conversion..." -ForegroundColor Cyan

# Define all URL replacements
$replacements = @(
    # Main navigation links
    @{ Old = 'href="index.html"'; New = 'href="/home"' },
    @{ Old = 'href="shop.html"'; New = 'href="/shop"' },
    @{ Old = 'href="about.html"'; New = 'href="/about"' },
    @{ Old = 'href="contact.html"'; New = 'href="/contact"' },
    @{ Old = 'href="auth.html"'; New = 'href="/auth"' },
    @{ Old = 'href="account.html"'; New = 'href="/account"' },
    @{ Old = 'href="admin.html"'; New = 'href="/admin"' },
    @{ Old = 'href="perfume.html"'; New = 'href="/perfume-studio"' },
    @{ Old = 'href="routine.html"'; New = 'href="/routine-finder"' },
    @{ Old = 'href="gift.html"'; New = 'href="/gift-designer"' },
    @{ Old = 'href="intro.html"'; New = 'href="/"' },
    
    # Mobile nav - keep class active
    @{ Old = '<a href="index.html" class="active"'; New = '<a href="/home" class="active"' },
    @{ Old = '<a href="shop.html" class="active"'; New = '<a href="/shop" class="active"' },
    @{ Old = '<a href="about.html" class="active"'; New = '<a href="/about" class="active"' },
    @{ Old = '<a href="contact.html" class="active"'; New = '<a href="/contact" class="active"' },
    @{ Old = '<a href="perfume.html" class="active"'; New = '<a href="/perfume-studio" class="active"' },
    @{ Old = '<a href="routine.html" class="active"'; New = '<a href="/routine-finder" class="active"' },
    @{ Old = '<a href="gift.html" class="active"'; New = '<a href="/gift-designer" class="active"' },
    
    # Nav links - keep desktop active class
    @{ Old = '<a href="index.html" data-key="nav_home"'; New = '<a href="/home" data-key="nav_home"' },
    @{ Old = '<a href="shop.html" data-key="nav_shop"'; New = '<a href="/shop" data-key="nav_shop"' },
    @{ Old = '<a href="about.html" data-key="nav_about"'; New = '<a href="/about" data-key="nav_about"' },
    @{ Old = '<a href="contact.html" data-key="nav_contact"'; New = '<a href="/contact" data-key="nav_contact"' },
    
    # Active states
    @{ Old = '<a href="about.html" class="active" data-key="nav_about"'; New = '<a href="/about" class="active" data-key="nav_about"' },
    @{ Old = '<a href="shop.html" class="active" data-key="nav_shop"'; New = '<a href="/shop" class="active" data-key="nav_shop"' },
    @{ Old = '<a href="contact.html" class="active" data-key="nav_contact"'; New = '<a href="/contact" class="active" data-key="nav_contact"' }
)

# Get all HTML files
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -File

$totalFiles = $htmlFiles.Count
$processedFiles = 0

foreach ($file in $htmlFiles) {
    $processedFiles++
    Write-Host "[$processedFiles/$totalFiles] Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $changesCount = 0
    
    # Apply all replacements
    foreach ($replacement in $replacements) {
        if ($content -match [regex]::Escape($replacement.Old)) {
            $content = $content -replace [regex]::Escape($replacement.Old), $replacement.New
            $changesCount++
        }
    }
    
    # Save if changes were made
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  ✅ Updated $changesCount links" -ForegroundColor Green
    } else {
        Write-Host "  ⚪ No changes needed" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Clean URL conversion completed!" -ForegroundColor Green
Write-Host "Total files processed: $totalFiles" -ForegroundColor Cyan
