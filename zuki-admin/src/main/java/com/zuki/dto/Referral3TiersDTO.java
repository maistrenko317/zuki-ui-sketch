package com.zuki.dto;

public class Referral3TiersDTO {
    String nickname;
    String photoUrl;    
    ReferralTierDTO tier1;
    ReferralTierDTO tier2;
    ReferralTierDTO tier3;
    ReferralTierDTO tier4;

    public Referral3TiersDTO() {        
    }

    public Referral3TiersDTO(String nickname, String photoUrl, ReferralTierDTO tier1, ReferralTierDTO tier2, ReferralTierDTO tier3, ReferralTierDTO tier4) {
        this.nickname = nickname;
        this.tier1 = tier1;
        this.tier2 = tier2;
        this.tier3 = tier3;
        this.tier4 = tier4;
        this.photoUrl = photoUrl;
    }
    
    public ReferralTierDTO getTier1() {
        return tier1;
    }

    public void setTier1(ReferralTierDTO tier1) {
        this.tier1 = tier1;
    }

    public ReferralTierDTO getTier2() {
        return tier2;
    }

    public void setTier2(ReferralTierDTO tier2) {
        this.tier2 = tier2;
    }

    public ReferralTierDTO getTier3() {
        return tier3;
    }

    public void setTier3(ReferralTierDTO tier3) {
        this.tier3 = tier3;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public ReferralTierDTO getTier4() {
        return tier4;
    }

    public void setTier4(ReferralTierDTO tier4) {
        this.tier4 = tier4;
    }

    
}
