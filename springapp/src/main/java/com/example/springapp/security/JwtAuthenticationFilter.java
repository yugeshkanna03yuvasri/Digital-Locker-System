package com.example.springapp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) { this.jwtUtil = jwtUtil; }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // allow public endpoints without token
        String path = request.getRequestURI();
        List<String> publicPaths = List.of("/api/users/signup", "/api/auth/login", "/v3/api-docs", "/swagger-ui");
        return publicPaths.stream().anyMatch(p -> path.equals(p) || path.startsWith(p + "/") );
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.toLowerCase().startsWith("bearer")) {
            String token = header;
            // strip repeated Bearer prefixes (some clients include 'Bearer ' twice)
            token = token.replaceAll("(?i)^bearer\\s+", "");
            token = token.replaceAll("(?i)^bearer\\s+", "");
            try {
                Jws<Claims> claims = jwtUtil.validate(token);
                String username = claims.getBody().getSubject();
                String role = (String) claims.getBody().get("role");
                var auth = new UsernamePasswordAuthenticationToken(new AppUserDetails(username, null, role), null, new AppUserDetails(username, null, role).getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
