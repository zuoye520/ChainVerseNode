
import { sendRequest } from '../utils/httpUtils'
import { PinataSDK } from "pinata-web3";

import { API_URL,RPC_URL,PUBLIC_URL,BINANCE_URL,IPFS_CONFIG } from '../config'
const pinata = new PinataSDK({
  pinataJwt: IPFS_CONFIG.jwt,
  pinataGateway: IPFS_CONFIG.gateway,
});
/**
 * 币安获取币种平均价格
 * @param {*} symbol 
 * @returns 
 */
export const nulsUsd = async (symbol= 'NULSUSDT')=>{
  try {
    // 构建 API 请求 URL
    const url = `${BINANCE_URL}/api/v3/avgPrice?symbol=${symbol}`;
    // 发送 GET 请求获取热门列表
    const response = await sendRequest(url, { method: 'get' });
    
    if(!response.price) throw response
    ////console.log('nulsUsd:',response.price)
    return response.price;
  } catch (error) {
    // 捕获并记录任何发生的错误
    console.error('nulsUsd:', error);
    return 0;
  }
}
/**
 * 上传json到ipfs
 * @param {*} data 
 * @returns 
 */
export const uploadJson = async (data)=>{
  const upload = await pinata.upload.json(data)
  return upload;
}

/**
 * 上传文件到ipfs
 * @param {*} file 
 * @returns 
 */
export const uploadFile = async (file)=>{
  const upload = await pinata.upload.file(file)
  return upload;
}
/**
 * 上传文件到ipfs
 * @param {*} file 
 * @returns 
 */
export const getFile = async (hash)=>{
  const data = await pinata.gateways.get(hash);
  return data 
}



/**
 * NFT API -- 注册
 * @param {*} params 
 * @returns 
 */
export const register = async (params= {})=>{
  const  data = params;
  const url = `${API_URL}/naiai/register`;
  const response = await sendRequest(url, { data, method: 'post' });
  //console.log('register result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- 用户信息
 * @returns 
 */
export const userInfo = async (params = {})=>{
 const data = params
  const url = `${API_URL}/naiai/user/info`;
  const response = await sendRequest(url, {
    data, 
    method: 'post'
  });
  //console.log('userInfo result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}
/**
 * NFT API -- 邀请奖励记录
 * @param {*} params 
 * @returns 
 */
export const historyRefers = async (params= {})=>{
  const  data = {
    address:params.address,
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 10,
  }
  const url = `${API_URL}/naiai/user/refer`;
  const response = await sendRequest(url, { data, method: 'post' });
  //console.log('historyRefers result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}


/**
 * NFT API -- 用户申请提现
 * @param {*} params 
 * @returns 
 */
export const userWithdrawal = async (params= {})=>{
  const  data = {
    address:params.address
  }
  const url = `${API_URL}/naiai/user/withdrawal/apply`;
  const response = await sendRequest(url, { data, method: 'post' });
  //console.log('userWithdrawal result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * pc共用查询接口
 * @param {*} params 
 * @returns 
 */
export const pcInvokeView = async (method,params= {})=>{
  const  data = {
    "jsonrpc":"2.0",
    "method":method,
    "params":params,
    "id":1234
    }
  const url = PUBLIC_URL;
  const response = await sendRequest(url, { data, method: 'post' });
  //console.log('invokeView result:',{data,response})
  if(!response || !response.result) throw response
  return response.result;
}

/**
 * rpc共用查询接口
 * @param {*} params 
 * @returns 
 */
export const rpcInvokeView = async (method,params= {})=>{
  const  data = {
    "jsonrpc":"2.0",
    "method":method,
    "params":params,
    "id":1234
    }
  const url = `${RPC_URL}/jsonrpc`;
  const response = await sendRequest(url, { data, method: 'post' });
  //console.log('invokeView result:',{data,response})
  if(!response || !response.result) throw response
  return response.result;
}