package com.example.springapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final ConcurrentHashMap<String, String> otpStorage = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String generateAndSendOTP(String email) {
        String otp = generateOTP();
        otpStorage.put(email, otp);
        
        // Auto-expire OTP after 5 minutes
        scheduler.schedule(() -> otpStorage.remove(email), 5, TimeUnit.MINUTES);
        
        sendOTPEmail(email, otp);
        return otp;
    }

    public boolean verifyOTP(String email, String otp) {
        String storedOTP = otpStorage.get(email);
        if (storedOTP != null && storedOTP.equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        return false;
    }

    private String generateOTP() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    private void sendOTPEmail(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Digital Lock - OTP Verification");
            message.setText("Your OTP for file access is: " + otp + "\n\nThis OTP will expire in 5 minutes.\n\nDo not share this code with anyone.");
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}