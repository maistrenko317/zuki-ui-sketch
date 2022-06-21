package com.zuki.admin.dao;

import java.util.List;

import com.zuki.ZukiException;
import com.zuki.dto.CashPoolTransaction2DTO;
import com.zuki.dto.ReferralTransactionDTO;

public interface ContestDAO {
    public List<CashPoolTransaction2DTO> getCashPoolTransactionsForSubscriberForTypes(long subscriberId, String transactionTypeAsCommaDelimitedList) throws ZukiException;
    List<ReferralTransactionDTO> getReferralTransactionsForTypes(long subscriberId, String transactionTypeAsCommaDelimitedList) throws ZukiException;
    List<ReferralTransactionDTO> getReferralTransactionsForTypes(String nickname, String transactionTypeAsCommaDelimitedList) throws ZukiException;
    Number getMoneyEarnedByReferrals() throws ZukiException;
    Number getPeopleReferred() throws ZukiException;
}
