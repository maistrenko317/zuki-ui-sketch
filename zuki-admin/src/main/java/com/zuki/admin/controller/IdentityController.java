package com.zuki.admin.controller;


import java.util.List;
import java.util.Map;

import com.zuki.AbstractController;
import com.zuki.Constants;
import com.zuki.Response;
import com.zuki.ZukiException;
import com.zuki.ZukiLambdaException;
import com.zuki.admin.service.IdentityService;
import com.zuki.admin.service.ReferralService;
import com.zuki.model.subscriber.IneligibleSubscriber;
import com.zuki.model.subscriber.Subscriber;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@CrossOrigin(origins = "*", maxAge = 3600,  methods= {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS, RequestMethod.HEAD})
@Controller
@RequestMapping("subscriber") 

public class IdentityController extends AbstractController{
    public static final String SUBSCRIBER_ID = "subscriberId";
    public static final String INELIGIBLE = "ineligible";
    @Autowired
    IdentityService identityService;

    @GetMapping('{'+SUBSCRIBER_ID+'}')
    public ResponseEntity<Response> getSubscriberById(@PathVariable("subscriberId") String idOrNickName) {

        try {
            Subscriber subscriber = identityService.getSubscriber(idOrNickName);
            if(subscriber == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response(Map.of()));
            }
            return ResponseEntity
                .ok()
                .body(
                    new Response(subscriber)
                ); 

        }catch(ZukiException | ZukiLambdaException e) {
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }        
    }

    @GetMapping(INELIGIBLE)
    public ResponseEntity<Response> getIneligibleSubscribers() {
        try {
           
            return ResponseEntity
                .ok()
                .body(
                    new Response(identityService.getIneligibleSubscribers())
                ); 

        }catch(ZukiException | ZukiLambdaException e) {
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }            
    }

    @PostMapping(path=INELIGIBLE,  consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response> insertIneligibleSubscribers(IneligibleSubscriber ineligibleSubscriber) {
        try {
            return ResponseEntity
                .ok()
                .body(
                    new Response(identityService.insertIneligibleSubscriber(ineligibleSubscriber))
                ); 

        }catch(ZukiException | ZukiLambdaException e) {
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }         
    }

    @DeleteMapping(INELIGIBLE + "/{" + SUBSCRIBER_ID + '}')
    public ResponseEntity<Response> deleteIneligibleSubscribers(@PathVariable(SUBSCRIBER_ID) Integer subscriberId) {
        try {
            IneligibleSubscriber ineligibleSubscriber = new IneligibleSubscriber(subscriberId);
            List<IneligibleSubscriber> ineligibleSubscribers = identityService.deleteIneligibleSubscriber(ineligibleSubscriber);
            new Response(identityService.deleteIneligibleSubscriber(ineligibleSubscriber));
            return ResponseEntity
                .ok()
                .body(
                    new Response(identityService.deleteIneligibleSubscriber(ineligibleSubscriber))
                ); 

        }catch(ZukiException | ZukiLambdaException e) {
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);       
        }         
    }    
}
