# Auriya Smart Contracts - Algorand ARCs Compliance

## 📋 Overview
All smart contracts are built following Algorand's official standards (ARCs) for maximum compatibility and ecosystem integration.

## 🔗 Algorand Standards Compliance

### **ARC-3: NFT Standard**
**Contract**: `nft/music_nft.py`
- ✅ Metadata standards for music NFTs
- ✅ IPFS integration for decentralized storage
- ✅ Authenticity verification
- ✅ Asset information structure (name, artist, genre, duration, audio)
- ✅ Royalty enforcement on transfers

**Metadata Structure**:
```json
{
  "name": "Song Title",
  "description": "Song Description",
  "image": "ipfs://[cover_art_hash]",
  "properties": {
    "artist": "Artist Name",
    "genre": "Genre",
    "duration": "3:45",
    "audio": "ipfs://[audio_hash]"
  }
}
```

### **ARC-20: Fungible Token Standard**
**Contract**: `token/fungible_token.py`
- ✅ DEX compatibility for trading
- ✅ Wallet integration support
- ✅ Standard transfer methods
- ✅ Balance queries
- ✅ Opt-in mechanism

**Features**:
- Custom ticker symbols (max 6 characters)
- Configurable total supply
- Transfer functionality
- Balance tracking

### **ARC-0010/0011: Wallet Connectivity**
**Integration**: Frontend dApp
- ✅ Wallet connection standards
- ✅ User authentication
- ✅ Transaction signing
- ✅ Multi-wallet support (Pera, Defly, MyAlgo)

### **ABI: Application Binary Interface**
**All Contracts**
- ✅ Standardized method signatures
- ✅ Type safety
- ✅ Contract interaction standards
- ✅ Clear function definitions

## 📁 Contract Structure

```
contracts/
├── nft/
│   └── music_nft.py          # ARC-3 compliant NFT
├── token/
│   └── fungible_token.py     # ARC-20 compliant token
├── royalty/
│   └── royalty_distribution.py  # Automated royalty splits
├── governance/
│   └── dao_voting.py         # Token-weighted voting
└── README.md
```

## 🚀 Deployment

### Prerequisites
```bash
pip install pyteal py-algorand-sdk
```

### Compile Contracts
```bash
python contracts/nft/music_nft.py > music_nft.teal
python contracts/token/fungible_token.py > fungible_token.teal
python contracts/royalty/royalty_distribution.py > royalty.teal
python contracts/governance/dao_voting.py > governance.teal
```

### Deploy to Algorand
```bash
# TestNet deployment
goal app create --creator [CREATOR_ADDRESS] --approval-prog music_nft.teal --clear-prog clear.teal

# MainNet deployment (after testing)
goal app create --creator [CREATOR_ADDRESS] --approval-prog music_nft.teal --clear-prog clear.teal -d [MAINNET_DATA_DIR]
```

## 🔧 Integration with Frontend

### Wallet Connection (ARC-0010/0011)
```typescript
import { PeraWalletConnect } from '@perawallet/connect'

const peraWallet = new PeraWalletConnect()
await peraWallet.connect()
```

### NFT Minting (ARC-3)
```typescript
const txn = algosdk.makeApplicationCallTxn(
  sender,
  params,
  appId,
  [
    new Uint8Array(Buffer.from("Song Title")),
    new Uint8Array(Buffer.from("Artist Name")),
    algosdk.encodeUint64(10), // 10% royalty
    new Uint8Array(Buffer.from(ipfsHash))
  ]
)
```

### Token Creation (ARC-20)
```typescript
const txn = algosdk.makeApplicationCallTxn(
  sender,
  params,
  appId,
  [
    new Uint8Array(Buffer.from("Token Name")),
    new Uint8Array(Buffer.from("TICKER")),
    algosdk.encodeUint64(1000000) // Total supply
  ]
)
```

## 📊 Contract Features

### 1. Music NFT (ARC-3)
- Unique ownership (total=1)
- IPFS metadata
- Royalty enforcement
- Transfer tracking

### 2. Fungible Token (ARC-20)
- Tradeable tokens
- DEX compatible
- Staking support
- Balance queries

### 3. Royalty Distribution
- Multi-party splits
- Instant payments
- Stream tracking
- Transparent accounting

### 4. DAO Governance
- Token-weighted voting
- Proposal creation
- Community decisions
- Execution threshold

## 🔐 Security Features

- ✅ Creator verification
- ✅ Balance checks before transfers
- ✅ Royalty enforcement
- ✅ Opt-in requirements
- ✅ Group transaction validation

## 📝 Testing

```bash
# Run tests
pytest tests/

# Test on TestNet
goal app call --app-id [APP_ID] --from [SENDER] --app-arg "str:transfer"
```

## 🌐 Network Configuration

- **TestNet**: For development and testing
- **MainNet**: For production deployment
- **IPFS**: Pinata for decentralized storage

## 📚 Resources

- [Algorand Developer Portal](https://developer.algorand.org/)
- [ARC Standards](https://arc.algorand.foundation/)
- [PyTeal Documentation](https://pyteal.readthedocs.io/)
- [Algorand SDK](https://github.com/algorand/js-algorand-sdk)
