// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';

export default function Home() {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [amount, setAmount] = useState('');
    const [targetCurrency, setTargetCurrency] = useState('');
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // API에서 환율 정보 불러오기
    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:8080/api/exchange/rates');
                const data = await res.json();
                setExchangeRates(data);
                // 기본 선택 통화 설정 (목록의 첫번째 통화)
                if (data.length > 0) {
                    setTargetCurrency(data[0].cur_unit);
                }
            } catch (error) {
                console.error('환율 정보를 불러오는 중 에러 발생:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRates();
    }, []);

    // 금액 또는 선택한 통화가 변경되면 환산 결과 계산
    useEffect(() => {
        if (amount && targetCurrency) {
            const rateObj = exchangeRates.find(
                (rate) => rate.cur_unit === targetCurrency
            );
            if (rateObj && rateObj.deal_bas_r) {
                const rateNumber = parseFloat(rateObj.deal_bas_r.replace(/,/g, ''));
                setConvertedAmount(parseFloat(amount) / rateNumber);
            }
        } else {
            setConvertedAmount(null);
        }
    }, [amount, targetCurrency, exchangeRates]);

    return (
        <div className="container">
            <h1>실시간 환율 정보 & 환율 계산기</h1>
            <div className="converter-card">
                <h2>환율 계산기</h2>
                <div className="input-group">
                    <label htmlFor="amount">KRW (원화):</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="금액을 입력하세요"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="currency">변환 통화:</label>
                    <select
                        id="currency"
                        value={targetCurrency}
                        onChange={(e) => setTargetCurrency(e.target.value)}
                    >
                        {exchangeRates.map((rate, index) => (
                            <option key={index} value={rate.cur_unit}>
                                {rate.cur_nm} ({rate.cur_unit})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="result">
                    {convertedAmount !== null && (
                        <p>
                            {amount} KRW = {convertedAmount.toFixed(2)} {targetCurrency}
                        </p>
                    )}
                </div>
            </div>

            <div className="table-section">
                <h2>환율 목록</h2>
                {loading ? (
                    <p>환율 정보를 불러오는 중...</p>
                ) : (
                    <div className="table-container">
                        <table className="rates-table">
                            <thead>
                            <tr>
                                <th className="center">통화 코드</th>
                                <th className="center">통화명</th>
                                <th className="right">
                                    전신환(송금)
                                    <br />
                                    받으실때
                                </th>
                                <th className="right">
                                    전신환(송금)
                                    <br />
                                    보내실때
                                </th>
                                <th className="right">매매 기준율</th>
                                <th className="right">장부가격</th>
                                <th className="right">년환가료율</th>
                                <th className="right">10일환가료율</th>
                                <th className="right">서울외국환중개 매매기준율</th>
                                <th className="right">KFTC 매매 기준율</th>
                            </tr>
                            </thead>
                            <tbody>
                            {exchangeRates.map((rate, index) => (
                                <tr key={index}>
                                    <td className="center">{rate.cur_unit}</td>
                                    <td className="center">{rate.cur_nm}</td>
                                    <td className="right">{rate.ttb}</td>
                                    <td className="right">{rate.tts}</td>
                                    <td className="right">{rate.deal_bas_r}</td>
                                    <td className="right">{rate.bkpr}</td>
                                    <td className="right">{rate.yy_efee_r}</td>
                                    <td className="right">{rate.ten_dd_efee_r}</td>
                                    <td className="right">{rate.kftc_bkpr}</td>
                                    <td className="right">{rate.kftc_deal_bas_r}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
        }
        h1 {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
          font-size: 2rem;
        }
        .converter-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 40px;
        }
        .converter-card h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #555;
        }
        .input-group {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        .input-group label {
          width: 150px;
          margin-right: 10px;
          font-weight: bold;
          color: #555;
        }
        .input-group input,
        .input-group select {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1em;
        }
        .result p {
          font-size: 1.2em;
          font-weight: bold;
          text-align: center;
          margin: 0;
          padding: 10px 0;
          color: #0070c9;
        }
        .table-section h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }
        .table-container {
          overflow-x: auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .rates-table {
          width: 100%;
          border-collapse: collapse;
        }
        .rates-table th,
        .rates-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e0e0e0;
        }
        .rates-table th {
          background-color: #f0f0f0;
          font-weight: 600;
          color: #555;
        }
        .center {
          text-align: center;
        }
        .right {
          text-align: right;
        }
        .rates-table tr:hover {
          background-color: #f9f9f9;
        }
        @media (max-width: 768px) {
          .input-group {
            flex-direction: column;
            align-items: flex-start;
          }
          .input-group label {
            width: auto;
            margin-bottom: 5px;
          }
          .rates-table th,
          .rates-table td {
            padding: 8px 10px;
          }
        }
      `}</style>
        </div>
    );
}
