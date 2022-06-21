package com.zuki.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ReferralTransactionDTO {
    String nickname;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    Date date;

    double amount;

    public ReferralTransactionDTO() {

    }
    public ReferralTransactionDTO(String nickname, Date date, double amount) {
        this.nickname = nickname;
        this.date = date;
        this.amount = amount;
    }


    public String getNickname() {
        return nickname;
    }

    public Date getDate() {
        return date;
    }

    public double getAmount() {
        return amount;
    }
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
    public void setDate(Date date) {
        this.date = date;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }  
    
    
}
