package com.example.springapp.service;

import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.Base64;

@Service
public class EncryptionService {
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";

    public SecretKey generateKeyFromPassword(String password) throws Exception {
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        byte[] key = sha.digest(password.getBytes("UTF-8"));
        return new SecretKeySpec(key, ALGORITHM);
    }

    public void encryptFile(String inputFile, String outputFile, String password) throws Exception {
        SecretKey secretKey = generateKeyFromPassword(password);
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);

        byte[] inputBytes = Files.readAllBytes(Paths.get(inputFile));
        byte[] outputBytes = cipher.doFinal(inputBytes);
        Files.write(Paths.get(outputFile), outputBytes);
    }

    public void decryptFile(String inputFile, String outputFile, String password) throws Exception {
        SecretKey secretKey = generateKeyFromPassword(password);
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, secretKey);

        byte[] inputBytes = Files.readAllBytes(Paths.get(inputFile));
        byte[] outputBytes = cipher.doFinal(inputBytes);
        Files.write(Paths.get(outputFile), outputBytes);
    }

    public byte[] encryptData(byte[] data, String password) throws Exception {
        SecretKey secretKey = generateKeyFromPassword(password);
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        return cipher.doFinal(data);
    }

    public byte[] decryptData(byte[] encryptedData, String password) throws Exception {
        SecretKey secretKey = generateKeyFromPassword(password);
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        return cipher.doFinal(encryptedData);
    }
}