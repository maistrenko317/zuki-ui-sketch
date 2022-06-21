package com.zuki.admin.dao;

import java.util.List;
import java.util.Map;

import com.zuki.ZukiException;
import com.zuki.dto.CashPoolTransaction2DTO;
import com.zuki.dto.ReferralTransactionDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ContestDAOImpl implements ContestDAO{
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    
    @Override
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(long subscriberId, String transactionTypeAsCommaDelimitedList) throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query(
            "select description, transaction_date, amount from contest.cash_pool_transaction2 where subscriber_id = :subscriberId AND FIND_IN_SET (`type`, :type) <> 0 order by transaction_date DESC",
                new MapSqlParameterSource(Map.of("subscriberId", subscriberId, "type", transactionTypeAsCommaDelimitedList)),
                (rs, rowNum) -> {
                    ReferralTransactionDTO dto = new ReferralTransactionDTO(rs.getString("description"), rs.getDate("transaction_date"), rs.getDouble("amount")); 
                    return dto;
                }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve cash pool transactions for subscriber = " + subscriberId, e);
        }        
        
    }
    
    @Override
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(String nickname, String transactionTypeAsCommaDelimitedList) throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query(
            "select description, transaction_date, amount from contest.cash_pool_transaction2 A INNER JOIN gameplay.s_subscriber B ON A.description = B.nickname WHERE B.nickname = :nickname AND FIND_IN_SET (`type`, :type) <> 0 order by transaction_date DESC",
                new MapSqlParameterSource(Map.of("nickname", nickname, "type", transactionTypeAsCommaDelimitedList)),
                (rs, rowNum) -> {
                    ReferralTransactionDTO dto = new ReferralTransactionDTO(rs.getString("description"), rs.getDate("transaction_date"), rs.getDouble("amount")); 
                    return dto;
                }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve cash pool transactions for subscriber = " + nickname, e);
        }        
        
    }

    @Override
    public Number getMoneyEarnedByReferrals() throws ZukiException {
        try { 
            return (Number)namedParameterJdbcTemplate.queryForObject(
                "select sum(amount) amount from contest.cash_pool_transaction2 a INNER JOIN gameplay.s_subscriber b ON b.nickname = a.description INNER JOIN gameplay.s_subscriber_role c ON c.subscriber_id = b.subscriber_id WHERE c.role = 'AFFILIATE' AND FIND_IN_SET (`type`, 'PAYOUT_REFERRAL')",
                Map.of(),
                Number.class
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't sum referral transaction amounts.", e);
        }  
    }

    @Override
    public Number getPeopleReferred() throws ZukiException {
        try { 
            return (Number)namedParameterJdbcTemplate.queryForObject(
                "select count(*) cnt from gameplay.s_subscriber a INNER JOIN gameplay.s_subscriber_role b ON a.subscriber_id = b.subscriber_id WHERE b.role = 'AFFILIATE' AND a.mint_parent_subscriber_id IS NULL;",
                Map.of(),
                Number.class
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't count referred people.", e);
        } 
    }       

    @Override
    public List<CashPoolTransaction2DTO> getCashPoolTransactionsForSubscriberForTypes(long subscriberId, String transactionTypeAsCommaDelimitedList) throws ZukiException {
        try { 
            return namedParameterJdbcTemplate.query(
            "select * from contest.cash_pool_transaction2 where subscriber_id = :subscriberId AND FIND_IN_SET (`type`, :type) <> 0 order by transaction_date",
                new MapSqlParameterSource(Map.of("subscriberId", subscriberId, "type", transactionTypeAsCommaDelimitedList)),
                (rs, rowNum) -> {
                    CashPoolTransaction2DTO dto = new CashPoolTransaction2DTO(); 
                    dto.setCashpoolTransactionId(rs.getLong("cashpool_transaction_id"));
                    dto.setSubscriberId(rs.getLong("subscriber_id"));
                    dto.setAmount(rs.getDouble("amount"));
                    dto.setType (CashPoolTransaction2DTO.TYPE.valueOf(CashPoolTransaction2DTO.TYPE.class, rs.getString("type")));
                    dto.setDescription(rs.getString("description"));
                    dto.setCurrentPoolAmount(rs.getDouble("current_pool_amount"));
                    dto.setCurrentBonusAmount(rs.getDouble("current_bonus_amount"));
                    dto.setUsedPoolAmount(rs.getDouble("used_pool_amount"));
                    dto.setUsedBonusAmount(rs.getDouble("used_bonus_amount"));
                    dto.setReceiptId(rs.getInt("receipt_id"));
                    dto.setContextUuid(rs.getString("context_uuid"));
                    dto.setTransactionDate(rs.getDate("transaction_date"));
                    return dto;
                }
            );
        }catch(DataAccessException e) {
            throw new ZukiException("Can't retrieve cash pool transactions for subscriber = " + subscriberId, e);
        }        
        
    }
    
    
}


