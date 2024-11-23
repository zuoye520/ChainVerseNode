// 网络配置
export const CHAINS = {
  1: {
    chainId: 1,
    name: 'NULS',
    symbol: 'NULS',
    decimals: 8,
    rpc: 'https://testnet.api.nuls.io', 
    explorer: 'https://testnet.nulscan.io',
    contracts: {
      domainAddress:'tNULSeBaMvEtDfvZuukDf2mVyfGo3DdiN8KLRG',
      nrc721Address: 'tNULSeBaN2inyAkyfk7AW5uAUf6cQr4BGSZCCt',
      stakeAddress:'tNULSeBaMx7ZoVNUyf6HHCySkmumRFsajahL2P'
    }
  },
  2: {
    chainId: 2,
    name: 'NULS Testnet',
    symbol: 'NULS',
    decimals: 8,
    rpc: 'https://testnet.api.nuls.io', 
    explorer: 'https://testnet.nulscan.io',
    contracts: {
      domainAddress:'tNULSeBaN9B1GTocxwZhUpBjqdsrTeJNkksVZC',
      nrc721Address: 'tNULSeBaN2inyAkyfk7AW5uAUf6cQr4BGSZCCt',
      stakeAddress:'tNULSeBaMx7ZoVNUyf6HHCySkmumRFsajahL2P'
    }
  }
}
//https://app.pinata.cloud/ 配置
export const IPFS_CONFIG = {
  apiKey: "60dd3f8d985638706a26",
  apiSecret: "e6bef01c83276448ad5bbea9b144b6d6835d074e1baab40f6b3eb66c5076335f",
  gateway:"maroon-necessary-wallaby-5.mypinata.cloud",
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiZTc5MzM4ZC1hYTJkLTRkYWYtYWIzZi0zMDBmYjg0NDlhMjUiLCJlbWFpbCI6Inp6ODc3MjAwNzcyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2MGRkM2Y4ZDk4NTYzODcwNmEyNiIsInNjb3BlZEtleVNlY3JldCI6ImU2YmVmMDFjODMyNzY0NDhhZDViYmVhOWIxNDRiNmQ2ODM1ZDA3NGUxYmFhYjQwZjZiM2ViNjZjNTA3NjMzNWYiLCJleHAiOjE3NjM5MDU1Mzl9.EwE2ATj18-USExEZ5Jb9cLAPSOo1yyh1xez1DcNJFAs"
}

// 当前环境配置
// export const CURRENT_NETWORK = import.meta.env.VITE_APP_ENV === 'mainnet' 
//   ? NETWORKS.MAINNET 
//   : NETWORKS.TESTNET

// API 配置
export const API = {
  MAINNET: 'https://api.nuls.ai',
  TESTNET: 'https://testnet-api.nuls.ai',
  TIMEOUT: 10000, // 请求超时时间(ms)
  ENDPOINTS: {
    // 身份相关接口
    IDENTITY: {
      REGISTER: '/identity/register',
      CHECK: '/identity/check',
      LIST: '/identity/list',
      DETAIL: '/identity/detail',
      TRANSFER: '/identity/transfer'
    },
    // 奖励相关接口
    REWARDS: {
      CLAIM: '/rewards/claim',
      HISTORY: '/rewards/history',
      STATS: '/rewards/stats'
    },
    // 用户相关接口
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update'
    }
  }
}

