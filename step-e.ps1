$path = "public\carnet-terrain\index.html"
$lines = Get-Content -Encoding UTF8 $path

$idx = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "Description :.*escapeHtml\(report\.description") {
        $idx = $i
        break
    }
}

if ($idx -eq -1) {
    Write-Host "ERREUR : ligne de reference introuvable."
} else {
    Write-Host "Ligne de reference trouvee a l'index $idx :"
    Write-Host $lines[$idx]

    $newLine = '      ${(report.media && report.media.length) ? (''<p><strong>Photos / videos :</strong></p><div class="media-grid">'' + report.media.map(m => m.type === ''video'' ? (''<div class="media-thumb"><video src="'' + m.dataUrl + ''" controls></video></div>'') : (''<div class="media-thumb"><img src="'' + m.dataUrl + ''" alt="media"></div>'')).join('''') + ''</div>'') : ''''}'

    $before = $lines[0..$idx]
    $after = $lines[($idx+1)..($lines.Length - 1)]
    $newLines = $before + $newLine + $after

    [System.IO.File]::WriteAllLines((Resolve-Path $path), $newLines, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Etape E terminee. Nouvelle longueur : $($newLines.Length) lignes."
}