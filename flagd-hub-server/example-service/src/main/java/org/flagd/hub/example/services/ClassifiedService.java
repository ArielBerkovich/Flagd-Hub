package org.flagd.hub.example.services;

import org.springframework.stereotype.Service;


@Service
//@Classified
public class ClassifiedService {
    public String getTheme() {
        return "classified!";
    }
}
