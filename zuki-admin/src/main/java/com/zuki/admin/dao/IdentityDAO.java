package com.zuki.admin.dao;

import java.util.List;
import java.util.Optional;

import com.zuki.ZukiException;
import com.zuki.model.subscriber.IneligibleSubscriber;
import com.zuki.model.subscriber.Subscriber;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

public interface IdentityDAO {
    Subscriber getSubscriberById(long subscriberId) throws ZukiException;
    Subscriber getSubscriberByEmail(String email) throws ZukiException;    
    List<Subscriber> getMintChildren(long subscriberId) throws ZukiException;        
    List<Subscriber> getChildren(Long subscriberId) throws ZukiException;
    List<Subscriber> getChildren(Subscriber root) throws ZukiException;
    Subscriber getSubscriberBySessionKey(String sessionKey) throws ZukiException;    
    Subscriber getSubscriberByNickname(String nickname) throws ZukiException;
    List<IneligibleSubscriber> insertIneligibleSubscriber(IneligibleSubscriber subscriber) throws ZukiException;
    List<IneligibleSubscriber> getIneligibleSubscribers() throws ZukiException;  
    List<IneligibleSubscriber> deleteIneligibleSubscriber(IneligibleSubscriber subscriber) throws ZukiException;  

    public static Subscriber getSubscriberById(NamedParameterJdbcTemplate namedParameterJdbcTemplate, long subscriberId) throws ZukiException {
        try {
            Optional<Subscriber> subscriber = namedParameterJdbcTemplate.queryForObject(
                "SELECT subscriber_id, email, nickname, create_date, mint_parent_subscriber_id, photo_url FROM s_subscriber WHERE subscriber_id  = :subscriberId",
                new MapSqlParameterSource("subscriberId", subscriberId),
                (rs, rowNum) -> Optional.of(new Subscriber(rs.getLong("subscriber_id"), rs.getString("nickname"), rs.getDate("create_date"), rs.getLong("mint_parent_subscriber_id"), rs.getString("photo_url")))
            );

            if(!subscriber.isPresent()) {
                return null;
            }

            return subscriber.get();
        }catch (EmptyResultDataAccessException e) {
            return null;
          }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve subscriber with id = " + subscriberId, e);            
        }
    }
  
}
