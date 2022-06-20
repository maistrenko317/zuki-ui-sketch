package com.zuki.admin.controller;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;

import com.zuki.BaseControllerTest;
import com.zuki.BaseTest;
import com.zuki.MockClient;
import com.zuki.Response;
import com.zuki.client.IneligibleSubscriberList;
import com.zuki.client.IneligibleSubscriberListResponse;
import com.zuki.client.SubscriberResponse;
import com.zuki.model.subscriber.IneligibleSubscriber;
import com.zuki.model.subscriber.Subscriber;

import org.apache.log4j.Logger;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

public class IdentityControllerTest extends BaseControllerTest {
    static Logger logger = Logger.getLogger(IdentityControllerTest.class);

    @Test
    @Order(1)
    public void getSubscriberById() throws Exception {
        long subscriberId = 23; //TODO: Make this constant configurable.
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching SubscriberResponse info");
        Subscriber entity = MockClient.get(
                mvc,
                "/subscriber/" + subscriberId,
                SubscriberResponse.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        ).getEntity();

        logger.debug(BaseTest.getCurrentMethodName() + "->" + entity.getPhotoUrl());
        assertTrue(entity.getNickname().length() > 0);
    }

    @Test
    @Order(2)
    public void getSubscriberByNickname() throws Exception {
        String nickname = "InterstellarCowboy"; //TODO: Make this constant configurable.
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching SubscriberResponse info");
        Subscriber entity = MockClient.get(
                mvc,
                "/subscriber/" + nickname,
                SubscriberResponse.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        ).getEntity();

        logger.debug(BaseTest.getCurrentMethodName() + "->" + entity.getPhotoUrl());
        assertTrue(entity.getNickname().length() > 0);
    }


    @Test
    @Order(3)
    public void insertIneligibleSubscriber() throws Exception {
        String email = "rafa.alexandri@gmail.com";//TODO: Make this constant configurable.

        IneligibleSubscriberList list = MockClient.postUrlEncoded(
                mvc,
                "/subscriber/ineligible",
                new IneligibleSubscriber(email, "EMPLOYEE"),
                IneligibleSubscriberListResponse.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        ).getEntity();

        assertTrue(list.size() > 0);
        IneligibleSubscriber doomed = list.iterator().next();
        int id = doomed.getIsId();
        int size = list.size();

        logger.debug(String.format("%s-> resulting list has %d elements. Last id %d ", getCurrentMethodName(), list.size(), id));

        MockClient.delete(
                mvc,
                "/subscriber/ineligible/" + id,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        );

        list = MockClient.get(
                mvc,
                "/subscriber/ineligible",
                IneligibleSubscriberListResponse.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        ).getEntity();


        logger.debug(String.format("%s-> resulting list has %d elements", getCurrentMethodName(), list.size()));
        assertTrue(list.size() < size);
    }

    @Test
    @Order(4)
    public void getineligibleSubscribers() throws Exception {
        logger.debug(BaseTest.getCurrentMethodName() + "->" +
                "Fetching SubscriberResponse info");
        Subscriber entity = MockClient.get(
                mvc, "subscriber/ineligible",
                SubscriberResponse.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        ).getEntity();

        logger.debug(BaseTest.getCurrentMethodName() + "->" +
                entity.getPhotoUrl());

        assertTrue(entity.getNickname().length() > 0);
    }

    @Test
    @Order(5)
    public void deleteIneligibleSubscribers() throws Exception {
        long subscriberId = 10;
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching SubscriberResponse info");

        MockClient.delete(
                mvc,
                "/subscriber/ineligible/" + subscriberId,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        );
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching SubscriberResponse info");
        Subscriber entity = MockClient.get(
                mvc,
                "/subscriber/" + subscriberId,
                SubscriberResponse.class,
                MockMvcResultMatchers.status().isOk(),
                Map.of()
        ).getEntity();

        logger.debug(BaseTest.getCurrentMethodName() + "->" + entity.getPhotoUrl());
        assertFalse(entity.getNickname().length() > 0);

    }
}
