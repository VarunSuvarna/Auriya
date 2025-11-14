# Auriya Smart Contracts - Deployment Ready

## Minimal Valid Contracts for Lora

### Contracts Created
1. **MusicNFT** - NFT creation and transfer
2. **FungibleToken** - Token creation and transfer  
3. **RoyaltySplitter** - Royalty distribution
4. **DAOGovernance** - Voting system

### Compile & Deploy
```bash
cd smart_contracts/projects/auriya-contracts
algokit compile python smart_contracts/
algokit localnet start
algokit deploy
```

### Next Steps
These are minimal scaffolds. Expand with:
- State management (GlobalState, LocalState)
- Business logic in method bodies
- Input validation
- Access control
- Event emission

### Production Implementation
For full production contracts, implement:
- ARC-3 metadata in MusicNFT
- ARC-20 balance tracking in FungibleToken
- Multi-party splits in RoyaltySplitter
- Token-weighted voting in DAOGovernance
