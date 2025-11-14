# Fix Python PATH Issue

## Problem
Python 3.13.2 is installed but not recognized in terminal.

## Solution

### Option 1: Add Python to PATH (Recommended)
1. Press `Win + R`
2. Type: `sysdm.cpl` and press Enter
3. Go to "Advanced" tab → "Environment Variables"
4. Under "System variables", find "Path" → Click "Edit"
5. Click "New" and add: `C:\Users\Varun\AppData\Local\Programs\Python\Python313`
6. Click "New" again and add: `C:\Users\Varun\AppData\Local\Programs\Python\Python313\Scripts`
7. Click OK on all windows
8. **Close and reopen terminal**
9. Test: `python --version`

### Option 2: Use Full Path
Instead of `python`, use full path:
```bash
C:\Users\Varun\AppData\Local\Programs\Python\Python313\python.exe --version
```

### Option 3: Create Alias (Quick Fix)
In PowerShell:
```powershell
Set-Alias python "C:\Users\Varun\AppData\Local\Programs\Python\Python313\python.exe"
```

### Option 4: Reinstall Python
1. Download Python 3.13.2 from python.org
2. Run installer
3. **CHECK "Add Python to PATH"** ✓
4. Click "Install Now"

## After Fix
```bash
python --version
pip install algokit
cd smart_contracts/projects/auriya-contracts
algokit compile python smart_contracts/
```
