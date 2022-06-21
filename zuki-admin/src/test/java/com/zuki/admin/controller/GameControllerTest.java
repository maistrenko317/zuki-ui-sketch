package com.zuki.admin.controller;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.zuki.BaseControllerTest;
import com.zuki.BaseTest;
import com.zuki.MockClient;
import com.zuki.client.GameDTOListResponse;
import com.zuki.dto.GameDTO;
import com.zuki.functional.Tempo;

public class GameControllerTest  extends BaseControllerTest {
    static Logger logger = Logger.getLogger(GameControllerTest.class);

    @Test
    public void getGamesInMonth() throws Exception {
        String methodName = getCurrentMethodName();
        String encodedPivotDate = Tempo.urlEncodeDate(new Date());
        logger.debug(BaseTest.getCurrentMethodName() + "-> Fetching games for " + encodedPivotDate);

        List<GameDTO> list = MockClient.get(
            mvc, 
            "/game/in-month?pivot-date=" + encodedPivotDate,
            GameDTOListResponse.class,
            MockMvcResultMatchers.status().isOk(),
            Map.of()
        ).getEntity();   

        assertTrue(list.size() > 0);
        assertNotNull(list.iterator().next().getPhotoUrl());
        
        logger.debug(String.format("%s -> Retrieved all games", methodName));
    }

}
