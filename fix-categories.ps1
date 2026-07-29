$path = "src\components\admin\ArticleForm.jsx"
$lines = Get-Content -Encoding UTF8 $path

# 1. Remplacer la ligne d'import de supabase pour ajouter l'import categories
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "^import \{ supabase \} from '\.\./\.\./supabase/config'$") {
        $lines[$i] = $lines[$i] + "`nimport { CATEGORIES, categorieLabel } from '../../utils/articleCategories'"
        Write-Host "Import ajoute a la ligne $i"
        break
    }
}

# Re-splitter au cas ou une ligne contient un `n
$content = ($lines -join "`n")
$lines = $content -split "`n"

# 2. Supprimer le bloc const CATEGORIES = [ ... ]
$startIdx = -1
$endIdx = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "^const CATEGORIES = \[") {
        $startIdx = $i
        for ($j = $i; $j -lt $lines.Length; $j++) {
            if ($lines[$j] -match "^\]$") {
                $endIdx = $j
                break
            }
        }
        break
    }
}

if ($startIdx -ge 0 -and $endIdx -ge $startIdx) {
    Write-Host "Bloc CATEGORIES trouve : lignes $startIdx a $endIdx"
    $before = if ($startIdx -gt 0) { $lines[0..($startIdx-1)] } else { @() }
    $after = $lines[($endIdx+1)..($lines.Length - 1)]
    $lines = $before + $after
} else {
    Write-Host "Bloc CATEGORIES introuvable (peut-etre deja supprime)"
}

# 3. Supprimer la ligne de la fonction categorieLabel locale (recherche par debut de ligne, sans le caractere special)
$lines = $lines | Where-Object { $_ -notmatch "^const categorieLabel = \(value\) =>" }

[System.IO.File]::WriteAllLines((Resolve-Path $path), $lines, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Script termine. Nouvelle longueur : $($lines.Length) lignes."