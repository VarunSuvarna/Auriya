# Compile Auriya Contracts

## Fixed Structure
Added `__init__.py` files to all contract directories to resolve duplicate module names.

## Compile Command
```bash
cd smart_contracts/projects/auriya-contracts
algokit compile python smart_contracts/
```

## Expected Output
- `music_nft/contract.approval.teal`
- `fungible_token/contract.approval.teal`
- `royalty_splitter/contract.approval.teal`
- `dao_governance/contract.approval.teal`

## Deploy
```bash
algokit localnet start
algokit deploy
```
