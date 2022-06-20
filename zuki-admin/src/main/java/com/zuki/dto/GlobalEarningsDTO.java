package com.zuki.dto;

import java.util.List;

public class GlobalEarningsDTO {
    List<Referral3TiersDTO> yearly;
    List<Referral3TiersDTO> monthly;

    public GlobalEarningsDTO() {

    }

    
    public GlobalEarningsDTO(List<Referral3TiersDTO> yearly, List<Referral3TiersDTO> monthly) {
        this.yearly = yearly;
        this.monthly = monthly;
    }


    public List<Referral3TiersDTO> getYearly() {
        return yearly;
    }
    public void setYearly(List<Referral3TiersDTO> yearly) {
        this.yearly = yearly;
    }
    public List<Referral3TiersDTO> getMonthly() {
        return monthly;
    }
    public void setMonthly(List<Referral3TiersDTO> monthly) {
        this.monthly = monthly;
    }

    
}
