package com.zuki;

import java.io.IOException;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zuki.functional.BeanEncode;

import org.apache.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class MockClient {
    static final Logger logger = Logger.getLogger(MockClient.class);
    
    private static MockHttpServletRequestBuilder withHeaders(MockHttpServletRequestBuilder requestBuilder,  Map<String,String> headers) {
        if(headers != null) {
            headers.entrySet().forEach(entry -> {
                requestBuilder.header(entry.getKey(), entry.getValue());
            });   
        }
        return requestBuilder;
    }
    
    public static <T> String post(MockMvc mvc, String url, T object, ResultMatcher resultMatcher, Map<String,String> headers) throws Exception {

        MvcResult result = mvc.perform(
            withHeaders(MockMvcRequestBuilders.post(url), headers)
            .content(mapToJson(object))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(resultMatcher)
        .andReturn();     
        
        String content = result.getResponse().getContentAsString();
        return content;
    }

    public static <T,R> R post(MockMvc mvc, String url, T object, Class<R> clazz, ResultMatcher resultMatcher, Map<String,String> headers) throws Exception{

        MvcResult result = mvc.perform(
            withHeaders(MockMvcRequestBuilders.post(url), headers)
            .content(mapToJson(object))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(resultMatcher)
        .andReturn();     
        
        String content = result.getResponse().getContentAsString();
        if(content != null &&content.length() > 0)
            return (R) mapFromJson(result.getResponse().getContentAsString(), clazz);
        return null;
    }

    public static <T,R> R post(MockMvc mvc, String url, T object, Class<R> clazz, ResultMatcher resultMatcher) throws JsonProcessingException, Exception {
        return post(mvc, url, object, clazz, resultMatcher, Map.of());
    }

    public static <T,R> R postUrlEncoded(MockMvc mvc, String url, String content, Class<R> clazz, ResultMatcher resultMatcher, Map<String,String> headers) throws Exception{

        MvcResult result = mvc.perform(
            withHeaders(MockMvcRequestBuilders.post(url), headers)
            .content(content)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(resultMatcher)
        .andReturn();     
        
        String response = result.getResponse().getContentAsString();
        if(response != null &&response.length() > 0)
            return (R) mapFromJson(response, clazz);
        return null;
    }

    public static <T,R> R postUrlEncoded(MockMvc mvc, String url, T object, Class<R> clazz, ResultMatcher resultMatcher, Map<String,String> headers) throws Exception{
        String content = BeanEncode.toURLEncoded(object);
        logger.debug(content);
        return postUrlEncoded(mvc, url, content, clazz, resultMatcher, headers);
    }

    public static <T,R> R put(MockMvc mvc, String url, T object, Class<R> clazz, ResultMatcher resultMatcher, Map<String,String> headers) throws JsonProcessingException, Exception {
        MvcResult result = mvc.perform(
            withHeaders(MockMvcRequestBuilders.put(url), headers)
            .content(mapToJson(object))
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(resultMatcher)
        .andReturn();     
        
        return (R) mapFromJson(result.getResponse().getContentAsString(), clazz);
    }

    
    public static <T,R> R put(MockMvc mvc, String url, T object, Class<R> clazz, ResultMatcher resultMatcher) throws JsonProcessingException, Exception {
        return put(mvc, url, object, clazz, resultMatcher, Map.of());
    }

    public static void delete(MockMvc mvc, String url, ResultMatcher expected, Map<String,String> headers) throws Exception {
        mvc.perform(withHeaders(MockMvcRequestBuilders.delete(url), headers))
            .andExpect(expected)
            .andReturn();        
    }

    public static String getText(MockMvc mvc, String url, Map<String,String> headers, ResultMatcher resultMatcher) throws Exception {
        MvcResult result = mvc.perform(
            withHeaders(MockMvcRequestBuilders.get(url), headers)
            .accept(MediaType.TEXT_PLAIN)
        )        
        .andExpect(resultMatcher)
        .andReturn();     
        
        return result.getResponse().getContentAsString();
    }    

    public static <R> R get(MockMvc mvc, String url, Class<R> clazz, ResultMatcher resultMatcher,  Map<String,String> headers) throws Exception {
        MvcResult result = mvc.perform(
            withHeaders(MockMvcRequestBuilders.get(url), headers)
            .accept(MediaType.APPLICATION_JSON)
        )        
        .andExpect(resultMatcher)
        .andReturn();     
        
        return (R) mapFromJson(result.getResponse().getContentAsString(), clazz);
    }       

    public static String mapToJson(Object obj) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(obj);
     }

     public static <T> T mapFromJson(String json, Class<T> clazz)
        throws JsonParseException, JsonMappingException, IOException {
        
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, clazz);
     }       
}
