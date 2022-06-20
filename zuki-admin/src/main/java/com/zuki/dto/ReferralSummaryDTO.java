package com.zuki.dto;

import java.util.Date;
import java.util.List;

public class ReferralSummaryDTO {
    Date transactionDate;
    String nickname;
    String parentNickName;
    List<ReferralTreeNodeDTO> referralTreeNodes;
    List<ReferralTransactionDTO> transactions;
    Number moneyEarned;
    Number peopleReferred;

    public ReferralSummaryDTO() {

    }
    
    public ReferralSummaryDTO(Number moneyEarned, Number peopleReferred,  List<ReferralTreeNodeDTO> referralTreeNode, String nickname, List<ReferralTransactionDTO> transactions) {
        this.moneyEarned = moneyEarned;
        this.peopleReferred = peopleReferred; 
        this.referralTreeNodes = referralTreeNode;                
        this.transactions = transactions;
        this.nickname = nickname;
    }

    public ReferralSummaryDTO(Number moneyEarned, Number peopleReferred,  List<ReferralTreeNodeDTO> referralTreeNode, String nickname, List<ReferralTransactionDTO> transactions, String parentNickName) {        
        this.referralTreeNodes = referralTreeNode;        
        this.transactions = transactions;
        this.parentNickName = parentNickName;
        this.nickname = nickname;
        this.moneyEarned = moneyEarned;
    }


    public void setMoneyEarned(Number moneyEarned) {
        this.moneyEarned = moneyEarned;
    }

    public List<ReferralTreeNodeDTO> getReferralTreeNodes() {
        return referralTreeNodes;
    }

    public void setReferralTreeNodes(List<ReferralTreeNodeDTO> referralTreeNodes) {
        this.referralTreeNodes = referralTreeNodes;
    }
    public List<ReferralTransactionDTO> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<ReferralTransactionDTO> transactions) {
        this.transactions = transactions;
    }

    public String getParentNickName() {
        return parentNickName;
    }

    public void setParentNickName(String parentNickName) {
        this.parentNickName = parentNickName;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Number getMoneyEarned() {
        return moneyEarned;
    }

    public Number getPeopleReferred() {
        return peopleReferred;
    }

    public void setPeopleReferred(Number peopleReferred) {
        this.peopleReferred = peopleReferred;
    }

}
