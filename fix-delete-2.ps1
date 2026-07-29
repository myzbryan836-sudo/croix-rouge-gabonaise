$path = "public\carnet-terrain\index.html"
$lines = Get-Content -Encoding UTF8 $path

# --- Etape C : gestionnaire de clic "Supprimer" dans la liste ---
$idxRef = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "openDetailModal\(report\);") { $idxRef = $i; break }
}
if ($idxRef -eq -1) {
    Write-Host "ERREUR Etape C : marqueur 'openDetailModal(report);' introuvable."
} else {
    Write-Host "Etape C - ligne de reference trouvee a l'index $idxRef :"
    Write-Host $lines[$idxRef]

    $newBlock = @'

  document.getElementById('ticketsList').addEventListener('click', async (e) => {
    const delBtn = e.target.closest('.delete-report-btn');
    if (!delBtn) return;
    if (!AdminAuth.isAdmin) return;
    if (!confirm('Supprimer definitivement ce signalement ? Cette action est irreversible.')) return;
    delBtn.disabled = true;
    delBtn.textContent = 'Suppression...';
    try {
      await Store.remove(delBtn.dataset.id);
      window.__allReports = (window.__allReports || []).filter(r => r.id !== delBtn.dataset.id);
      renderTickets(window.__allReports);
    } catch (err) {
      alert("Impossible de supprimer ce signalement. Verifiez votre connexion.");
      delBtn.disabled = false;
      delBtn.textContent = 'Supprimer';
    }
  });
'@ -split "`r`n"

    $before = $lines[0..$idxRef]
    $after = $lines[($idxRef+1)..($lines.Length - 1)]
    $lines = $before + $newBlock + $after
    Write-Host "Etape C terminee."
}

[System.IO.File]::WriteAllLines((Resolve-Path $path), $lines, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Script termine (Etape C). Nouvelle longueur : $($lines.Length) lignes."