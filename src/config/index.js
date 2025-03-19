// 网络配置
export const CHAINS = {
  1: {
    chainId: 1,
    name: 'NULS',
    symbol: 'NULS',
    decimals: 8,
    rpc: 'https://api.nuls.io', 
    publicUrl:'https://public1.nuls.io',
    explorer: 'https://nulscan.io',
    nrc721Address: {
      "tdc":'NULSd6HgpS6L5MnYRKeHrwmouiYZLz12AiXp9'
    },
    tdcTokenAddress:"tNULSeBaN2QVohyKMFt24EgKzrwgww3xgbU97z",
    toolContractAddress:'NULSd6Hgrnv1oxcdyhzZmsu7HWgk7vcaR6nMR',
    contracts: {
      domainAddress:'NULSd6HgsFcPKAwaKWaiTTbWDeL27x8JT48HZ',
      stakeAddress:'NULSd6HgupzoG3LDDyK28KYdEcQ6vPn79etKM',
    }
  },
  2: {
    chainId: 2,
    name: 'NULS Testnet',
    symbol: 'NULS',
    decimals: 8,
    rpc: 'https://beta.api.nuls.io',
    publicUrl:'https://beta.public1.nuls.io',
    explorer: 'https://beta.nulscan.io',
    nrc721Address: {
      "tdc":'tNULSeBaN1Lfpg3E1irfDnH2texy34jP2Bd5aN',
    },
    tdcTokenAddress:"tNULSeBaN2QVohyKMFt24EgKzrwgww3xgbU97z",
    toolContractAddress:'tNULSeBaMwP81fGuNPRRSpKxLto1o1hQPnUTJQ',
    contracts: {
      domainAddress:'tNULSeBaN14x5z4hZR1LUGE4Dbx7jD8BveYEDX',
      stakeAddress:'tNULSeBaN4JirAVjgrvZmDmDLqgkrfaA3CgGxu',
    }
  }
}
// 当前环境配置
export const CURRENT_NETWORK = import.meta.env.VITE_APP_ENV === 'mainnet' 
  ? CHAINS[1]
  : CHAINS[2]
// 链ID 
export const CHAIN_ID = import.meta.env.VITE_APP_CHAIN_ID*1 
//币安API URL
export const BINANCE_URL ="https://api.binance.com"
//API URL 
export const API_URL = import.meta.env.VITE_APP_API_URL 
export const PUBLIC_URL = import.meta.env.VITE_APP_PUBLIC_URL
export const RPC_URL = import.meta.env.VITE_APP_RPC_URL
export const SUFFIX = ['tdc','nuls'] //域名后缀 .nuls .tdc 
//https://app.pinata.cloud/ 配置
export const IPFS_CONFIG = {
  apiKey: "60dd3f8d985638706a26",
  apiSecret: "e6bef01c83276448ad5bbea9b144b6d6835d074e1baab40f6b3eb66c5076335f",
  gateway:"maroon-necessary-wallaby-5.mypinata.cloud",
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiZTc5MzM4ZC1hYTJkLTRkYWYtYWIzZi0zMDBmYjg0NDlhMjUiLCJlbWFpbCI6Inp6ODc3MjAwNzcyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2MGRkM2Y4ZDk4NTYzODcwNmEyNiIsInNjb3BlZEtleVNlY3JldCI6ImU2YmVmMDFjODMyNzY0NDhhZDViYmVhOWIxNDRiNmQ2ODM1ZDA3NGUxYmFhYjQwZjZiM2ViNjZjNTA3NjMzNWYiLCJleHAiOjE3NjM5MDU1Mzl9.EwE2ATj18-USExEZ5Jb9cLAPSOo1yyh1xez1DcNJFAs"
}



//NABOX下载链接
export const NABOX_DOWNLOAD_URL ="https://nabox.io"
export const TW_URL ="https://x.com/TDC_Chain"
export const TG_URL ="https://t.me/TridentChain_EN"
export const DC_URL ="https://discord.com/invite/KcKMrG36ws"
export const GITHUB_URL ="https://github.com/TridentChain/TridentChain"
//默认头像
export const DEFAULT_AVATAR = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULS.png'


