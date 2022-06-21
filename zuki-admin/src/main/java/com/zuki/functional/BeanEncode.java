package com.zuki.functional;

import java.beans.PropertyDescriptor;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.log4j.Logger;
import org.javatuples.Pair;

import com.zuki.ZukiLambdaException;

public class BeanEncode {
    static Logger logger = Logger.getLogger(BeanEncode.class);
    private static String DEFAULT_CHAR_SET = StandardCharsets.UTF_8.toString();

    private static String encodeValue(String value) {
        try {
            return URLEncoder.encode(value, DEFAULT_CHAR_SET);
        } catch (UnsupportedEncodingException e) {
            throw new ZukiLambdaException("Can't encode string", e);
        }
    }

    private static String propertyToString(PropertyDescriptor descriptor, Object object) {
        Object value;
        try {
            value = descriptor.getReadMethod().invoke(object);
            return value == null ? null : value.toString();
        } catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
            throw new ZukiLambdaException("Can't fetch property value", e);
        }
        
    }

    public static final String toURLEncoded(Object bean) {
        PropertyDescriptor[] descriptors = PropertyUtils.getPropertyDescriptors(bean);
        StringBuilder content = Arrays
            .stream(descriptors)
            .map(descriptor -> new Pair<String, String>(descriptor.getName(), propertyToString(descriptor, bean)))
            .filter(pair -> pair.getValue1() != null)
            .reduce(
                new StringBuilder(),
                (builder, pair) -> 
                    builder
                        .append(pair.getValue0())
                        .append('=')
                        .append( encodeValue(pair.getValue1()))
                        .append('&')
                ,
                (builder1, builder2) -> builder1
            );

        if(content.length() > 0) {
            content.deleteCharAt(content.length()-1);
        }
        return content.toString();
    }
}
