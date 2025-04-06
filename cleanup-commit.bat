@echo off
echo Committing cleanup changes...

git add .
git commit -m "chore: remove unused dependencies and configuration" -m "- Remove Supabase configuration and schema files" -m "- Remove unused dependencies from server package.json" -m "- Clean up environment variable templates" -m "- Remove unused deployment documentation" -m "- Update setup instructions"

echo.
echo Cleanup committed! You can now push to GitHub:
echo git push origin main
echo. 