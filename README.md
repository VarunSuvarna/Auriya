# **AURIYA**

<div align="center">

![Auriya Banner](https://via.placeholder.com/1200x400/001324/15b9b7?text=AURIYA+-+Future+of+Music+Investment+on+Algorand)

[![Live Demo](https://img.shields.io/badge/Live-Demo-15b9b7?style=for-the-badge)](https://auriya.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/VarunSuvarna/Auriya)
[![Built on Algorand](https://img.shields.io/badge/Built_on-Algorand-000000?style=for-the-badge)](https://algorand.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

[Features](#-features) • [Demo](#-live-demo) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Roadmap](#-roadmap) • [Contributing](#-contributing)

</div>

---

## **📖 Overview**

**Auriya** is a revolutionary music token launchpad built on Algorand that empowers artists to launch their songs as tradable tokens using a bonding curve mechanism. Inspired by Pump.fun's viral success, Auriya brings true utility to music tokens—enabling streaming, transparent royalties, and fan-driven artist support.

Unlike traditional music platforms that pay artists pennies per stream, Auriya creates a new economy where fans invest in music they love, artists receive instant payments, and everyone benefits as songs gain popularity.

### **🎯 Problem Statement**

- **Artists earn less than $0.004 per stream** on major platforms
- **Fans have zero ownership** in the music they support
- **No transparent payment system** for artist royalties
- **High barriers** to launching music commercially

### **💡 Our Solution**

Auriya provides:
- **Fair Launch Mechanism** via bonding curves—no presales or insider advantages
- **Instant Artist Payments** through automated smart contracts
- **Real Utility** through exclusive streaming access for token holders
- **Carbon-Negative Infrastructure** on Algorand blockchain
- **Transparent Economics** with on-chain verification of all transactions

---

## **✨ Features**

### **🎵 For Artists**

- **One-Click Token Launch**: Upload music, deploy token, and start selling—all in minutes
- **Bonding Curve Economics**: Automatic price discovery based on demand
- **Instant Royalties**: 1% of every trade goes directly to artist wallet
- **DEX Graduation**: Automatic listing on Tinyman when threshold is reached
- **Creator Dashboard**: Real-time analytics on sales, holders, and earnings

### **🎧 For Fans**

- **Discover Trending Music**: Browse tokens by market cap, price change, and holder count
- **Early Investment Opportunity**: Buy tokens at bonding curve prices before DEX listing
- **Exclusive Streaming**: Token holders get premium access to lossless audio
- **Trade Freely**: Buy and sell tokens as song popularity changes
- **Transparent Data**: All transactions verifiable on Algorand blockchain

### **🔐 Platform Features**

- **Pera Wallet Integration**: Seamless Algorand wallet connection
- **Low Transaction Costs**: ~$0.001 per transaction vs Ethereum's $50+
- **Fast Finality**: 3.7-second block times
- **Eco-Friendly**: Built on carbon-negative Algorand
- **Mobile Responsive**: Works perfectly on all devices

---

## **🎥 Live Demo**

**Experience Auriya:** [https://auriya.vercel.app](https://auriya.vercel.app)

### **Current Features Demonstrated:**

✅ Music token discovery page with live market data  
✅ Connect wallet functionality (Pera Wallet)  
✅ Token price tracking and holder statistics  
✅ Creator dashboard (upload, analytics, earnings)  
✅ Responsive design for mobile and desktop  

---

## **🛠️ Tech Stack**

### **Frontend**

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + Hooks
- **Wallet**: [@perawallet/connect](https://github.com/perawallet/connect)
- **Icons**: Lucide React

### **Blockchain**

- **Network**: [Algorand](https://algorand.com)
- **Smart Contracts**: AlgoPy (Python 3.12)
- **SDKs**: [algosdk](https://github.com/algorand/js-algorand-sdk)
- **Storage**: IPFS (Pinata) for music files and metadata
- **DEX Integration**: [Tinyman](https://tinyman.org)

### **Backend**

- **Runtime**: Node.js 20+
- **Database**: Supabase (PostgreSQL)
- **API**: RESTful + Real-time subscriptions

### **DevOps**

- **Hosting**: [Vercel](https://vercel.com)
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics

---

## **🚀 Installation**

### **Prerequisites**

- Node.js 20+ and npm/yarn
- Python 3.12 (for smart contracts)
- Git
- Pera Wallet ([Download here](https://perawallet.app))
- Algorand TestNet account with test ALGO

### **Local Setup**

```bash
# Clone the repository
git clone https://github.com/VarunSuvarna/Auriya.git
cd Auriya

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Open browser at http://localhost:3000
```

### **Smart Contract Setup**

```bash
# Install Python 3.12 (NOT 3.13)
# Download from: https://www.python.org/downloads/release/python-3128/

# Install AlgoKit
pip install algokit

# Compile contracts
cd smart_contracts/projects/auriya-contracts
algokit compile python smart_contracts/

# Deploy to TestNet
algokit deploy
```

---

## **📊 How It Works**

### **Bonding Curve Mechanism**

Auriya uses an **Automated Market Maker (AMM)** bonding curve for price discovery:

```
Price = Virtual_ALGO_Reserve / Virtual_Token_Reserve
```

**Example Launch:**
- Initial Virtual Pool: 30 ALGO + 1,073,000,000 tokens
- Starting Price: ~0.000028 ALGO per token
- As fans buy → token supply decreases → price increases exponentially
- **Graduation Threshold**: 10,000 ALGO raised

**Post-Graduation:**
- Remaining tokens and raised ALGO migrate to Tinyman DEX
- Liquidity locked permanently (prevents rug pulls)
- Free market trading begins

### **Smart Contract Architecture**

```
┌─────────────────────────────────────────────────┐
│           MusicNFT (ARC-3 Compliant)            │
│  - Creates NFT for each song                    │
│  - IPFS metadata integration                    │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│      FungibleToken (ARC-20 Compliant)           │
│  - Tradeable music tokens                       │
│  - DEX compatible                               │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│           RoyaltySplitter Contract              │
│  - 70% Artist / 20% Producer / 10% Platform     │
│  - Automated distribution                       │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│         DAOGovernance Contract                  │
│  - Token-weighted voting                        │
│  - Community proposals                          │
└─────────────────────────────────────────────────┘
```

---

## **📈 Roadmap**

### **Phase 1: MVP (Current)** ✅
- [x] Frontend with discover page
- [x] Pera Wallet integration
- [x] Creator dashboard UI
- [x] Responsive design
- [x] Smart contracts (ARC-3, ARC-20)

### **Phase 2: Smart Contracts** 🔄
- [x] MusicNFT contract (ARC-3)
- [x] FungibleToken contract (ARC-20)
- [x] RoyaltySplitter contract
- [x] DAOGovernance contract
- [ ] TestNet deployment

### **Phase 3: Backend & Storage** 📅
- [ ] IPFS music file storage
- [ ] Metadata management API
- [ ] Real-time price oracle
- [ ] Analytics dashboard backend
- [ ] User profile system

### **Phase 4: Advanced Features** 🔮
- [ ] AI-powered music recommendations
- [ ] Social features (playlists, following)
- [ ] Mobile app (iOS/Android)
- [ ] DAO governance for platform decisions
- [ ] Cross-chain bridge

### **Phase 5: Mainnet Launch** 🚀
- [ ] Security audits
- [ ] Artist onboarding program
- [ ] Marketing campaign
- [ ] Mainnet deployment
- [ ] Tinyman DEX integration

---

## **🤝 Contributing**

We welcome contributions from the community!

### **Development Workflow**

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
git commit -m "feat: add bonding curve visualization"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request
```

---

## **👥 Team**

**Built with ❤️ by:**

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/VarunSuvarna">
        <img src="https://github.com/VarunSuvarna.png" width="100px;" alt="Varun Suvarna"/><br />
        <sub><b>Varun Suvarna</b></sub>
      </a><br />
      <sub>Full-Stack Developer</sub>
    </td>
  </tr>
</table>

### **Algorand Blockchain Club**

Auriya is proudly supported by the **Algorand Blockchain Club at JNTUH**, fostering innovation in decentralized technologies.

---

## **📄 License**

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## **🔗 Links**

- **Website**: [https://auriya.vercel.app](https://auriya.vercel.app)
- **GitHub**: [https://github.com/VarunSuvarna/Auriya](https://github.com/VarunSuvarna/Auriya)
- **Smart Contracts**: [View Contracts](./smart_contracts)

---

## **🌟 Acknowledgments**

- **Pump.fun** - Inspiration for bonding curve mechanics
- **Algorand Foundation** - Carbon-negative blockchain infrastructure
- **Pera Wallet** - Seamless wallet integration
- **Tinyman** - DEX partnership
- **shadcn/ui** - Beautiful UI components
- **Vercel** - Hosting and deployment

---

<div align="center">

**⭐ If you find Auriya interesting, please star this repository!**

**Built on Algorand • Powered by Music • Driven by Community**

![Algorand](https://img.shields.io/badge/Algorand-000000?style=flat&logo=algorand&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

</div>
