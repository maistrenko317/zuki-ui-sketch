package com.zuki.admin.service;


import java.util.List;

import com.zuki.ZukiException;
import com.zuki.dto.CashPoolTransaction2DTO;
import com.zuki.dto.ReferralReportDTO;
import com.zuki.dto.ReferralSummaryDTO;
import com.zuki.dto.ReferralTransactionDTO;
import com.zuki.dto.ReferrerProfileDTO;
import com.zuki.dto.Referral3TiersDTO;

public interface ReferralService {
    public ReferralReportDTO referralReport(String role) throws ZukiException;
    public ReferralReportDTO referralReportBySessionKey(String sessionKey) throws ZukiException;    
    public List<CashPoolTransaction2DTO> getCashPoolTransactionsForSubscriberForTypes(long subscriberId, List<String> transactionTypes) throws ZukiException;
    
    /*TODO: Check if some functions above this line can be deprecated. */
    public ReferralSummaryDTO referralSummary(long subscriberId) throws ZukiException;
    public ReferralSummaryDTO referralSummary() throws ZukiException;
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(long subscriberId, List<String> transactionTypes) throws ZukiException;
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(String nickName, List<String> transactionTypes) throws ZukiException;
    public ReferrerProfileDTO getReferrerProfile(long subscriberId) throws ZukiException;
    public ReferrerProfileDTO getReferrerProfile(String  nickname) throws ZukiException;
    public List<Referral3TiersDTO> getAffiliate3TiersTable(long  subscriberId) throws ZukiException;
    public List<Referral3TiersDTO> getAffiliate3TiersTable(String  nickname) throws ZukiException ;
    public List<Referral3TiersDTO> getAffiliateMonthlyEarnings(String  nickname) throws ZukiException;
    public List<Referral3TiersDTO> getAffiliateYearlyEarnings(String  nickname) throws ZukiException;
    

}
