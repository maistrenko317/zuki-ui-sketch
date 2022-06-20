package com.zuki.admin.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.zuki.ZukiException;
import com.zuki.dto.ReferralTreeNodeDTO;
import com.zuki.dto.ReferrerProfileDTO;
import com.zuki.dto.Referral3TiersDTO;
import com.zuki.dto.ReferralTierDTO;
import com.zuki.model.subscriber.Subscriber;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ReferralDAOJDBCImpl implements ReferralDAO{
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Override
    public List<Long> getSubscriberIdsWithRole(String role) throws ZukiException {       
        try { 
            return namedParameterJdbcTemplate.queryForList(
                "SELECT subscriber_id FROM gameplay.s_subscriber_role WHERE `role` = :role",
                Map.of("role", role), 
                Long.class
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve subscriber ids using role = " + role, e);
        }
    }

    @Override
    public List<Subscriber> getSubscribersWithRole(String role) throws ZukiException {       
        try { 
            return namedParameterJdbcTemplate.query(
                "SELECT  b.subscriber_id, b.email, b.nickname, b.create_date  FROM gameplay.s_subscriber_role a  INNER JOIN s_subscriber b ON a.subscriber_id = b.subscriber_id WHERE a.`role` = :role",
                new MapSqlParameterSource("role", role),
                (rs, rowNum) -> { { return new Subscriber(rs.getLong("subscriber_id"), rs.getString("nickname"), rs.getDate("create_date"), null); } }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve subscriber ids using role = " + role, e);
        }
    } 
    
    @Override
    public List<Subscriber> getRootSubscribersWithRole(String role) throws ZukiException {       
        try { 
            return namedParameterJdbcTemplate.query(
                "SELECT  b.subscriber_id, b.email, b.nickname, b.create_date  FROM gameplay.s_subscriber_role a  INNER JOIN s_subscriber b ON a.subscriber_id = b.subscriber_id WHERE a.`role` = :role AND mint_parent_subscriber_id IS NULL",
                new MapSqlParameterSource("role", role),
                (rs, rowNum) -> { { return new Subscriber(rs.getLong("subscriber_id"), rs.getString("nickname"), rs.getDate("create_date"), null); } }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve subscriber ids using role = " + role, e);
        }
    }        

    @Override
    public List<Subscriber> getRootSubscribers() throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query(
                "SELECT subscriber_id, email, nickname, create_date FROM s_subscriber WHERE mint_parent_subscriber_id IS NULL AND NOT (nickname LIKE '__player_%' OR nickname LIKE 'playerbot_%')",                
                (rs, rowNum) -> { return new Subscriber(rs.getLong("subscriber_id"), rs.getString("nickname"), rs.getDate("create_date"), null); }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve root subscribers", e);
        }
    }

    private ReferralTreeNodeDTO mapToReferralTreeNodeDTO(ResultSet rs) throws SQLException {
        return new ReferralTreeNodeDTO(
            rs.getLong("subscriber_id"),
            rs.getString("nickname"),
            rs.getDate("transaction_date"),
            List.of(),
            List.of(),
            rs.getLong("referred_people"),
            rs.getDouble("amount")
        );
    }

    @Override
    public List<ReferralTreeNodeDTO> getAffiliateTreeLevel0() throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query(
                "SELECT subscriber_id, email, nickname, referred_people, amount, transaction_date FROM AFFILIATE_TREE_LEVEL_0",                
                (rs, rowNum) -> this.mapToReferralTreeNodeDTO(rs)
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve root subscribers", e);
        }
    }

    @Override
    public List<ReferralTreeNodeDTO> getAffiliateTreeLevelN(long subscriberId) throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query(
                "SELECT subscriber_id, email, nickname, referred_people, amount, transaction_date FROM AFFILIATE_TREE_LEVEL_N WHERE mint_parent_subscriber_id = :subscriberId",                
                Map.of("subscriberId", subscriberId),
                (rs, rowNum) -> this.mapToReferralTreeNodeDTO(rs)
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve root subscribers", e);
        }
    }

    @Override
    public List<Referral3TiersDTO> getAffiliate3TiersTable(long  subscriberId) throws ZukiException {
        final java.util.Date today = new java.util.Date();
        try {             
            return namedParameterJdbcTemplate.query(
                "SELECT l1.subscriber_id, l1.nickname, " + 
                "SUM(l1.referred_people) l1_referred_people, SUM(l1.amount) l1_amount, "+
                "SUM(COALESCE(l2.referred_people, 0)) l2_referred_people, SUM(COALESCE(l2.amount, 0)) l2_amount, "+
                "SUM(COALESCE(l3.referred_people, 0)) l3_referred_people, SUM(COALESCE(l3.amount, 0)) l3_amount, "+
                "SUM(COALESCE(l4.referred_people, 0)) l4_referred_people, SUM(COALESCE(l4.amount, 0)) l4_amount, "+
                "s_subscriber.photo_url "+
                "FROM ( LEVEL_1_AFFILIATES l1 INNER JOIN s_subscriber ON l1.subscriber_id = s_subscriber.subscriber_id) "+
                "LEFT JOIN LEVEL_2_AFFILIATES l2 ON l1.subscriber_id = l2.subscriber_id "+
                "LEFT JOIN LEVEL_3_AFFILIATES l3 ON l1.subscriber_id = l3.subscriber_id "+
                "LEFT JOIN LEVEL_4_AFFILIATES l4 ON l1.subscriber_id = l4.subscriber_id "+
                "WHERE l1.mint_parent_subscriber_id = :subscriberId "+
                "GROUP BY l1.subscriber_id, l1.nickname, s_subscriber.photo_url "+
                "ORDER BY 3 DESC, 4 DESC, 5 DESC, 6 DESC, 7 DESC,8 DESC",
                Map.of("subscriberId", subscriberId),
                (rs, rowNum) -> {
                    
                    return new Referral3TiersDTO(
                        rs.getString("nickname"),
                        rs.getString("photo_url"),
                        new ReferralTierDTO(rs.getDouble("l1_amount"), rs.getInt("l1_referred_people"), today),
                        new ReferralTierDTO(rs.getDouble("l2_amount"), rs.getInt("l2_referred_people"), today),
                        new ReferralTierDTO(rs.getDouble("l3_amount"), rs.getInt("l3_referred_people"), today),
                        new ReferralTierDTO(rs.getDouble("l4_amount"), rs.getInt("l4_referred_people"), today)
                    );
                }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve root subscribers", e);
        }
    }
    
    @Override
    public List<Referral3TiersDTO> getAffiliateMonthlyEarnings(long  subscriberId) throws ZukiException {
        Calendar calendar = GregorianCalendar.getInstance();
        calendar.set(GregorianCalendar.DAY_OF_MONTH, 1);
        ReferralTierDTO empty = new ReferralTierDTO(0.0, 0, calendar.getTime());

        try {             
            return namedParameterJdbcTemplate.query(
                "SELECT transaction_year, transaction_month, amount FROM gameplay.MONTHLY_EARNINGS WHERE mint_parent_subscriber_id = :subscriberId ",
                Map.of("subscriberId", subscriberId),
                (rs, rowNum) -> {
                    calendar.set(GregorianCalendar.MONTH, rs.getInt("transaction_month")-1);
                    calendar.set(GregorianCalendar.YEAR, rs.getInt("transaction_year"));
                    empty.setTransactionDate(calendar.getTime());
                    return new Referral3TiersDTO(
                        null,
                        null,
                        new ReferralTierDTO(
                            rs.getDouble("amount"),
                            0,
                            calendar.getTime()
                        ),
                        empty,
                        empty,
                        empty
                    );
                }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve root subscribers", e);
        }
    }

    @Override
    public List<Referral3TiersDTO> getAffiliateYearlyEarnings(long  subscriberId) throws ZukiException {
        Calendar calendar = GregorianCalendar.getInstance();
        calendar.set(GregorianCalendar.DAY_OF_MONTH, 31);
        calendar.set(GregorianCalendar.MONTH, GregorianCalendar.DECEMBER);
        ReferralTierDTO empty = new ReferralTierDTO(0.0, 0, calendar.getTime());

        try {             
            return namedParameterJdbcTemplate.query(
                "SELECT transaction_year, amount FROM gameplay.YEARLY_EARNINGS WHERE mint_parent_subscriber_id = :subscriberId",
                Map.of("subscriberId", subscriberId),
                (rs, rowNum) -> {
                    calendar.set(GregorianCalendar.YEAR, rs.getInt("transaction_year"));
                    empty.setTransactionDate(calendar.getTime());
                    return new Referral3TiersDTO(
                        null,
                        null,
                        new ReferralTierDTO(
                            rs.getDouble("amount"),
                            0,
                            calendar.getTime()
                        ),
                        empty,
                        empty,
                        empty
                    );
                }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve root subscribers", e);
        }
    }
    @Override
    public ReferrerProfileDTO getReferrerProfile(long subscriberId) throws ZukiException {
        try { 

            Optional<ReferrerProfileDTO> result = namedParameterJdbcTemplate.queryForObject(
                "SELECT COUNT(*) as direct_referred, "+
                "SUM(l1_referred_people + l2_referred_people + l3_referred_people) referred_people, "+
                "SUM(l1_amount + l2_amount + l3_amount) money_earned "+
                "FROM ALL_LEVELS_AFFILIATES " +
                "WHERE mint_parent_subscriber_id = :subscriberId ",
                Map.of("subscriberId", subscriberId),
                (rs, rowNum) -> Optional.of(new ReferrerProfileDTO(
                    null, null, rs.getDouble("money_earned"), rs.getLong("referred_people") + rs.getLong("direct_referred"), rs.getLong("direct_referred")
                ))
            );

            if(result.isEmpty()) {
                return null;
            }

            return result.get();
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve subscriber profile using id = " + subscriberId, e);
        }
    }

  
    
}
