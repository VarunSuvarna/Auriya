# Setup Python for AlgoKit

## Install Python 3.12
Download from: https://www.python.org/downloads/

**Important**: Check "Add Python to PATH" during installation

## Verify Installation
```bash
python --version
pip --version
```

## Install AlgoKit
```bash
pip install algokit
```

## Install Project Dependencies
```bash
cd smart_contracts/projects/auriya-contracts
pip install -r requirements.txt
```

## Compile Contracts
```bash
algokit compile python smart_contracts/
```

## Alternative: Use Pre-compiled TEAL
If Python setup is complex, contracts can be written directly in TEAL or use online Algorand IDE.

## Next Steps After Python Install
1. Restart terminal
2. Run: `python --version`
3. Run: `algokit compile python smart_contracts/`
