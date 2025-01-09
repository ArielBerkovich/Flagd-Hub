package org.flagd.hub.example.controllers;

import lombok.RequiredArgsConstructor;
import org.flagd.hub.example.services.ClassifiedService;
import org.flagd.hub.example.services.ExampleService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/features")
@RequiredArgsConstructor
public class ExampleController {
    private final ExampleService exampleService;

    @GetMapping("/theme")
    public ResponseEntity<String> getTheme() {
        return ResponseEntity.ok(exampleService.getTheme());
    }

    @GetMapping("/bool-flag")
    public ResponseEntity<Boolean> bool() {
        return ResponseEntity.ok(exampleService.runFeature());
    }
}
