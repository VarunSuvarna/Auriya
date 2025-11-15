# Auriya Smart Contracts - AlgoKit Production Suite

## 🎯 Production-Ready Contracts for Lora Deployment

### Contracts Built
1. **MusicNFT** - ARC-3 compliant NFT with royalty enforcement
2. **FungibleToken** - ARC-20 compliant DEX-ready token
3. **RoyaltySplitter** - Automated multi-party royalty distribution
4. **DAOGovernance** - Token-weighted community voting

### Security Features
- Input validation on all methods
- Access control (creator-only functions)
- Reentrancy protection
- Overflow/underflow protection
- Frozen state management
- Group transaction validation

### AlgoKit Commands
```bash
# Install dependencies
cd projects/auriya-contracts
poetry install

# Build contracts
poetry run puyapy smart_contracts

# Deploy to LocalNet
algokit localnet start
poetry run python -m smart_contracts.deploy

# Run tests
pytest tests/ -v
```

### Contract Features

#### MusicNFT (ARC-3)
- Unique music ownership
- IPFS metadata storage
- Automatic royalty enforcement
- Freeze/unfreeze capability
- Transfer tracking

#### FungibleToken (ARC-20)
- Custom ticker (max 6 chars)
- Configurable supply and decimals
- DEX compatible
- Opt-in mechanism
- Balance queries

#### RoyaltySplitter
- Multi-party revenue splits
- Instant automated payments
- Stream counting
- Revenue tracking
- Configurable percentages

#### DAOGovernance
- Token-weighted voting
- Proposal creation with threshold
- Time-bound voting periods
- Vote tracking
- Duplicate vote prevention

### Deployment Networks
- **LocalNet (Lora)**: Development and testing
- **TestNet**: Pre-production validation
- **MainNet**: Production deployment

### ARC Compliance
✅ ARC-3: NFT metadata standards
✅ ARC-20: Fungible token standards
✅ ARC-0010/0011: Wallet connectivity
✅ ABI: Standardized interfaces
