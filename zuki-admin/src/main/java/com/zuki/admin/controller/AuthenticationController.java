package com.zuki.admin.controller;

import com.zuki.AbstractController;
import com.zuki.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@CrossOrigin(origins = "*", maxAge = 3600,  methods= {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS, RequestMethod.HEAD})
@Controller
@RequestMapping("auth") 

public class AuthenticationController extends AbstractController{ 
    public static final String PING = "ping";

    @GetMapping(PING)
    public ResponseEntity<Response> ping() {

        return ResponseEntity
        .ok()
        .body(
            new Response("PONG")
        ); 

    }
}
