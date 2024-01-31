package com.jada.smarthome.controller;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.jada.smarthome.repository.UserRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping("/")
public class AuthController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    HttpSession session;

    @Autowired
    TemplateEngine templateEngine;

    @Autowired
    JavaMailSender mailSender;
    


    @PostMapping("/PwFind/Email")
    @ResponseBody
    public Map<String, Object> Email(@RequestBody Map<String, String> inputdata) throws MessagingException {
        Map<String, Object> response = new HashMap<>();
        Context context = new Context(); 


        try {            
                  
                    // 랜덤 코드 생성
                    String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    int CODE_LENGTH = 8;
                    SecureRandom random = new SecureRandom();
                    StringBuilder result = new StringBuilder(CODE_LENGTH);
                    for (int i = 0; i < CODE_LENGTH; i++) {
                        result.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
                    }
                    // 이메일로 보낼 인증키
                    String key = result.toString();
                    // context파일의 code를 생성한 key값으로 설정
                    context.setVariable("code", key);
                    // PwFindEmailAuth = context 파일 명
                    String text = this.templateEngine.process("JoinEmail", context);
                    // 메일 전송 객체 생성
                    MimeMessage mail = this.mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(mail, "UTF-8");
                    String setToEmail = inputdata.get("EMAIL");
                    // 메일 설정
                    helper.setTo(setToEmail);
                    // 제목
                    helper.setSubject("가입 인증 메일입니다.");
                    helper.setText(text, true);
                    //보내기
                    this.mailSender.send(mail);
                    // 보내는게 성공했다면 해당 키를 반환
                    response.put("AUTHKEY", key);
                    
                    return response;
      
            // 알수없는 이유로 실패
        } catch (Exception e) {
            System.out.println(e);
            return response;
        }

    }

    
}
