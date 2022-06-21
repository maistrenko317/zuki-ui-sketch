package com.zuki.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ReferralReferredSubscriberDTO {
    private String nickname;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private Date date;
    private String referrerNickname;

    public ReferralReferredSubscriberDTO(String nickname, Date date, String referrerNickname)
    {
        this.nickname = nickname;
        this.date = date;
        this.referrerNickname = referrerNickname;
    }    

    public ReferralReferredSubscriberDTO() {

    }
    
    /**
     * @return String return the nickname
     */
    public String getNickname() {
        return nickname;
    }

    /**
     * @return Date return the date
     */
    public Date getDate() {
        return date;
    }

    /**
     * @return String return the referrerNickname
     */
    public String getReferrerNickname() {
        return referrerNickname;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    

    /**
     * @param nickname the nickname to set
     */
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    /**
     * @param referrerNickname the referrerNickname to set
     */
    public void setReferrerNickname(String referrerNickname) {
        this.referrerNickname = referrerNickname;
    }

}
