# Disable Windows Python App Alias

## The Issue
Windows has a Python app alias that redirects to Microsoft Store instead of your installed Python.

## Fix (Takes 30 seconds)

1. Press `Win + I` (opens Settings)
2. Search for: **"Manage app execution aliases"**
3. Find these two items:
   - **App Installer python.exe** → Turn OFF
   - **App Installer python3.exe** → Turn OFF
4. Close Settings
5. **Close and reopen your terminal**
6. Test: `python --version`

## Should Show
```
Python 3.13.2
```

## Then Run
```bash
python --version
pip install algokit
cd smart_contracts/projects/auriya-contracts
algokit compile python smart_contracts/
```

This disables the Microsoft Store redirect and uses your installed Python 3.13.2.
