package com.zuki.admin.service;

import com.zuki.ZukiException;
import com.zuki.admin.dao.IdentityDAO;
import com.zuki.functional.Clone;
import com.zuki.model.subscriber.IneligibleSubscriber;
import com.zuki.model.subscriber.Subscriber;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;
@Service
public class IdentityServiceImpl implements IdentityService {
    static Logger logger = Logger.getLogger(IdentityServiceImpl.class);
    @Autowired    
    IdentityDAO identityDAO;
    
    @Override
    public Subscriber getSubscriberById(long subscriberId) throws ZukiException {
        return identityDAO.getSubscriberById(subscriberId);
    }    
    
    @Override
    public Subscriber getSubscriberByNickname(String nickname) throws ZukiException {
        return identityDAO.getSubscriberByNickname(nickname);
    }


    @Override
    public Subscriber getSubscriber(String idOrNickname) throws ZukiException {
        
        if(idOrNickname == null) {
            return null;
        }

        if(Pattern.matches("^\\d+$", idOrNickname)) {
            return identityDAO.getSubscriberById(Long.parseLong(idOrNickname));
        }
        return identityDAO.getSubscriberByNickname(idOrNickname);
    }

    @Override
    public List<IneligibleSubscriber> getIneligibleSubscribers() throws ZukiException {
        return identityDAO.getIneligibleSubscribers();
    }

    @Override
    public List<IneligibleSubscriber> insertIneligibleSubscriber(IneligibleSubscriber ineligibleSubscriber)
            throws ZukiException {
        Subscriber subscriber = identityDAO.getSubscriberByEmail(ineligibleSubscriber.getEmail());
        IneligibleSubscriber enhanced = Clone.clone(ineligibleSubscriber);
        enhanced.setSubscriberId(subscriber.getSubscriberId());
        return identityDAO.insertIneligibleSubscriber(enhanced);
    }

    @Override
    public List<IneligibleSubscriber> deleteIneligibleSubscriber(IneligibleSubscriber subscriber) throws ZukiException {
        return identityDAO.deleteIneligibleSubscriber(subscriber);
    }

   
}
