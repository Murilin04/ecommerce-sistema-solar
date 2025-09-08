package com.course.projetoweb.config;

import java.time.Instant;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.course.projetoweb.entities.Category;
import com.course.projetoweb.entities.Order;
import com.course.projetoweb.entities.OrderItem;
import com.course.projetoweb.entities.Payment;
import com.course.projetoweb.entities.Product;
import com.course.projetoweb.entities.Integrador;
import com.course.projetoweb.entities.enums.OrderStatus;
import com.course.projetoweb.repositories.CategoryRepository;
import com.course.projetoweb.repositories.OrderItemRepository;
import com.course.projetoweb.repositories.OrderRepository;
import com.course.projetoweb.repositories.ProductRepository;
import com.course.projetoweb.repositories.IntegradorRepository;

// @Configuration
// @Profile("test")
// public class TestConfig implements CommandLineRunner {

//     @Autowired
//     private IntegradorRepository userRepository;

//     @Autowired
//     private OrderRepository orderRepository;

//     @Autowired
//     private CategoryRepository categoryRepository;

//     @Autowired
//     private ProductRepository productRepository;

//     @Autowired
//     private OrderItemRepository orderItemRepository;

//     @Override
//     public void run(String... args) throws Exception {

//         Category cat1 = new Category(null, "Electronics");
//         Category cat2 = new Category(null, "Books");
//         Category cat3 = new Category(null, "Computers");

//         Product p1 = new Product(null, "The Lord of the Rings", "Lorem ipsum dolor sit amet, consectetur.", 90.5, "");
//         Product p2 = new Product(null, "Smart TV", "Nulla eu imperdiet purus. Maecenas ante.", 2190.0, "");
//         Product p3 = new Product(null, "Macbook Pro", "Nam eleifend maximus tortor, at mollis.", 1250.0, "");
//         Product p4 = new Product(null, "PC Gamer", "Donec aliquet odio ac rhoncus cursus.", 1200.0, "");
//         Product p5 = new Product(null, "Rails for Dummies", "Cras fringilla convallis sem vel faucibus.", 100.99, "");

//         categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3));
//         productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));

//         p1.getCategories().add(cat2);
//         p2.getCategories().add(cat1);
//         p2.getCategories().add(cat3);
//         p3.getCategories().add(cat3);
//         p4.getCategories().add(cat3);
//         p5.getCategories().add(cat2);

//         productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));

//         // Integrador u1 = new Integrador(null, "Maria Brown", "maria@gmail.com", "988888888", "123456");
//         // Integrador u2 = new Integrador(null, "Alex Green", "alex@gmail.com", "977777777", "123456");

//         // Order o1 = new Order(null, Instant.parse("2019-06-20T19:53:07Z"), OrderStatus.PAID, u1);
//         // Order o2 = new Order(null, Instant.parse("2019-07-21T03:42:10Z"), OrderStatus.WAITING_PAYMENT, u2);
//         // Order o3 = new Order(null, Instant.parse("2019-07-22T15:21:22Z"), OrderStatus.WAITING_PAYMENT, u1);

//         // userRepository.saveAll(Arrays.asList(u1, u2));
//         // orderRepository.saveAll(Arrays.asList(o1, o2, o3));

//         // OrderItem oi1 = new OrderItem(o1, p1, 2, p1.getPrice());
//         // OrderItem oi2 = new OrderItem(o1, p3, 1, p3.getPrice());
//         // OrderItem oi3 = new OrderItem(o2, p3, 2, p3.getPrice());
//         // OrderItem oi4 = new OrderItem(o3, p5, 2, p5.getPrice());
        
//         // orderItemRepository.saveAll(Arrays.asList(oi1, oi2, oi3, oi4));

//         // Payment pay1 = new Payment(null, Instant.parse("2019-06-20T19:53:07Z"), o1);
//         // o1.setPayment(pay1);

//         // orderRepository.save(o1);

//     }

// }
