package com.zuki.functional;

import java.lang.reflect.InvocationTargetException;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.log4j.Logger;

import com.zuki.ZukiException;

public class Clone {
    private static Logger logger = Logger.getLogger(Clone.class);

    @SuppressWarnings("unchecked")
    public static final <T> T clone(T bean) throws ZukiException {
        try {
            return (T) BeanUtils.cloneBean(bean);
        } catch (IllegalAccessException | InstantiationException | InvocationTargetException| NoSuchMethodException cause) {
            throw new ZukiException("Can't clone bean.", cause, logger);
        }
    }
}
