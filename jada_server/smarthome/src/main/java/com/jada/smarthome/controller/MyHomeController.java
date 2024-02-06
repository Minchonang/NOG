// package com.jada.smarthome.controller;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Controller;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestMethod;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.ResponseBody;
// import org.springframework.web.bind.annotation.RestController;

// import com.jada.smarthome.model.UsageData;
// import com.jada.smarthome.service.MyHomeService;
// import com.jada.smarthome.service.UserService;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestBody;



// @RestController
// @RequestMapping("/myHome")
// public class MyHomeController {

//     @Autowired
//     private final MyHomeService myHomeService;


//     public MyHomeController(MyHomeService myHomeService) {
//         this.myHomeService = myHomeService;        
//     }

//     @GetMapping("/{id}")
//     public String getMyHome(@PathVariable String id ){
//         System.out.println(id);
//         String loginResult = myHomeService.selectUsageData(id);
//         System.out.println(loginResult);
//         return loginResult;


//     }



// }
