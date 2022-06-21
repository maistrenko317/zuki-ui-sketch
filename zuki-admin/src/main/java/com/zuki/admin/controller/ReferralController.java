package com.zuki.admin.controller;

import java.util.List;

import com.zuki.AbstractController;
import com.zuki.Constants;
import com.zuki.Response;
import com.zuki.ZukiException;
import com.zuki.ZukiLambdaException;
import com.zuki.admin.service.ReferralService;

import com.zuki.dto.*;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@CrossOrigin(origins = "*", maxAge = 3600,  methods= {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS, RequestMethod.HEAD})
@Controller
@RequestMapping("referral") 

public class ReferralController extends AbstractController{ 
    private static Logger logger = Logger.getLogger(ReferralController.class);
    public static final String REFERRAL_TREE_URI = "referral-tree";
    public static final String REFERRAL_INFO = "referral-info";
    public static final String REFERRAL_REPORT_URI = "referral-report";
    public static final String REFERRAL_SUMMARY_URI = "summary";
    public static final String REFERRAL_SESSION_URI = "session";
    public static final String REFERRAL_3_TIERS = "3tiers";
    public static final String REFERRAL_TRANSACTIONS = "transactions";
    public static final String REFERRER = "referrer";
    public static final String REFERRER_MONTLY_EARNINGS = REFERRER + "/earnings/monthly";
    public static final String REFERRER_YEARLY_EARNINGS = REFERRER + "/earnings/yearly";
    public static final String REFERRER_GLOBAL_EARNINGS = REFERRER + "/earnings/global";
    @Autowired
    ReferralService referralService;

    @GetMapping(REFERRAL_INFO)
    public ResponseEntity<Response> referralInfo() {

        try {
            return ResponseEntity
                .ok()
                .body(
                    new Response(referralService.referralReport(Constants.AFFILIATE).getReferralInfo())
                ); 

        }catch(ZukiException | ZukiLambdaException e) {
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }
    }      

    @GetMapping(REFERRAL_TREE_URI)
    public ResponseEntity<Response> referralTree()  {

        try {
            return ResponseEntity
                .ok()
                .body(
                    new Response(referralService.referralReport(Constants.AFFILIATE).getReferralTreeNodes())
                ); 

        }catch(ZukiException | ZukiLambdaException e) {
            
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }
    }    


    @GetMapping(REFERRAL_REPORT_URI)
    public ResponseEntity<Response> referralReport() {
        try {
            return ResponseEntity
                .ok()
                .body(
                    new Response(referralService.referralReport(Constants.AFFILIATE))
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }
    }     

    @GetMapping(REFERRAL_SESSION_URI)
    public ResponseEntity<Response> referralSession(@RequestHeader("X-REST-SESSION-KEY") String sessionKey) {

        try {
            return ResponseEntity
                .ok()
                .body(
                    new Response(referralService.referralReportBySessionKey(sessionKey).getReferralInfo())
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }
    }    

    @GetMapping(REFERRAL_SUMMARY_URI)
    public ResponseEntity<Response> referralSummary(@RequestHeader("X-REST-SESSION-KEY") String sessionKey) {
        try {
            return ResponseEntity
                .ok()
                .body(
                    new Response(referralService.referralSummary())
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }
    } 
    

    @GetMapping(REFERRAL_SUMMARY_URI + "/{subscriberId}" )
    public ResponseEntity<Response> referralSummary(@RequestHeader("X-REST-SESSION-KEY") String sessionKey, @PathVariable long subscriberId) {
        try {
            return ResponseEntity
                .ok()
                .body(
                    new Response(referralService.referralSummary(subscriberId))
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }
    }      

    /* */
    @GetMapping(REFERRAL_3_TIERS + "/{subscriberId}")
    public ResponseEntity<Response> getAffiliate3TiersTable(@RequestHeader("X-REST-SESSION-KEY") String sessionKey, @PathVariable("subscriberId") String subscriberId) {

        try {
            return ResponseEntity
                .ok()
                .body(
                    new Response(referralService.getAffiliate3TiersTable(subscriberId))
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }
    }    

    @GetMapping(REFERRAL_TRANSACTIONS + "/{nickname}")
    public ResponseEntity<Response> getAffiliateTransactions(@RequestHeader("X-REST-SESSION-KEY") String sessionKey, @PathVariable("nickname") String nickname) {
        try {
            List<ReferralTransactionDTO> transactions = referralService.getReferralTransactionsForTypes(nickname, List.of(CashPoolTransaction2DTO.TYPE.PAYOUT_REFERRAL.toString()));
            return ResponseEntity
                .ok()
                .body(
                    new Response(transactions)
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }

        // List<ReferralTransactionDTO> transactions = getReferralTransactionsForTypes(top.getNickname(), List.of(CashPoolTransaction2DTO.TYPE.PAYOUT_REFERRAL.toString()));
    }

    @GetMapping(REFERRER + "/{nickname}")
    public ResponseEntity<Response> getReferrerProfile(@RequestHeader("X-REST-SESSION-KEY") String sessionKey, @PathVariable("nickname") String nickname) {
        try {
            ReferrerProfileDTO referrerProfile = referralService.getReferrerProfile(nickname);

            if(referrerProfile == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity
                .ok()
                .body(
                    new Response(referrerProfile)
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }

        
    }    // REFERRER_MONTLY_EARNINGS


    @GetMapping(REFERRER_MONTLY_EARNINGS + "/{nickname}")
    public ResponseEntity<Response> getRefferrerMonthlyEarnings(@RequestHeader("X-REST-SESSION-KEY") String sessionKey, @PathVariable("nickname") String nickname) {
        try {
            List<Referral3TiersDTO> earnings = referralService.getAffiliateMonthlyEarnings(nickname);
            return ResponseEntity
                .ok()
                .body(
                    new Response(earnings)
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }

        
    }    

    @GetMapping(REFERRER_YEARLY_EARNINGS + "/{nickname}")
    public ResponseEntity<Response> getRefferrerYearlyEarnings(@RequestHeader("X-REST-SESSION-KEY") String sessionKey, @PathVariable("nickname") String nickname) {
        try {
            List<Referral3TiersDTO> earnings = referralService.getAffiliateYearlyEarnings(nickname);
            return ResponseEntity
                .ok()
                .body(
                    new Response(earnings)
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }
    }   
    
    @GetMapping(REFERRER_GLOBAL_EARNINGS + "/{nickname}")
    public ResponseEntity<Response> getRefferrerGlobalEarnings(@RequestHeader("X-REST-SESSION-KEY") String sessionKey, @PathVariable("nickname") String nickname) {
        try {

            List<Referral3TiersDTO> yearly = referralService.getAffiliateYearlyEarnings(nickname);
            List<Referral3TiersDTO> monthly = referralService.getAffiliateMonthlyEarnings(nickname);

      
            return ResponseEntity
                .ok()
                .body(
                    new Response(new GlobalEarningsDTO(yearly, monthly))
                ); 

        }catch(Exception e) {
            logger.error(GET_REQUEST_NOT_FULFILLED, e);
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);
        }
    }    
}
