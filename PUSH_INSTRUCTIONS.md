Push instructions — backdate commit (you run these locally)

Important: These commands will force-push to the remote `main` branch and may overwrite history. Make sure you want to replace the remote.

Recommended date: two days ago (May 22, 2026). Adjust as needed.

Unix / Git Bash (Linux, macOS, Git Bash on Windows):

```bash
cd path/to/edu
# Initialize (if necessary), add remote, commit with backdate and push
./scripts/push_with_backdate.sh git@github.com:apreezofficial/edu-manager.git "Initial import: Next.js + PHP backend" "2026-05-22T12:00:00"
```

PowerShell (Windows):

```powershell
cd path\to\edu
# Run the included PS script (ensure execution policy allows it)
.
\scripts\push_with_backdate.ps1 -RemoteUrl "git@github.com:apreezofficial/edu-manager.git" -Message "Initial import: Next.js + PHP backend" -Date "2026-05-22T12:00:00"
```

Manual commands (step-by-step):

1. From the project root:

```bash
cd path/to/edu
git init
git remote add origin git@github.com:apreezofficial/edu-manager.git
git add -A
GIT_AUTHOR_DATE="2026-05-22T12:00:00" GIT_COMMITTER_DATE="2026-05-22T12:00:00" git commit -m "Initial import: Next.js + PHP backend"
git branch -M main
git push -u origin main --force
```

PowerShell equivalent (single-commit backdate):

```powershell
cd path\to\edu
git init
git remote add origin git@github.com:apreezofficial/edu-manager.git
git add -A
$env:GIT_AUTHOR_DATE = '2026-05-22T12:00:00'
$env:GIT_COMMITTER_DATE = '2026-05-22T12:00:00'
git commit -m "Initial import: Next.js + PHP backend"
Remove-Item Env:GIT_AUTHOR_DATE; Remove-Item Env:GIT_COMMITTER_DATE
git branch -M main
git push -u origin main --force
```

Notes & safety:
- Force-pushing overwrites remote history; if the repo already has content you want to preserve, do not force-push. Instead create a new branch and push that branch.
- If you prefer to keep history, commit normally (without --force) and push to a feature branch.
- These scripts set the commit author/committer date to the supplied value — GitHub will display that date in the commit history.

If you'd like, I can:
- Create a branch instead of pushing to `main`.
- Convert the scripts to create multiple commits (one per folder) with progressively backdated timestamps.
- Prepare a PR-ready branch structure instead of force-pushing.
