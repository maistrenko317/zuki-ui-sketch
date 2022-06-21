package com.zuki.admin.service;

import java.util.Collections;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Stack;
import java.util.stream.Collectors;
import com.zuki.ZukiLambdaException;
import com.zuki.Constants;
import com.zuki.ZukiException;
import com.zuki.dto.CashPoolTransaction2DTO;
import com.zuki.dto.ReferralInfoDTO;
import com.zuki.dto.Referral3TiersDTO;
import com.zuki.dto.ReferralReferredSubscriberDTO;
import com.zuki.dto.ReferralReportDTO;
import com.zuki.dto.ReferralSummaryDTO;
import com.zuki.dto.ReferralTransactionDTO;
import com.zuki.dto.ReferralTreeNodeDTO;
import com.zuki.dto.ReferrerProfileDTO;
import com.zuki.model.subscriber.Subscriber;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zuki.admin.dao.ContestDAO;
import com.zuki.admin.dao.IdentityDAO;
import com.zuki.admin.dao.ReferralDAO;

@Service
public class ReferralServiceImpl implements ReferralService{
    static Logger logger = Logger.getLogger(ReferralServiceImpl.class);

    @Autowired
    ReferralDAO referralDAO;
    
    @Autowired
    IdentityDAO identityDAO;

    @Autowired
    ContestDAO contestDAO;

    private List<ReferralTreeNodeDTO> getReferralTreeNodeDTOList(Long subscriberId) throws ZukiLambdaException {
        try {
            return identityDAO.getChildren(subscriberId)
                .stream()
                .map(subscriber -> new ReferralTreeNodeDTO(
                    subscriber.getSubscriberId(),
                    subscriber.getNickname(),
                    subscriber.getCreateDate()               
                ))
                .collect(Collectors.toList());   
        } catch(ZukiException e) {
            throw new ZukiLambdaException("getReferralTreeNodeDTOList", e);
        }
    }

    @Override
    public List<CashPoolTransaction2DTO> getCashPoolTransactionsForSubscriberForTypes(long subscriberId, List<String> transactionTypes) throws ZukiException {
        final StringBuilder builder = new StringBuilder();
        transactionTypes.forEach(type -> builder.append(type + ','));

        if(builder.length() > 0) {
            builder.deleteCharAt(builder.length()-1);
            return contestDAO.getCashPoolTransactionsForSubscriberForTypes(subscriberId, builder.toString());
        }
        
        return List.of();
    }

    private String joinStrings(List<String> list, char separator) {
        final StringBuilder builder = new StringBuilder();
        list.forEach(type -> builder.append(type + ','));
        if(builder.length() > 0) {
            builder.deleteCharAt(builder.length()-1);
        }
        return builder.toString();
    }
    
    @Override
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(long subscriberId, List<String> transactionTypes) throws ZukiException {
        return contestDAO.getReferralTransactionsForTypes(subscriberId, joinStrings(transactionTypes, ','));        
    }

    @Override
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(String nickName, List<String> transactionTypes) throws ZukiException{
        return contestDAO.getReferralTransactionsForTypes(nickName, joinStrings(transactionTypes, ','));

    }  

