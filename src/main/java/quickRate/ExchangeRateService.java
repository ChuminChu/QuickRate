package quickRate;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;

@Service
public class ExchangeRateService {

    @Value("https://www.koreaexim.go.kr/site/program/financial/exchangeJSON")
    private String apiUrl;

    @Value("ZbGNeK7FKh31bt1riZvIDzfq3cfdYbVJ")
    private String apiKey;

    private final RestTemplate restTemplate;

    public ExchangeRateService() {
        this.restTemplate = new RestTemplate();
    }

    public List<ExchangeRate> getExchangeRates(String searchDate) {
        // data 파라미터: AP01은 환율 정보 요청을 의미 (필수)
        String dataType = "AP01";

        // UriComponentsBuilder를 사용하여 URL에 쿼리 파라미터 추가
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("authkey", apiKey)    // 인증키
                .queryParam("data", dataType);    // API 타입

        // searchDate가 제공되면 파라미터에 추가
        if (searchDate != null && !searchDate.isEmpty()) {
            builder.queryParam("searchdate", searchDate);
        }

        String requestUrl = builder.toUriString();

        // API 호출 및 JSON 배열을 ExchangeRate[]로 매핑
        ResponseEntity<ExchangeRate[]> response = restTemplate.getForEntity(requestUrl, ExchangeRate[].class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return Arrays.asList(response.getBody());
        } else {
            throw new RuntimeException("API 호출 실패: " + response.getStatusCode());
        }
    }
}



