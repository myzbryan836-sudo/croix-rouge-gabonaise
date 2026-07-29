$path = "public\carnet-terrain\index.html"
$lines = Get-Content -Encoding UTF8 $path

# --- Etape A : ajouter Store.remove() ---
$idxReturn = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "return Object\.values\(all\);") { $idxReturn = $i; break }
}
if ($idxReturn -eq -1) {
    Write-Host "ERREUR Etape A : marqueur 'return Object.values(all)' introuvable."
} else {
    $idxListClose = $idxReturn + 1
    Write-Host "Etape A - ligne de fermeture de list() (doit etre '  }') : [$($lines[$idxListClose].Trim())]"
    if ($lines[$idxListClose].Trim() -eq '}') {
        $lines[$idxListClose] = "  },"
        $removeBlock = @'
  async remove(id) {
    if (this.mode === 'supabase') {
      const { error } = await this.client.from('signalements').delete().eq('id', id);
      if (error) throw error;
    } else {
      const all = JSON.parse(localStorage.getItem('rc_signalements') || '{}');
      delete all[id];
      localStorage.setItem('rc_signalements', JSON.stringify(all));
    }
  }
'@ -split "`r`n"
        $before = $lines[0..$idxListClose]
        $after = $lines[($idxListClose+1)..($lines.Length - 1)]
        $lines = $before + $removeBlock + $after
        Write-Host "Etape A terminee : Store.remove() ajoute."
    } else {
        Write-Host "ERREUR Etape A : la ligne apres 'return Object.values(all)' n'est pas '}'. Abandon de cette etape."
    }
}

# --- Etape B : bouton Supprimer dans la liste (renderTickets) ---
$idxVoirDetail = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "voir-detail-btn.*Voir detail") { $idxVoirDetail = $i; break }
}
if ($idxVoirDetail -eq -1) {
    Write-Host "ERREUR Etape B : bouton 'Voir detail' introuvable."
} else {
    Write-Host "Etape B - ligne trouvee a l'index $idxVoirDetail"
    $deleteBtnLine = '            ${AdminAuth.isAdmin ? `<button type="button" class="delete-report-btn" data-id="${escapeHtml(r.id)}" style="color:#c0392b;border-color:#c0392b;">Supprimer</button>` : ""}'
    $before = $lines[0..$idxVoirDetail]
    $after = $lines[($idxVoirDetail+1)..($lines.Length - 1)]
    $lines = $before + $deleteBtnLine + $after
    Write-Host "Etape B terminee : bouton Supprimer ajoute dans la liste."
}

[System.IO.File]::WriteAllLines((Resolve-Path $path), $lines, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Script termine (Etapes A+B). Nouvelle longueur : $($lines.Length) lignes."