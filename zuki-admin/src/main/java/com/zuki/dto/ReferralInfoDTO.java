package com.zuki.dto;



import java.io.Serializable;
import java.util.List;

public class ReferralInfoDTO  implements Serializable{
    List<String> affiliateNicknames;
    List<ReferralReferredSubscriberDTO> referredSubscribers;
    List<ReferralTransactionDTO> referralTransactions;
    
    public ReferralInfoDTO() {

    }

    public ReferralInfoDTO(List<String> affiliateNicknames, List<ReferralReferredSubscriberDTO> referredSubscribers, List<ReferralTransactionDTO> referralTransactions) {
        this.affiliateNicknames = affiliateNicknames;
        this.referredSubscribers = referredSubscribers;
        this.referralTransactions = referralTransactions ;
    }

    public List<String> getAffiliateNicknames() {
        return affiliateNicknames;
    }

    public List<ReferralReferredSubscriberDTO> getReferredSubscribers() {
        return referredSubscribers;
    }

    public List<ReferralTransactionDTO> getReferralTransactions() {
        return referralTransactions;
    }

    public void setAffiliateNicknames(List<String> affiliateNicknames) {
        this.affiliateNicknames = affiliateNicknames;
    }

    public void setReferredSubscribers(List<ReferralReferredSubscriberDTO> referredSubscribers) {
        this.referredSubscribers = referredSubscribers;
    }

    public void setReferralTransactions(List<ReferralTransactionDTO> referralTransactions) {
        this.referralTransactions = referralTransactions;
    }

    
    
}
