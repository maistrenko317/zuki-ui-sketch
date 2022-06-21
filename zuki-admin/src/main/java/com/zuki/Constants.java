package com.zuki;

public class Constants {
    public static final String SUPERUSER = "SUPERUSER";
    public static final String ADMIN = "ADMIN";
    public static final String GAME_ADMIN = "GAME_ADMIN";
    public static final String SHOUTCASTER = "SHOUTCASTER";
    public static final String PAYOUT_MODEL = "PAYOUT_MODEL";
    public static final String AFFILIATE = "AFFILIATE";
    public static final String SPONSOR = "SPONSOR";
    public static final String ROLE_SETTER = "ROLE_SETTER";
    public static final String X_REST_SESSION_KEY = "X-REST-SESSION-KEY";

}
//    // Ochirilshi kerak
//    @Test
//    @Order(4)
//    public void getIneligibleSubscribers() throws Exception {
//        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching SubscriberResponse info");
//        Subscriber entity = MockClient.get(
//                mvc,
//                "/subscriber/ineligible",
//                SubscriberResponse.class,
//                MockMvcResultMatchers.status().isOk(),
//                Map.of()
//        ).getEntity();
//
//        logger.debug(BaseTest.getCurrentMethodName() + "->" + entity.getPhotoUrl());
//        assertTrue(entity.getNickname().length() > 0);
//
//    }
//
//
//    @Test
//    @Order(5)
//    public void deleteIneligibleSubscribers() throws Exception {
//        long subscriberId = 23; //TODO: Make this constant configurable.
//        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching SubscriberResponse info");
//
//        MockClient.delete(
//                mvc,
//                "/subscriber/ineligible/" + subscriberId,
//                MockMvcResultMatchers.status().isOk(),
//                Map.of()
//        );
//        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching SubscriberResponse info");
//        Subscriber entity = MockClient.get(
//                mvc,
//                "/subscriber/" + subscriberId,
//                SubscriberResponse.class,
//                MockMvcResultMatchers.status().isOk(),
//                Map.of()
//        ).getEntity();
//
//        logger.debug(BaseTest.getCurrentMethodName() + "->" + entity.getPhotoUrl());
//        assertFalse(entity.getNickname().length() > 0);
//
//    }
