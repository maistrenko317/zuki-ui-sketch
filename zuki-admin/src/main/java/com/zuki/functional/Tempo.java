package com.zuki.functional;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.CharSet;

public class Tempo {
    private static SimpleDateFormat ISO_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    private static SimpleDateFormat SHORT_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
    public static LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    public static LocalDateTime toLocalDateTime(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }    

    public static ZonedDateTime toZonedDateTime(Date date) {
        return  date.toInstant().atZone(ZoneId.systemDefault());
    }

    public static Date firstDateOfMonth(Date pivotDate) {        
        Calendar calendar = Calendar.getInstance();

        calendar.setTime(pivotDate);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        return calendar.getTime();
    }

    public static Date lastDateOfMonth(Date pivotDate) {
        Calendar calendar = Calendar.getInstance();

        calendar.setTime(pivotDate);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        return calendar.getTime();
    }

    public static String encodeDate(Date date) {
        return SHORT_FORMAT.format(date);
    }

    public static String urlEncodeDate(Date date) throws UnsupportedEncodingException {
        return URLEncoder.encode(encodeDate(date), "UTF-8");
    }    
}
