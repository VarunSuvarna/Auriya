#!/usr/bin/env python3
import os
import sys
from pathlib import Path

def compile_contracts():
    """Compile all PyTeal contracts"""
    contracts_dir = Path("contracts")
    compiled_dir = Path("contracts/compiled")
    compiled_dir.mkdir(exist_ok=True)
    
    contracts = [
        "nft/music_nft.py",
        "token/fungible_token.py", 
        "royalty/royalty_distribution.py",
        "bonding_curve/bonding_curve.py"
    ]
    
    for contract in contracts:
        contract_path = contracts_dir / contract
        if contract_path.exists():
            print(f"Compiling {contract}...")
            os.system(f"python {contract_path} > {compiled_dir}/{contract_path.stem}.teal")
            print(f"✅ {contract_path.stem}.teal")
        else:
            print(f"❌ {contract} not found")

if __name__ == "__main__":
    compile_contracts()