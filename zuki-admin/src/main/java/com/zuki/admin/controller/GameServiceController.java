package com.zuki.admin.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.zuki.AbstractController;
import com.zuki.Response;
import com.zuki.ZukiException;
import com.zuki.admin.service.GameService;

@CrossOrigin(origins = "*", maxAge = 3600, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS, RequestMethod.HEAD})
@Controller
@RequestMapping("game")
public class GameServiceController extends AbstractController {
    public static final String CURRENT_MONTH = "in-month";
    public static final String PIVOT_DATE = "pivot-date";

    @Autowired
    GameService gameService;

    @GetMapping(CURRENT_MONTH)
    public ResponseEntity<Response> getGamesInMonth(
            @RequestParam(PIVOT_DATE)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date pivotDate
    ) {

        try {
            return ResponseEntity
                    .ok()
                    .body(
                            new Response(gameService.getGamesInMonth(pivotDate))
                    );

        } catch (ZukiException e) {
            return reportException(e, null, GET_REQUEST_NOT_FULFILLED);
        }
    }
}