    private ReferralTreeNodeDTO rootReferralTreeNodeWithChildren(ReferralInfoDTO referralInfoDTO, ReferralTreeNodeDTO root, boolean fullTree) throws ZukiException {         
        Stack<ReferralTreeNodeDTO> stack = new Stack<>();
        double totalAmount = 0;
        int transactionsCount = 0;

        stack.push(root);
        referralInfoDTO.getAffiliateNicknames().add(root.getNickname());
        
        while(!stack.isEmpty()) {
            ReferralTreeNodeDTO top = stack.pop();
            List<ReferralTransactionDTO> transactions = getReferralTransactionsForTypes(top.getNickname(), List.of(CashPoolTransaction2DTO.TYPE.PAYOUT_REFERRAL.toString()));
            Date transactionDate = transactions.size() == 0 ? null : transactions.iterator().next().getDate();

            top.setChildren(getReferralTreeNodeDTOList(top.getSubscriberId()));
            top.setTransactionDate(transactionDate);
            top.setTransactions(transactions);


            referralInfoDTO.getReferralTransactions().addAll(top.getTransactions());            
            referralInfoDTO.getAffiliateNicknames().addAll(
                top.getChildren().stream().map(subscriber -> subscriber.getNickname()).collect(Collectors.toList())
            );
            referralInfoDTO.getReferredSubscribers().addAll(
                top.getChildren().stream().map(
                    subscriber -> new ReferralReferredSubscriberDTO(subscriber.getNickname(), transactionDate, top.getNickname())
                ).collect(Collectors.toList())
            );            

            totalAmount += transactions.stream().map(transaction -> transaction.getAmount()).reduce(0.0d, (a, b) -> a + b);
            transactionsCount += transactions.size();

            if(fullTree) {
                stack.addAll(top.getChildren());
            }

        }
        
        root.setTotalAmount(totalAmount);
        root.setTransactionsCount(transactionsCount);
        return root;
    }

    private ReferralTreeNodeDTO rootReferralTreeNode(ReferralInfoDTO referralInfoDTO, Subscriber rootSubscriber, boolean fullTree) {      
        try {  

            ReferralTreeNodeDTO root = new ReferralTreeNodeDTO(
                rootSubscriber.getSubscriberId(),
                rootSubscriber.getNickname(),
                null,
                List.of(),
                List.of()
            );
            
            return rootReferralTreeNodeWithChildren(referralInfoDTO, root, fullTree);
        }catch(ZukiException e) {
            throw new ZukiLambdaException("rootReferralTreeNode", e);
        }
    }

    private ReferralReportDTO referralReport(List<Subscriber> subscribers, boolean fullTree) throws ZukiException {
        ReferralInfoDTO referralInfoDTO = new ReferralInfoDTO(
            Collections.synchronizedList(new LinkedList<String>()),
            Collections.synchronizedList(new LinkedList<ReferralReferredSubscriberDTO>()),
            Collections.synchronizedList(new LinkedList<ReferralTransactionDTO>())
        );
        
        List<ReferralTreeNodeDTO> rootNodes = subscribers
            .parallelStream()
            .map(subscriber ->rootReferralTreeNode(referralInfoDTO, subscriber, fullTree))
            .collect(Collectors.toList());

        return new ReferralReportDTO(rootNodes, referralInfoDTO);
    }

    private ReferralReportDTO referralReport(List<Subscriber> subscribers) throws ZukiException {
       return referralReport(subscribers, true);
    }

    @Override
    public ReferralReportDTO referralReport(String role) throws ZukiException {
        return referralReport(referralDAO.getRootSubscribersWithRole(role));
    }

    private ReferralReportDTO emptyReferrarlReport() {
        return new ReferralReportDTO(
            List.of(),
            new ReferralInfoDTO(List.of(), List.of(), List.of())
        );
    }

    @Override
    public ReferralReportDTO referralReportBySessionKey(String sessionKey) throws ZukiException {
        Subscriber subscriber = identityDAO.getSubscriberBySessionKey(sessionKey);

        if(subscriber == null ) {
            return emptyReferrarlReport();
        }

        return referralReport(List.of(subscriber));
    }

    //TODO: SOme functions above this line can be deprecated.


