package com.zuki.model.subscriber;


import java.io.Serializable;
import java.util.Date;


public class IneligibleSubscriber implements Serializable
{
    private static final long serialVersionUID = 1L;

    private int _isId;
    private long _subscriberId;
    private String _email;
    private Long _linkedSubscriberId;
    private String _linkedEmail;
    private String _reason;
    private Date _createDate;
    private String toWds;
    private String appId;
    private String _nickname;

    public IneligibleSubscriber(int isId) {
        this._isId = isId;
    }
    public IneligibleSubscriber() {}

    public IneligibleSubscriber(final String email, String reason)
    {
        _email = email;
        _reason = reason;
    }    

    public IneligibleSubscriber(final int isId, final long subscriberId, final String email, final Long linkedSubscriberId, final String linkedEmail, final String reason)
    {
        _isId = isId;
        _subscriberId = subscriberId;
        _email = email;
        _linkedSubscriberId = linkedSubscriberId;
        _linkedEmail = linkedEmail;
        _reason = reason;
    }

    public IneligibleSubscriber(final int isId, final long subscriberId, final String email, final Long linkedSubscriberId, final String linkedEmail, final String reason, String nickname)
    {
        _isId = isId;
        _subscriberId = subscriberId;
        _email = email;
        _linkedSubscriberId = linkedSubscriberId;
        _linkedEmail = linkedEmail;
        _reason = reason;
        _nickname = nickname;
    }

    public int getIsId()
    {
        return _isId;
    }
    public void setIsId(final int isId)
    {
        _isId = isId;
    }
    public long getSubscriberId()
    {
        return _subscriberId;
    }
    public void setSubscriberId(final long subscriberId)
    {
        _subscriberId = subscriberId;
    }
    public String getEmail()
    {
        return _email;
    }

    public void setEmail(final String email)
    {
        _email = email;
    }

    public Long getLinkedSubscriberId()
    {
        return _linkedSubscriberId;
    }
    public void setLinkedSubscriberId(final Long linkedSubscriberId)
    {
        _linkedSubscriberId = linkedSubscriberId;
    }
    public String getLinkedEmail()
    {
        return _linkedEmail;
    }

    public void setLinkedEmail(final String linkedEmail)
    {
        _linkedEmail = linkedEmail;
    }

    public String getReason()
    {
        return _reason;
    }
    public void setReason(final String reason)
    {
        _reason = reason;
    }
    public Date getCreateDate()
    {
        return _createDate;
    }
    public void setCreateDate(final Date createDate)
    {
        _createDate = createDate;
    }

    public String getToWds() {
        return toWds;
    }

    public void setToWds(final String toWds) {
        this.toWds = toWds;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(final String appId) {
        this.appId = appId;
    }
    public String getNickname() {
        return _nickname;
    }
    public void setNickname(String nickname) {
        this._nickname = nickname;
    }

    
}
