package com.example.springapp.service;

import com.example.springapp.model.RefreshToken;
import com.example.springapp.model.User;
import com.example.springapp.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository repo;
    private final SecureRandom random = new SecureRandom();

    public RefreshTokenService(RefreshTokenRepository repo) { this.repo = repo; }

    public RefreshToken create(User user, long ttlSeconds) {
        RefreshToken t = new RefreshToken();
        byte[] b = new byte[64];
        random.nextBytes(b);
        t.setToken(Base64.getUrlEncoder().withoutPadding().encodeToString(b));
        t.setUser(user);
        t.setExpiresAt(Instant.now().plusSeconds(ttlSeconds));
        t.setRevoked(false);
        return repo.save(t);
    }

    public Optional<RefreshToken> findByToken(String token) { return repo.findByTokenAndRevokedFalse(token); }

    /**
     * Rotate a refresh token: revoke the old one and create a new one for the same user
     */
    public RefreshToken rotate(RefreshToken old, long ttlSeconds) {
        old.setRevoked(true);
        repo.save(old);
        return create(old.getUser(), ttlSeconds);
    }

    public void revokeByUser(User user) {
        // mark all tokens for this user as revoked
        repo.findAll().stream().filter(t -> t.getUser().getId().equals(user.getId())).forEach(t -> { t.setRevoked(true); repo.save(t); });
    }

    public void revokeToken(RefreshToken token) { token.setRevoked(true); repo.save(token); }
}