// 通用配置
export const CONFIG = {
  // 身份配置
  IDENTITY: {
    MIN_LENGTH: 3,  // 最小长度
    MAX_LENGTH: 32, // 最大长度
    SUFFIX: '.nuls', // 后缀
    PRICE: {
      DEFAULT: 100, // 默认价格(NULS)
      PREMIUM: 1000, // 优质身份价格
      SPECIAL: 10000 // 特殊身份价格
    },
    REWARDS: {
      RATE: 0.1,  // 奖励比例(10%)
      PERIOD: 30 * 24 * 60 * 60, // 奖励周期(30天)
      MIN_AMOUNT: 100 // 最小领取数量
    },
    STATUS: {
      AVAILABLE: 0, // 可注册
      REGISTERED: 1, // 已注册
      RESERVED: 2, // 保留
      EXPIRED: 3 // 已过期
    }
  },

  // 交易配置  
  TRANSACTION: {
    GAS_LIMIT: 200000,
    GAS_PRICE: 1000000000,
    CONFIRMATIONS: 6, // 确认数
    TIMEOUT: 5 * 60 * 1000 // 超时时间(5分钟)
  },

  // UI配置
  UI: {
    THEME: {
      PRIMARY: '#00e486',
      SECONDARY: '#00cc76',
      BACKGROUND: '#0a0b0e',
      TEXT: 'rgba(255, 255, 255, 0.7)'
    },
    ANIMATION: {
      DURATION: 300, // 动画持续时间(ms)
    },
    TOAST: {
      DURATION: 3000, // 提示显示时间
      POSITION: 'bottom-center'
    }
  },

  // 缓存配置
  STORAGE: {
    PREFIX: 'nuls_ai_',
    VERSION: '1.0.0',
    TTL: 24 * 60 * 60 * 1000, // 缓存时间(24h)
    KEYS: {
      USER_PROFILE: 'user_profile',
      WALLET_INFO: 'wallet_info',
      LANGUAGE: 'language',
      THEME: 'theme'
    }
  }
}

// 错误码
export const ERROR_CODES = {
  // 钱包相关错误 1xxx
  WALLET_NOT_INSTALLED: 1001,
  WALLET_NOT_CONNECTED: 1002,
  WALLET_REJECTED: 1003,
  WRONG_NETWORK: 1004,
  
  // 网络相关错误 2xxx
  NETWORK_ERROR: 2001,
  REQUEST_TIMEOUT: 2002,
  API_ERROR: 2003,
  
  // 合约相关错误 3xxx
  CONTRACT_ERROR: 3001,
  EXECUTION_FAILED: 3002,
  INSUFFICIENT_FUNDS: 3003,
  
  // 参数相关错误 4xxx
  INVALID_PARAMS: 4001,
  INVALID_ADDRESS: 4002,
  INVALID_AMOUNT: 4003,
  
  // 业务相关错误 5xxx
  IDENTITY_REGISTERED: 5001,
  IDENTITY_NOT_FOUND: 5002,
  IDENTITY_EXPIRED: 5003,
  NO_REWARDS: 5004
}

// 常量
export const CONSTANTS = {
  // 支持的语言
  LANGUAGES: {
    EN: 'en',
    ZH: 'zh',
    KO: 'ko',
    JA: 'ja'
  },

  // 身份类型
  IDENTITY_TYPES: {
    NORMAL: 0, // 普通
    PREMIUM: 1, // 优质
    SPECIAL: 2 // 特殊
  },

  // 交易类型
  TX_TYPES: {
    REGISTER: 'register',
    TRANSFER: 'transfer',
    CLAIM: 'claim'
  },

  // 交易状态
  TX_STATUS: {
    PENDING: 'pending',
    CONFIRMING: 'confirming',
    SUCCESS: 'success', 
    FAILED: 'failed'
  },

  // 事件名称
  EVENTS: {
    WALLET: {
      CONNECTED: 'wallet_connected',
      DISCONNECTED: 'wallet_disconnected',
      CHAIN_CHANGED: 'chain_changed',
      ACCOUNT_CHANGED: 'account_changed'
    },
    IDENTITY: {
      REGISTERED: 'identity_registered',
      TRANSFERRED: 'identity_transferred',
      EXPIRED: 'identity_expired'
    },
    REWARDS: {
      CLAIMED: 'rewards_claimed',
      DISTRIBUTED: 'rewards_distributed'
    }
  }
}