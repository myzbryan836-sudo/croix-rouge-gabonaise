$path = "public\carnet-terrain\index.html"
$lines = Get-Content -Encoding UTF8 $path

# --- Etape D : bouton Supprimer dans la modale "Voir detail" ---
$idxRef = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "const markBtn = document\.getElementById\('detailMarkTreatedBtn'\);") { $idxRef = $i; break }
}
if ($idxRef -eq -1) {
    Write-Host "ERREUR Etape D : marqueur 'detailMarkTreatedBtn' introuvable."
} else {
    Write-Host "Etape D - ligne de reference trouvee a l'index $idxRef :"
    Write-Host $lines[$idxRef]

    $newBlock = @'

    const delBtn = document.getElementById('detailDeleteBtn');
    if (delBtn) {
      delBtn.style.display = AdminAuth.isAdmin ? '' : 'none';
      delBtn.disabled = false;
      delBtn.textContent = 'Supprimer';
      delBtn.onclick = async () => {
        if (!confirm('Supprimer definitivement ce signalement ? Cette action est irreversible.')) return;
        delBtn.disabled = true;
        delBtn.textContent = 'Suppression...';
        try {
          await Store.remove(report.id);
          window.__allReports = (window.__allReports || []).filter(r => r.id !== report.id);
          renderTickets(window.__allReports);
          document.getElementById('detailModal').classList.remove('show');
        } catch (err) {
          alert("Impossible de supprimer ce signalement. Verifiez votre connexion.");
          delBtn.disabled = false;
          delBtn.textContent = 'Supprimer';
        }
      };
    }
'@ -split "`r`n"

    $before = $lines[0..$idxRef]
    $after = $lines[($idxRef+1)..($lines.Length - 1)]
    $lines = $before + $newBlock + $after
    Write-Host "Etape D (JS) terminee."
}

[System.IO.File]::WriteAllLines((Resolve-Path $path), $lines, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Script termine (Etape D partie JS). Nouvelle longueur : $($lines.Length) lignes."