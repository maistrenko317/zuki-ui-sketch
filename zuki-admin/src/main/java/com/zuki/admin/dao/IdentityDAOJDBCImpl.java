package com.zuki.admin.dao;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.zuki.ZukiException;
import com.zuki.model.subscriber.IneligibleSubscriber;
import com.zuki.model.subscriber.Subscriber;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

@Repository
public class IdentityDAOJDBCImpl implements IdentityDAO{
    Logger logger = Logger.getLogger(IdentityDAOJDBCImpl.class);
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Override
    public Subscriber getSubscriberById(long subscriberId) throws ZukiException {
        return IdentityDAO.getSubscriberById(namedParameterJdbcTemplate, subscriberId);
    }


    @Override
    public Subscriber getSubscriberByEmail(String email) throws ZukiException {
        try {
            Optional<Subscriber> subscriber = namedParameterJdbcTemplate.queryForObject(
                "SELECT subscriber_id, email, nickname, create_date, mint_parent_subscriber_id, photo_url FROM s_subscriber WHERE email  = :email",
                new MapSqlParameterSource("email", email),
                (rs, rowNum) -> Optional.of(new Subscriber(rs.getLong("subscriber_id"), rs.getString("nickname"), rs.getDate("create_date"), rs.getLong("mint_parent_subscriber_id"), rs.getString("photo_url")))
            );

            if(!subscriber.isPresent()) {
                return null;
            }

            return subscriber.get();
        }catch (EmptyResultDataAccessException e) {
            return null;
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve subscriber with email = " + email, e);    
        }
    } 

    @Override
    public Subscriber getSubscriberByNickname(String nickname) throws ZukiException {
        try {
            Optional<Subscriber> subscriber = namedParameterJdbcTemplate.queryForObject(
                "SELECT subscriber_id, email, nickname, create_date, mint_parent_subscriber_id, photo_url FROM s_subscriber WHERE nickname  = :nickname",
                new MapSqlParameterSource("nickname", nickname),
                (rs, rowNum) -> Optional.of(new Subscriber(rs.getLong("subscriber_id"), rs.getString("nickname"), rs.getDate("create_date"), rs.getLong("mint_parent_subscriber_id"), rs.getString("photo_url")))
            );

            if(!subscriber.isPresent()) {
                return null;
            }

            return subscriber.get();
        }catch (EmptyResultDataAccessException e) {
            return null;
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve subscriber with nickname = " + nickname, e);            
        }
    }    

    @Override
    public List<Subscriber> getMintChildren(long subscriberId) throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query( // referredSubscriber.getNickname(), referredSubscriber.getCreateDate(), subscriber.getNickname()
                "SELECT * FROM gameplay.s_subscriber WHERE mint_parent_subscriber_id = :subscriberId",
                new MapSqlParameterSource("subscriberId", subscriberId),
                (rs, rowNum) -> { return new Subscriber(rs.getLong("subscriber_id"), rs.getString("nickname"), rs.getDate("create_date"), rs.getLong("mint_parent_subscriber_id")); }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve mint children for = " + subscriberId, e);
        }
    }
    
    public List<Subscriber> getChildren(Long subscriberId) throws ZukiException {
        Long mintParentSubscriberId = subscriberId == null ? -1 : subscriberId;

        try { 
            return namedParameterJdbcTemplate.query( 
                "SELECT subscriber_id, email, nickname, create_date, mint_parent_subscriber_id, photo_url FROM s_subscriber WHERE mint_parent_subscriber_id = :mintParentSubscriberId AND NOT (nickname LIKE '__player_%' OR nickname LIKE 'playerbot_%');",
                new MapSqlParameterSource(Map.of("mintParentSubscriberId", mintParentSubscriberId)),
                (rs, rowNum) -> { return new Subscriber(rs.getLong("subscriber_id"), rs.getString("nickname"), rs.getDate("create_date"), subscriberId, rs.getString("photo_url")); }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve children", e);
        }        
    }

    public List<Subscriber> getChildren(Subscriber root) throws ZukiException {
        return getChildren(root == null ? null : root.getSubscriberId());
    }


    @Override
    public Subscriber getSubscriberBySessionKey(String sessionKey) throws ZukiException {
        try {
            Optional<Subscriber> subscriber = (Optional<Subscriber>) namedParameterJdbcTemplate.queryForObject(
                "SELECT b.subscriber_id, b.email, b.nickname, b.create_date, b.mint_parent_subscriber_id, photo_url FROM s_subscriber_session a INNER JOIN s_subscriber b ON b.subscriber_id = a.subscriber_id WHERE session_key = :sessionKey",
                new MapSqlParameterSource("sessionKey", sessionKey),
                (rs, rowNum) -> Optional.of(
                    new Subscriber(
                        rs.getLong("subscriber_id"), 
                        rs.getString("nickname"), 
                        rs.getDate("create_date"), 
                        rs.getLong("mint_parent_subscriber_id"),
                        rs.getString("photo_url")
                    ))
           );

            return subscriber.isPresent() ? subscriber.get() : null ;
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve subscriber with sessionKey = " + sessionKey, e);            
        }

    }
    @Override
    public List<IneligibleSubscriber> insertIneligibleSubscriber(IneligibleSubscriber subscriber) throws ZukiException {
        String sqlText =
            "INSERT INTO snowyowl.ineligible_subscribers (subscriber_id, email, linked_subscriber_id, linked_email, `reason`, create_date) " +
            "VALUES (:subscriberId, :email, :linkedSubscriberId, :linkedEmail, :reason, NOW())";
        SqlParameterSource namedParameters = new BeanPropertySqlParameterSource(subscriber);
        try {
            namedParameterJdbcTemplate.update(sqlText, namedParameters);
            return this.getIneligibleSubscribers();
        }catch(DataAccessException e) {
            throw new ZukiException("Can't insert ineligible susbcriber", e);
        }
    }


    @Override //
    public List<IneligibleSubscriber> getIneligibleSubscribers() throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query( 
                "SELECT nickname, is_id, a.subscriber_id, a.email, linked_subscriber_id, linked_email, reason FROM snowyowl.ineligible_subscribers a INNER JOIN gameplay.s_subscriber b ON a.subscriber_id = b.subscriber_id",
                (rs, rowNum) ->  new IneligibleSubscriber(rs.getInt("is_id"), rs.getLong("subscriber_id"), rs.getString("email"), rs.getLong("linked_subscriber_id"), rs.getString("linked_email"), rs.getString("reason"), rs.getString("nickname"))
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve ineligible susbcriber", e);
        }
    }


    @Override
    public List<IneligibleSubscriber> deleteIneligibleSubscriber(IneligibleSubscriber subscriber) throws ZukiException {
        String sqlText = "DELETE FROM snowyowl.ineligible_subscribers WHERE is_id = :isId";
        SqlParameterSource namedParameters = new BeanPropertySqlParameterSource(subscriber);
        try {
            logger.debug("isId = " + subscriber.getIsId());
            namedParameterJdbcTemplate.update(sqlText, namedParameters);
            return this.getIneligibleSubscribers();
        }catch(DataAccessException e) {
            throw new ZukiException("Can't delete ineligible susbcriber", e);
        }        
    }


   
}
