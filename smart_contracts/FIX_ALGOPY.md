# Fix AlgoPy Installation Issue

## Problem
Python 3.13 is too new. AlgoPy requires Python 3.12.

## Solution

### Install Python 3.12
1. Download Python 3.12.8 from: https://www.python.org/downloads/release/python-3128/
2. Run installer
3. CHECK "Add Python to PATH"
4. Install

### Install AlgoPy
```bash
python --version
# Should show: Python 3.12.8

pip install algorand-python
pip install algokit-utils
pip install algokit
```

### Compile Contracts
```bash
cd smart_contracts/projects/auriya-contracts
algokit compile python smart_contracts/
```

## Why Python 3.12?
- Python 3.13 is too new
- AlgoPy/PuyaPy requires Python 3.12
- This is a known compatibility issue

## Quick Check
```bash
python --version  # Must be 3.12.x
pip show algorand-python
```
