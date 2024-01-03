package com.backend.models;

import com.opencsv.bean.AbstractBeanField;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class StringSetConverter extends AbstractBeanField<Set<String>, String> {
    @Override
    protected Object convert(String s) {
        Set<String> stringSet = new HashSet<>();
        if (s != null && !s.isEmpty()) {
            String[] elements = s.split(",");
            stringSet.addAll(Arrays.asList(elements));
        }
        return stringSet;
    }
}
