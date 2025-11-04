import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { StockInfo, BasicStockInfo } from '@/lib/types';
import { generateLogo } from '../utils';

// 환경변수에서 API base URL을 읽음
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// API 호출 함수 (확장성 고려, 추후 파라미터 추가 가능)
async function fetchTopStocks(params?: Record<string, any>): Promise<StockInfo[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE_URL}/api/stocks/amount${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch top stocks');
  return res.json();
}

// StockInfo[] → BasicStockInfo[] 변환
function mapStockInfoToBasic(stocks: StockInfo[]): BasicStockInfo[] {
  return stocks.map(stock => ({
    ticker: stock.stock_code,
    name: stock.stock_name,
    price: stock.current_price,
    changePercent: Number(stock.change_rate),
    logo: generateLogo(stock.stock_code, stock.stock_name), // 로고 경로 규칙에 맞게 수정 필요
  }));
}

/**
 * 상위 주식 정보를 가져오는 커스텀 훅
 * @param params API 파라미터 (확장성 고려)
 */
export function useTopStocks(params?: Record<string, any>) {
  const { data, isLoading, isError, refetch } = useQuery<StockInfo[]>({
    queryKey: ['topStocks', params],
    queryFn: () => fetchTopStocks(params),
  });

  // 변환된 데이터 제공
  const stocks = useMemo(() => (data ? mapStockInfoToBasic(data) : []), [data]);

  return {
    stocks,
    isLoading,
    isError,
    refetch,
    raw: data, // 필요시 원본 데이터도 제공
  };
}