    @Override
    public ReferralSummaryDTO referralSummary() throws ZukiException {
        List<ReferralTreeNodeDTO> affiliateTreeLevel0 = this.referralDAO.getAffiliateTreeLevel0();
        Number peopleReferred = contestDAO.getPeopleReferred();
        Number moneyEarnedByReferrals = contestDAO.getMoneyEarnedByReferrals();
        return new ReferralSummaryDTO(
            moneyEarnedByReferrals,
            peopleReferred,
            affiliateTreeLevel0,
            null,
            List.of()
        );
    }
   
  
    @Override
    public ReferralSummaryDTO referralSummary(long subscriberId) throws ZukiException {
        List<ReferralTreeNodeDTO> affiliateTreeLevelN = this.referralDAO.getAffiliateTreeLevelN(subscriberId);
        Subscriber subscriber = identityDAO.getSubscriberById(subscriberId);
        Subscriber parentSubscriber = identityDAO.getSubscriberById(subscriber.getMintParentSubscriberId());
        List<ReferralTransactionDTO> transactions = getReferralTransactionsForTypes(subscriber.getNickname(), List.of(CashPoolTransaction2DTO.TYPE.PAYOUT_REFERRAL.toString()));
        Number moneyEarned = affiliateTreeLevelN.stream().map(item -> item.getTotalAmount()).reduce(0.0, (a, b) -> a + b);
        
        return new ReferralSummaryDTO(
            moneyEarned,
            affiliateTreeLevelN.size(),
            affiliateTreeLevelN,
            subscriber.getNickname(),
            transactions,
            parentSubscriber == null ? null : parentSubscriber.getNickname()
        );        
    }    

    
    public List<Referral3TiersDTO> getAffiliate3TiersTable(long  subscriberId) throws ZukiException {
        return referralDAO.getAffiliate3TiersTable(subscriberId);
    }

    @Override
    public List<Referral3TiersDTO> getAffiliate3TiersTable(String  nickname) throws ZukiException {
        Subscriber subscriber;

        try {            
            subscriber = identityDAO.getSubscriberById(Long.parseLong(nickname));
        }catch(NumberFormatException e) {
            subscriber = identityDAO.getSubscriberByNickname(nickname);
        }

        
        return subscriber == null ? List.of() : getAffiliate3TiersTable(subscriber.getSubscriberId());
    }

    private ReferrerProfileDTO getReferrerProfile(Subscriber subscriber) throws ZukiException {
        if(subscriber == null) {
            return null;
        }

        ReferrerProfileDTO referrerProfile = referralDAO.getReferrerProfile(subscriber.getSubscriberId());

        referrerProfile.setNickname(subscriber.getNickname());
        referrerProfile.setPhotoUrl(subscriber.getPhotoUrl());;
        return referrerProfile;
    }    

    @Override
    public ReferrerProfileDTO getReferrerProfile(long  subscriberId) throws ZukiException {
        Subscriber subscriber = identityDAO.getSubscriberById(subscriberId);
        if(subscriber == null) {
            return null;
        }

        return getReferrerProfile(subscriber);
    }

    @Override
    public ReferrerProfileDTO getReferrerProfile(String  nickname) throws ZukiException {
        long subscriberId;

        try {            
            subscriberId = Long.parseLong(nickname);
            return getReferrerProfile(subscriberId);
        }catch(NumberFormatException e) {
            return getReferrerProfile(identityDAO.getSubscriberByNickname(nickname));
        }
        
        
    }

    @Override
    public List<Referral3TiersDTO> getAffiliateMonthlyEarnings(String  nickname) throws ZukiException {
        Subscriber subscriber;

        try {            
            subscriber = identityDAO.getSubscriberById(Long.parseLong(nickname));
        }catch(NumberFormatException e) {
            subscriber = identityDAO.getSubscriberByNickname(nickname);
        }        
        
        return referralDAO.getAffiliateMonthlyEarnings(subscriber == null ? -1L : subscriber.getSubscriberId());
    }

    @Override
    public List<Referral3TiersDTO> getAffiliateYearlyEarnings(String  nickname) throws ZukiException {
        Subscriber subscriber;

        try {            
            subscriber = identityDAO.getSubscriberById(Long.parseLong(nickname));
        }catch(NumberFormatException e) {
            subscriber = identityDAO.getSubscriberByNickname(nickname);
        }        
        
        return referralDAO.getAffiliateYearlyEarnings(subscriber == null ? -1L : subscriber.getSubscriberId());
    }    
}

