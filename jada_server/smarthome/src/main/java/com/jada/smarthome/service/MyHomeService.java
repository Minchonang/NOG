// package com.jada.smarthome.service;



// import java.util.List;
// import java.util.Optional;

// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;

// import com.jada.smarthome.dto.JoinUserDto;
// import com.jada.smarthome.model.UsageData;
// import com.jada.smarthome.repository.UsageDataRepository;


// @Service
// public class MyHomeService {

//    private final UsageDataRepository usageDataRepository;


//    public MyHomeService(UsageDataRepository usageDataRepository) {
//         this.usageDataRepository = usageDataRepository;
//     }

//     public String selectUsageData(String id) {
//         List<UsageData> data = usageDataRepository.findByUserId(null);
//         return String.valueOf(data.size());
// }
// }
