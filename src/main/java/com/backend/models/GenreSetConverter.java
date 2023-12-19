package com.backend.models;

import com.opencsv.bean.AbstractBeanField;
import com.opencsv.exceptions.CsvConstraintViolationException;
import com.opencsv.exceptions.CsvDataTypeMismatchException;


import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;


public class GenreSetConverter extends AbstractBeanField<Set<Genre>, String> {
    @Override
    protected Object convert(String s) throws CsvDataTypeMismatchException, CsvConstraintViolationException {
        return Arrays.stream(s.split(","))
                .map(String::trim)
                .map(Genre::valueOf)
                .collect(Collectors.toSet());
    }
}
