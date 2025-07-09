echo Minifying the bundled JavaScript file...
npm run minify
if %ERRORLEVEL% NEQ 0 (
    echo Minification failed.
    pause
    exit /b %ERRORLEVEL%
)

echo Build and minification complete.
pause