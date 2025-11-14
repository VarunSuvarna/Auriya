# Auriya Smart Contracts - AlgoKit Deployment Guide

## Production-Ready Contracts for Lora Network

### Prerequisites
```bash
pip install algokit
algokit --version
```

### Setup
```bash
cd smart_contracts/projects/auriya-contracts
poetry install
```

### Build Contracts
```bash
poetry run puyapy smart_contracts
```

### Deploy to LocalNet (Lora)
```bash
algokit localnet start
poetry run python -m smart_contracts.deploy --network localnet
```

### Deploy to TestNet
```bash
poetry run python -m smart_contracts.deploy --network testnet
```

### Deploy to MainNet
```bash
poetry run python -m smart_contracts.deploy --network mainnet
```

## Contract Addresses (After Deployment)
- MusicNFT: [APP_ID]
- FungibleToken: [APP_ID]
- RoyaltySplitter: [APP_ID]
- DAOGovernance: [APP_ID]

## Security Features
- ✅ Reentrancy protection
- ✅ Access control
- ✅ Input validation
- ✅ Overflow protection
- ✅ Frozen state management

## Testing
```bash
pytest tests/ -v --cov
```
