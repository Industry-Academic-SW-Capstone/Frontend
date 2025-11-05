import { Redis } from '@upstash/redis';

// Vercel 환경 변수를 자동으로 읽어 클라이언트를 생성합니다.
export const kv = Redis.fromEnv();