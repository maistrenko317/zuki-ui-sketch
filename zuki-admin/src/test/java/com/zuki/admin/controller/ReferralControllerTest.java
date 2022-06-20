package com.zuki.admin.controller;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;
import java.util.Map;

import com.zuki.BaseControllerTest;
import com.zuki.BaseTest;
import com.zuki.MockClient;
import com.zuki.client.Referral3TiersDTOList;
import com.zuki.client.ReferralTransactionDTOListResponse;
import com.zuki.client.GlobalEarningsDTOResponse;
import com.zuki.client.Referral3TiersDTOListResponse;
import com.zuki.dto.ReferralSummaryDTO;
import com.zuki.dto.ReferralTransactionDTO;

import org.apache.log4j.Logger;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;

import com.zuki.dto.GlobalEarningsDTO;
import com.zuki.dto.Referral3TiersDTO;
import java.util.LinkedList;
import java.util.List;

import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import  com.zuki.Constants;
public class ReferralControllerTest extends BaseControllerTest {
    static Logger logger = Logger.getLogger(ReferralControllerTest.class);

    private void assertValidReferral3TierDTO(Referral3TiersDTO dto) {
        assertTrue(dto.getTier1().getPeopleReferred().intValue() > 0 && dto.getTier1().getMoneyEarned().doubleValue() > 0.0);
        assertTrue(dto.getTier2().getPeopleReferred().intValue() > 0 && dto.getTier2().getMoneyEarned().doubleValue() > 0.0);
        assertTrue(dto.getTier3().getPeopleReferred().intValue() > 0 && dto.getTier3().getMoneyEarned().doubleValue() > 0.0);
    }

    @Test
    @Order(1)
    public void getAffiliate3TiersTableById() throws Exception {
        final long subscriberId =  23; //TODO: Make this constant configurable.
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching Referral info");
        LinkedList<Referral3TiersDTO> entity = MockClient.get(
            mvc, 
            "/referral/3tiers/" + subscriberId,
            Referral3TiersDTOListResponse.class,
            MockMvcResultMatchers.status().isOk(),
            Map.of(Constants.X_REST_SESSION_KEY, (new Date()).toString())
        ).getEntity();      
        
        Referral3TiersDTO dto = entity.iterator().next();
        assertValidReferral3TierDTO(dto);
    }

    @Test
    @Order(2)
    public void getAffiliate3TiersTableByNickName() throws Exception {
        final String nickname =  "InterstellarCowboy"; //TODO: Make this constant configurable.
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching Referral info");
        LinkedList<Referral3TiersDTO> entity = MockClient.get(
            mvc, 
            "/referral/3tiers/" + nickname,
            Referral3TiersDTOListResponse.class,
            MockMvcResultMatchers.status().isOk(),
            Map.of(Constants.X_REST_SESSION_KEY, (new Date()).toString())
        ).getEntity();      
        
        Referral3TiersDTO dto = entity.iterator().next();
        assertValidReferral3TierDTO(dto);
    }  
    // 
    @Test
    @Order(3)
    public void getAffiliateTransactions() throws Exception {
        final String nickname =  "Maverick"; //TODO: Make this constant configurable.
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching Referral info");
        LinkedList<ReferralTransactionDTO> entity = MockClient.get(
            mvc, 
            "/referral/transactions/" + nickname,
            ReferralTransactionDTOListResponse.class,
            MockMvcResultMatchers.status().isOk(),
            Map.of(Constants.X_REST_SESSION_KEY, (new Date()).toString())
        ).getEntity();      
        
        assertTrue(entity.size() > 0);

    }     
     
    // 
    @Test
    @Order(3)
    public void getRefferrerEarningsByPeriod() throws Exception {
        final String nickname =  "InterstellarCowboy"; //TODO: Make this constant configurable.
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching Referral info");
        
        List<Referral3TiersDTO> montly = MockClient.get(
            mvc, 
            "/referral/referrer/earnings/monthly/" + nickname,
            Referral3TiersDTOListResponse.class,
            MockMvcResultMatchers.status().isOk(),
            Map.of(Constants.X_REST_SESSION_KEY, (new Date()).toString())
        ).getEntity();      
        
        List<Referral3TiersDTO> yearly = MockClient.get(
            mvc, 
            "/referral/referrer/earnings/yearly/" + nickname,
            Referral3TiersDTOListResponse.class,
            MockMvcResultMatchers.status().isOk(),
            Map.of(Constants.X_REST_SESSION_KEY, (new Date()).toString())
        ).getEntity(); 

        assertTrue(montly.size() > 1);
        assertTrue(montly.size() > yearly.size());
        
        assertTrue(montly.iterator().next().getTier1().getMoneyEarned().doubleValue() > 0);
        assertTrue(yearly.iterator().next().getTier1().getMoneyEarned().doubleValue() > 0);
    } 
    
    @Test
    @Order(4)
    public void getRefferrerGlobalEarnings() throws Exception {
        final String nickname =  "InterstellarCowboy"; //TODO: Make this constant configurable.
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching Referral info");
        
        GlobalEarningsDTO global = MockClient.get(
            mvc, 
            "/referral/referrer/earnings/global/" + nickname,
            GlobalEarningsDTOResponse.class,
            MockMvcResultMatchers.status().isOk(),
            Map.of(Constants.X_REST_SESSION_KEY, (new Date()).toString())
        ).getEntity();      
        
        

        assertTrue(global.getMonthly().size() > 1);
        assertTrue(global.getMonthly().size() > global.getYearly().size());
        
        assertTrue(global.getMonthly().iterator().next().getTier1().getMoneyEarned().doubleValue() > 0);
        assertTrue(global.getYearly().iterator().next().getTier1().getMoneyEarned().doubleValue() > 0);
    }

    @Test
    public void referalInfo() throws Exception {
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching Referral info");
        Referral3TiersDTOList referralReportDTO= MockClient.get(
                mvc,
                "/referral/referral-info/",
                Referral3TiersDTOListResponse.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of(Constants.X_REST_SESSION_KEY, (new Date()).toString())
        ).getEntity();

        assertValidReferral3TierDTO(referralReportDTO.get(1));
    }

    @Test
    public void referralTree() throws Exception {
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching Referral info");
        Referral3TiersDTOList referral3TiersDTOList = MockClient.get(
                mvc,
                "/referral/referral-tree/",
                Referral3TiersDTOListResponse.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of(Constants.X_REST_SESSION_KEY, (new Date()).toString())
        ).getEntity();

        Referral3TiersDTO dto = referral3TiersDTOList.iterator().next();
        assertValidReferral3TierDTO(dto);
    }

    @Test
    public void referralSummary() throws Exception {
        long subscriberId = 10;
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching Referral info");
        ReferralSummaryDTO referralSummaryDTO = MockClient.get(
                mvc,
                "referral/summary/" + subscriberId,
                ReferralSummaryDTO.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        );
    }

}






