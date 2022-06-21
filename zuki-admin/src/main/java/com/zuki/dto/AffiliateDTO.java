package com.zuki.dto;

public class AffiliateDTO {
    protected Number moneyEarned;
    protected Number peopleReferred;

    public AffiliateDTO() {

    }

    public AffiliateDTO(Number moneyEarned, Number peopleReferred) {
        this.moneyEarned = moneyEarned;
        this.peopleReferred = peopleReferred;
    }

    public Number getMoneyEarned() {
        return moneyEarned;
    }
    public void setMoneyEarned(Number moneyEarned) {
        this.moneyEarned = moneyEarned;
    }
    public Number getPeopleReferred() {
        return peopleReferred;
    }
    public void setPeopleReferred(Number peopleReferred) {
        this.peopleReferred = peopleReferred;
    }

    
}
