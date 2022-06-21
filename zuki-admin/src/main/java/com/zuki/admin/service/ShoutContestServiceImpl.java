package com.zuki.admin.service;

import java.util.List;

import com.zuki.ZukiException;
import com.zuki.admin.dao.ContestDAO;
import com.zuki.dto.CashPoolTransaction2DTO;
import com.zuki.dto.ReferralTransactionDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShoutContestServiceImpl implements ShoutContestService {
    @Autowired
    ContestDAO contestDAO;

    @Override
    public List<CashPoolTransaction2DTO> getCashPoolTransactionsForSubscriberForTypes(long subscriberId, List<String> transactionTypes) throws ZukiException {
        final StringBuilder builder = new StringBuilder();
        transactionTypes.forEach(type -> builder.append(type + ','));

        if(builder.length() > 0) {
            builder.deleteCharAt(builder.length()-1);
            return contestDAO.getCashPoolTransactionsForSubscriberForTypes(subscriberId, builder.toString());
        }
        
        return List.of();
    }

    private String joinStrings(List<String> list, char separator) {
        final StringBuilder builder = new StringBuilder();
        list.forEach(type -> builder.append(type + ','));
        if(builder.length() > 0) {
            builder.deleteCharAt(builder.length()-1);
        }
        return builder.toString();
    }

    @Override
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(long subscriberId, List<String> transactionTypes) throws ZukiException {
        return contestDAO.getReferralTransactionsForTypes(subscriberId, joinStrings(transactionTypes, ','));        
    }

    @Override
    public List<ReferralTransactionDTO> getReferralTransactionsForTypes(String nickName, List<String> transactionTypes) throws ZukiException{
        return contestDAO.getReferralTransactionsForTypes(nickName, joinStrings(transactionTypes, ','));

    }
    
}
