package com.zuki.admin.dao;

import java.util.List;

import com.zuki.ZukiException;
import com.zuki.dto.Referral3TiersDTO;
import com.zuki.dto.ReferralTreeNodeDTO;
import com.zuki.dto.ReferrerProfileDTO;
import com.zuki.model.subscriber.Subscriber;

public interface ReferralDAO {
    public List<Long> getSubscriberIdsWithRole(String role) throws ZukiException;
    public List<Subscriber> getRootSubscribers() throws ZukiException;
    public List<Subscriber> getSubscribersWithRole(String role) throws ZukiException;
    public List<Subscriber> getRootSubscribersWithRole(String role) throws ZukiException;
    /*TODO: Check which functions above these lines can be deprecated. */
    public List<ReferralTreeNodeDTO> getAffiliateTreeLevel0() throws ZukiException;
    public List<ReferralTreeNodeDTO> getAffiliateTreeLevelN(long subscriberId) throws ZukiException;
    public List<Referral3TiersDTO> getAffiliate3TiersTable(long  subscriberId) throws ZukiException;
    public ReferrerProfileDTO getReferrerProfile(long subscriberId) throws ZukiException;
    public List<Referral3TiersDTO> getAffiliateMonthlyEarnings(long  subscriberId) throws ZukiException;
    public List<Referral3TiersDTO> getAffiliateYearlyEarnings(long  subscriberId) throws ZukiException;
}