
import { sendRequest } from '../utils/httpUtils'

import { BINANCE_URL } from '../config'
export const nulsUsd = async ()=>{
  try {
    // 构建 API 请求 URL
    const url = `${BINANCE_URL}/api/v3/avgPrice?symbol=NULSUSDT`;
    // 发送 GET 请求获取热门列表
    const response = await sendRequest(url, { method: 'get' });
    if(!response.price) throw response
    return response.price;
  } catch (error) {
    // 捕获并记录任何发生的错误
    console.error('nulsUsd:', error);
    return 0;
  }
}
