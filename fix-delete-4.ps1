$path = "public\carnet-terrain\index.html"
$lines = Get-Content -Encoding UTF8 $path

# --- Etape E : bouton HTML detailDeleteBtn dans la modale ---
$idxRef = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'id="detailMarkTreatedBtn"') { $idxRef = $i; break }
}
if ($idxRef -eq -1) {
    Write-Host "ERREUR Etape E : marqueur 'detailMarkTreatedBtn' (HTML) introuvable."
} else {
    Write-Host "Etape E - ligne de reference trouvee a l'index $idxRef :"
    Write-Host $lines[$idxRef]

    $newLine = '        <button class="modal-btn secondary" id="detailDeleteBtn" style="display:none;color:#c0392b;border-color:#c0392b;">Supprimer</button>'

    $before = $lines[0..$idxRef]
    $after = $lines[($idxRef+1)..($lines.Length - 1)]
    $lines = $before + $newLine + $after
    Write-Host "Etape E terminee : bouton HTML ajoute."
}

[System.IO.File]::WriteAllLines((Resolve-Path $path), $lines, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Script termine (Etape E). Nouvelle longueur : $($lines.Length) lignes."