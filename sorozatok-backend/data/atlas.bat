@echo off
:BEGIN
CLS

ECHO ---------- Setup Mongo Atlas Uri ----------
SET /p atlas=
echo OKAY! your Uri is %atlas% , right?
echo (Y/N)

SET db=sorozatok
:: titles, episodes, users, identitycounters

SET import="%MONGO%\mongoimport.exe"
SET export="%MONGO%\mongoexport.exe"

ECHO 1. -- Import --
ECHO 2. -- Export --
CHOICE /N /C:12 /M "Enter your choice:"%1
IF ERRORLEVEL ==2 GOTO EXPORT
IF ERRORLEVEL ==1 GOTO IMPORT

:IMPORT
SET /P AREYOUSURE=Are you sure (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END
ECHO ---------- Importing to the atlas database ----------
%import% --uri=%atlas%/%db% --collection=titles --drop --file=db_titles.json --jsonArray
%import% --uri=%atlas%/%db%  --collection=episodes --drop --file=db_episodes.json --jsonArray
%import% --uri=%atlas%/%db%  --collection=users --drop --file=db_users.json --jsonArray
%import% --uri=%atlas%/%db%  --collection=identitycounters --drop --file=db_counters.json --jsonArray
GOTO END

:EXPORT
SET /P AREYOUSURE=Are you sure (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END
ECHO ---------- Exporting from the atlas database ----------
%export% --uri=%atlas%/%db% --collection=titles --out=db_titles.json --jsonArray --pretty
%export% --uri=%atlas%/%db% --collection=episodes --out=db_episodes.json --jsonArray --pretty
%export% --uri=%atlas%/%db% --collection=users --out=db_users.json --jsonArray --pretty
%export% --uri=%atlas%/%db% --collection=identitycounters --out=db_counters.json --jsonArray --pretty
GOTO END

:END
pause