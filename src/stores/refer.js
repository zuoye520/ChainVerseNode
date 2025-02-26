import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import copy from 'copy-to-clipboard';
import * as api from '../services/api'
import {fromAmount} from '../utils/format'
export const useReferStore = defineStore('refer', () => {

  const origin = ref(window.location.origin);
  const referralLink = ref(``)

  const stats = ref({
    totalReferrals: 0,
    totalEarnings: '0',
    inviteRewardPending:'0',
    inviteCode:''
  })
  const referralHistoryTotal = ref(0)
  // Mock
  const referralHistory = ref([
    {
      user: 'NULSd6Hg...Bq97',
      date: '2024.01.26 10:44:07',
      reward: '0.00606',
      withdrawState:'Unwithdrawn' // Unwithdrawn / Pending/ Complete
    },
    {
      user: 'NULSd6Hg...Xy42',
      date: '2024.01.25 14:55:14',
      reward: '0.00369',
      withdrawState:'Unwithdrawn'
    }
  ])
  //申请提现
  async function withdraw(address) {
    const result = await api.userWithdrawal({address});
    return result;
  } 
  //注册
  async function register(params) {
    const result = await api.register(params);
    return result;
  } 
  //获取人数和数量
  async function getReferInfo(params) {
    const result = await api.userInfo(params);
    stats.value = {
      totalReferrals:result.inviteCount,
      totalEarnings:result.inviteReward && fromAmount(result.inviteReward),
      inviteRewardPending:result.inviteRewardPending && fromAmount(result.inviteRewardPending),
      inviteCode:result.inviteCode
    };
    referralLink.value = `${origin.value}?inviteCode=${result.address}`
    return result;

  }
  //奖励列表
  async function getHistoryRefers(params) {
    const result = await api.historyRefers(params);
    const list = result.list.map((item)=>{
      item.user = item.inviteeAddress
      item.reward = fromAmount(item.amount)
      item.date = item.createdDate
      item.withdrawState = item.withdrawState
      return item
    })

    referralHistoryTotal.value = result.totalCount

    referralHistory.value = list;

  }


  //copy 邀请链接
  function copyReferralLink(){
    return copy(referralLink.value)
  }
  function copyAddress(address){
    return copy(address)
  }
  return {
    referralLink,
    stats,
    referralHistory,
    copyReferralLink,
    copyAddress,
    referralHistoryTotal,
    getHistoryRefers,
    register,
    getReferInfo,
    withdraw
  }
})