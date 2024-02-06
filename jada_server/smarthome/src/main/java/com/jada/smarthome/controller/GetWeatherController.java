package com.jada.smarthome.controller;

import java.net.*;
import java.util.Arrays;
import java.util.List;
import java.io.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/")
public class GetWeatherController {

  private final RestTemplate restTemplate = new RestTemplate();

  @GetMapping("/getWeather")
  public ResponseEntity<String> getWeather(){
    // StringBuilder response = new StringBuilder();
    String apiUrl = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?tm=202402050900&stn=90&help=0&authKey=AYsWy7LpTXGLFsuy6e1xbg";
    ResponseEntity<String> responseEntity = restTemplate.getForEntity(apiUrl, String.class);

    String responseBody = responseEntity.getBody();
    System.out.println(responseBody);

    // TA 필드를 추출하는 예시 코드
    String taValue = extractTAValue(responseBody);
    System.out.println("Temperature (TA): " + taValue);

    return responseEntity;

    // try{
    //   URL url = new URL("https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?tm=202211300900&stn=0&help=2&authKey=AYsWy7LpTXGLFsuy6e1xbg");
    //   HttpURLConnection con = (HttpURLConnection) url.openConnection();
    //   con.setRequestMethod("GET");
    //   con.setRequestProperty("Content-Type", "application/json");

    //   try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
    //       String inputLine;
    //       while ((inputLine = in.readLine()) != null) {
    //           response.append(inputLine);
    //       }
    //   }
    //   // System.out.println(response.toString());
    //         JsonNode jsonNode = objectMapper.readTree(response.toString());
    //         double temperature = jsonNode.path("TA").asDouble();
            
    //         System.out.println("Temperature (TA): " + temperature);
    
    // }catch (IOException e){
    //   e.printStackTrace();

    // }
  
    // return response.toString();

  }
  private String extractTAValue(String data) {
    // 데이터를 라인 단위로 분할
    String[] lines = data.split("\\r?\\n");
    System.out.println("============"+lines);

    for (String line : lines) {
      List<String> tokens = Arrays.asList(line.split("\\s+"));

      // 현재 라인의 리스트의 크기가 충분하다면 14번째 값을 반환
      if (tokens.size() >= 12) {
          return tokens.get(12);
      }
  }
    // for (String line : lines) {
    //   // 공백 또는 탭으로 필드를 분할
    //   List<String> tokens = Arrays.asList(line.split("\\s+"));
    //   System.out.println(tokens);
    //   // TA 필드의 위치를 찾아서 반환
    //   if (tokens.size() >= 12) {
    //       return tokens.get(12);
    //   }
    // }
  return "TA field not found";
}

}
