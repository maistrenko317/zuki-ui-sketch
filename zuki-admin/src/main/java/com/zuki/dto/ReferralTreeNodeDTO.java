package com.zuki.dto;

import java.util.Date;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ReferralTreeNodeDTO {
    private Long subscriberId;
    private String nickname;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private Date transactionDate;
    private List<ReferralTreeNodeDTO> children;
    private List<ReferralTransactionDTO> transactions;
    private Date createDate;
    private double totalAmount;
    private int transactionsCount;
    private long referredPeople;
    
    public ReferralTreeNodeDTO() {
        
    }
    public ReferralTreeNodeDTO(Long subscriberId, String nickname, Date transactionDate, List<ReferralTreeNodeDTO> children, List<ReferralTransactionDTO> transactions, long referredPeople, double totalAmount) {
        this.subscriberId = subscriberId;
        this.nickname = nickname;
        this.transactionDate = transactionDate;
        this.children = children;
        this.transactions = transactions;
        this.referredPeople = referredPeople;
        this.totalAmount = totalAmount;
    }

    public ReferralTreeNodeDTO(Long subscriberId, String nickname, Date transactionDate, List<ReferralTreeNodeDTO> children, List<ReferralTransactionDTO> transactions) {
        this(subscriberId, nickname, transactionDate, children, transactions, 0, 0);
    }   

    public ReferralTreeNodeDTO(Long subscriberId, String nickname, Date createDate) {
        this.subscriberId = subscriberId;
        this.nickname = nickname;
        this.createDate = createDate;
    }

    public Long getSubscriberId() {
        return subscriberId;
    }
    
    public String getNickname() {
        return nickname;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public List<ReferralTreeNodeDTO> getChildren() {
        return children;
    }

    public List<ReferralTransactionDTO> getTransactions() {
        return transactions;
    }

    public Date getCreateDate() {
        return createDate;
    }
    
    public void setSubscriberId(Long subscriberId) {
        this.subscriberId = subscriberId;
    }
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }
    public void setChildren(List<ReferralTreeNodeDTO> children) {
        this.children = children;
    }
    public void setTransactions(List<ReferralTransactionDTO> transactions) {
        this.transactions = transactions;
    }
    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
    public double getTotalAmount() {
        return totalAmount;
    }
    public long getReferredPeople() {
        return referredPeople;
    }
    public void setReferredPeople(long referredPeople) {
        this.referredPeople = referredPeople;
    }
    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public int getTransactionsCount() {
        return transactionsCount;
    }

    public void setTransactionsCount(int transactionsCount) {
        this.transactionsCount = transactionsCount;
    }

}
