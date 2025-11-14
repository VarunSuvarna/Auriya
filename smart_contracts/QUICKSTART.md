# Quick Start - Auriya Smart Contracts

## Install AlgoKit
```bash
pip install algokit
algokit --version
```

## Setup Project
```bash
cd smart_contracts/projects/auriya-contracts
pip install -r requirements.txt
```

## Alternative: Use Poetry
```bash
poetry install
```

## Build Contracts
```bash
algokit compile python smart_contracts/
```

## Deploy to LocalNet
```bash
algokit localnet start
algokit deploy
```

## Contract Files
- `smart_contracts/music_nft/contract.py` - ARC-3 NFT
- `smart_contracts/fungible_token/contract.py` - ARC-20 Token
- `smart_contracts/royalty_splitter/contract.py` - Royalty Distribution
- `smart_contracts/dao_governance/contract.py` - DAO Voting

## Next Steps
1. Start LocalNet: `algokit localnet start`
2. Deploy contracts: `algokit deploy`
3. Test contracts: `pytest tests/`
4. Deploy to TestNet when ready
