package com.zuki.admin.service;

import java.util.List;

import com.zuki.ZukiException;
import com.zuki.dto.CashPoolTransaction2DTO;
import com.zuki.dto.ReferralTransactionDTO;

public interface ShoutContestService {
    public List<CashPoolTransaction2DTO> getCashPoolTransactionsForSubscriberForTypes(long subscriberId, List<String> transactionTypes) throws ZukiException;
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(long subscriberId, List<String> transactionTypes) throws ZukiException;
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(String nickName, List<String> transactionTypes) throws ZukiException;
}
