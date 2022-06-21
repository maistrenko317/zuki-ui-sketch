package com.zuki.admin.service;

import java.util.List;

import com.zuki.ZukiException;
import com.zuki.model.subscriber.IneligibleSubscriber;
import com.zuki.model.subscriber.Subscriber;

public interface IdentityService {
    Subscriber getSubscriberById(long subscriberId) throws ZukiException;
    Subscriber getSubscriberByNickname(String nickname) throws ZukiException;
    Subscriber getSubscriber(String idOrNickname) throws ZukiException;

    List<IneligibleSubscriber> getIneligibleSubscribers() throws ZukiException;
    List<IneligibleSubscriber> insertIneligibleSubscriber(IneligibleSubscriber subscriber) throws ZukiException;
    List<IneligibleSubscriber> deleteIneligibleSubscriber(IneligibleSubscriber subscriber) throws ZukiException;
}
