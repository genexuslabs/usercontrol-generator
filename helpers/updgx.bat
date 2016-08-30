echo off

rem Move to UC folder
cd /D %3

rem Remove quotes
set gxbase=%2
set gxbase
set gxbase=%gxbase:"=%
set gxbase

SET gxuc="%gxbase%\UserControls\%1"
echo %gxuc%

ECHO Updating GeneXus at: %gxuc%
xcopy .\build\debug %gxuc% /E /I /Y

ECHO Installing UserControl
SET gxpath="%gxbase%\Genexus.exe"
%gxpath% -install
