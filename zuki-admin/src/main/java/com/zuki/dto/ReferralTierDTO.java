package com.zuki.dto;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;

public class ReferralTierDTO extends AffiliateDTO{
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    protected Date transactionDate;

    public ReferralTierDTO() {        
    }

    
    public ReferralTierDTO(Number moneyEarned, Number peopleReferred, Date transactionDate) {
        super(moneyEarned, peopleReferred);
        this.transactionDate = transactionDate;
    }


    public Date getTransactionDate() {
        return transactionDate;
    }


    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }


}
