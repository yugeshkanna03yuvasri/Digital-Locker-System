package com.example.springapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.profiles.active=test")
class SpringappApplicationTests {

	@Test
	void contextLoads() {
	}

}
