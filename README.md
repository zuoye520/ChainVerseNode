# NULS AI - Digital Identity Protocol

NULS AI is a revolutionary digital identity protocol built on the NULS blockchain that combines AI capabilities with digital identity management, offering users a unique way to establish their digital presence while earning passive income.

## Features

### Digital Identity Management
- Register and manage your unique `.nuls` digital identity
- Set primary identity for your account
- Transfer identities to other users
- Permanent ownership with no renewal fees

### Passive Income Generation
- Earn NULS rewards by holding digital identities
- Activate/deactivate reward mechanisms
- Track total and unclaimed rewards
- Claim rewards anytime

### Profile Management
- Customize your digital identity profile
- Upload avatar images
- Add social media links
- Share personal websites
- Set location and description

### AI Integration (Coming Soon)
- Train your digital identity AI
- Enhance AI knowledge base
- Monetize AI capabilities
- Collaborate through AI identities

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
VITE_APP_TITLE=NULS AI
VITE_APP_ENV=mainnet
VITE_APP_API_URL=https://api.nuls.ai
VITE_APP_CHAIN_ID=1
VITE_APP_EXPLORER_URL=https://nulscan.io

# Testnet
VITE_APP_TITLE=NULS AI - Testnet
VITE_APP_ENV=testnet
VITE_APP_API_URL=https://beta.api.nuls.ai
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

### Register Identity
```javascript
// Register a new digital identity
const domain = 'mydomain.nuls'
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