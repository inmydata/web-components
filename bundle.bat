:: filepath: /c:/workdir/git/inmydata/Components/WebComponents/build.bat
@echo off
echo Running Rollup to bundle JavaScript files...
npx rollup -c
if %ERRORLEVEL% NEQ 0 (
    echo Rollup bundling failed.
    pause
    exit /b %ERRORLEVEL%
)

