# ChainVerse - AI Node Protocol

ChainVerse is a revolutionary AI node protocol built on the NULS blockchain that combines AI capabilities with decentralized node management, offering users a unique way to participate in the AI network while earning passive income.

## Features

### AI Node Network
- Register and manage your unique `.nuls` AI nodes
- Set primary node for your account
- Transfer nodes to other users
- Permanent ownership with no renewal fees

### Passive Income Generation
- Earn NULS rewards by operating AI nodes
- Activate/deactivate reward mechanisms
- Track total and unclaimed rewards
- Claim rewards anytime

### Profile Management
- Customize your node operator profile
- Upload avatar images
- Add social media links
- Share personal websites
- Set location and description

### AI Integration (Coming Soon)
- Train your AI nodes
- Enhance AI knowledge base
- Monetize AI capabilities
- Collaborate through AI nodes

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

The project supports different environments:

```bash
# Mainnet
VITE_APP_TITLE=ChainVerse
VITE_APP_ENV=mainnet
VITE_APP_API_URL=https://api.chainverse.io
VITE_APP_CHAIN_ID=1
VITE_APP_EXPLORER_URL=https://nulscan.io

# Testnet
VITE_APP_TITLE=ChainVerse - Testnet
VITE_APP_ENV=testnet
VITE_APP_API_URL=https://beta.api.chainverse.io
VITE_APP_CHAIN_ID=2
VITE_APP_EXPLORER_URL=https://beta.nulscan.io
```

## Usage Examples

### Connect Wallet
```javascript
// Using the wallet service
import { walletService } from '../services/wallet'

// Connect to NABOX wallet
await walletService.connect()
```

### Register Node
```javascript
// Register a new AI node
const domain = 'mynode.nuls'
await walletStore.contractCall({
  contractAddress: currentChainConfig.contracts.domainAddress,
  methodName: "mint",
  args: [domain]
})
```

### Manage Rewards
```javascript
// Claim available rewards
await walletStore.contractCall({
  contractAddress: currentChainConfig.contracts.domainAddress,
  methodName: "receiveAward"
})
```

## Technology Stack

- Vue 3 + Vite
- Pinia for State Management
- Vue Router
- Heroicons
- NABOX Wallet Integration
- IPFS via Pinata

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Community

- [Twitter](https://x.com/Nuls)
- [Telegram](http://t.me/Nulsio)
- [Discord](http://discord.com/invite/aRCwbj47WN)
- [Documentation](https://docs.nuls.io)

## License

This project is licensed under the MIT License.