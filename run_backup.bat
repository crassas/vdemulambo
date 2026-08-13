cd /d "c:\Users\pUR\Desktop\UI VEUS\vdemulambo"
echo Running typecheck... > output_log.txt
call npm run lint >> output_log.txt 2>&1
echo Running build... >> output_log.txt
call npm run build >> output_log.txt 2>&1
echo Switching branch... >> output_log.txt
git switch -c backup/editorial-rose-current-20260813 >> output_log.txt 2>&1
if errorlevel 1 git switch -c backup/editorial-rose-current-20260813-v2 >> output_log.txt 2>&1
echo Adding files... >> output_log.txt
git add . >> output_log.txt 2>&1
git status --short > git_status.txt
echo Committing... >> output_log.txt
git commit -m "backup: versão atual Editorial Rosé antes da integração" >> output_log.txt 2>&1
echo Done. >> output_log.txt
