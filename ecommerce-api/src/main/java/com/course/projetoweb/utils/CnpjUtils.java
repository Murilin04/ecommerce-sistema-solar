package com.course.projetoweb.utils;

public class CnpjUtils {
     public static String normalize(String cnpj) {
        if (cnpj == null) return null;
        return cnpj.replaceAll("\\D", "");
    }
}
