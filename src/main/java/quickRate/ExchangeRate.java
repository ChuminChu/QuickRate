package quickRate;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ExchangeRate(
        @JsonProperty("result") int result,
        @JsonProperty("cur_unit") String curUnit,
        @JsonProperty("ttb") String ttb,
        @JsonProperty("tts") String tts,
        @JsonProperty("deal_bas_r") String dealBasR,
        @JsonProperty("bkpr") String bkpr,
        @JsonProperty("yy_efee_r") String yyEfeeR,
        @JsonProperty("ten_dd_efee_r") String tenDdEfeeR,
        @JsonProperty("kftc_bkpr") String kftcBkpr,
        @JsonProperty("kftc_deal_bas_r") String kftcDealBasR,
        @JsonProperty("cur_nm") String curNm
) {}
