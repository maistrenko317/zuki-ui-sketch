package com.zuki.dto;

public class ReferrerProfileDTO extends AffiliateDTO{
    String nickname;
    String photoUrl;
    Number directReferred;

    public ReferrerProfileDTO() {
        
    }
    public ReferrerProfileDTO(String nickname, String photoUrl) {
        this.nickname = nickname;
        this.photoUrl = photoUrl;
    }

    public ReferrerProfileDTO(String nickname, String photoUrl, Number moneyEarned, Number peopleReferred, Number directReferred) {
        super(moneyEarned, peopleReferred);
        this.nickname = nickname;
        this.photoUrl = photoUrl;
        this.directReferred = directReferred;
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

    public Number getDirectReferred() {
        return directReferred;
    }

    public void setDirectReferred(Number directReferred) {
        this.directReferred = directReferred;
    }

    
}
