package org.flagd.hub.config.server.controllers;

import org.flagd.hub.config.server.security.JwtUtil;
import org.flagd.hub.rest.api.AuthApi;
import org.flagd.hub.rest.model.Login200Response;
import org.flagd.hub.rest.model.LoginRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;

@Controller
public class AuthController implements AuthApi {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public ResponseEntity<Login200Response> login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            String token = JwtUtil.generateToken(loginRequest.getUsername());
            Login200Response login200Response = new Login200Response().token(token);

            return ResponseEntity.ok(login200Response);
        }
        catch (Exception exception){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
