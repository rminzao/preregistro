const API_BASE_URL = 'https://pre-registro.evotank.com.br/api';

export interface ApiPlayer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  invite_code: string;
  referrer_code?: string;
  points: number;
  email_verified: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface RankingData {
  total_players: number;
  total_invites: number;
  conversion_rate: number;
  top_players: Array<{
    position: number;
    name: string;
    points: number;
    email_verified: boolean;
  }>;
}

export async function registerPlayer(playerData: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  referrerCode?: string;
}): Promise<ApiResponse<ApiPlayer>> {
  const response = await fetch(`${API_BASE_URL}/preregister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name: playerData.name,
      email: playerData.email,
      phone_number: playerData.phoneNumber,
      password: playerData.password,
      referrer_code: playerData.referrerCode,
    }),
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || `HTTP ${response.status}`);
  }
  return payload as ApiResponse<ApiPlayer>;
}

export async function fetchRankingData(): Promise<RankingData> {
  const response = await fetch(`${API_BASE_URL}/ranking`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function testApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/test`, { cache: 'no-store' });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export type FrontPlayer = ReturnType<typeof convertApiPlayerToFrontend>;

export function convertApiPlayerToFrontend(apiPlayer: ApiPlayer) {
  return {
    id: apiPlayer.id.toString(),
    name: apiPlayer.name,
    email: apiPlayer.email,
    phoneNumber: apiPlayer.phone_number,
    inviteCode: apiPlayer.invite_code,
    referrerCode: apiPlayer.referrer_code,
    referrerName: undefined,
    points: apiPlayer.points,
    emailVerified: apiPlayer.email_verified,
    createdAt: new Date(apiPlayer.created_at),
  };
}

export async function getPlayerByInvite(invite: string): Promise<ApiResponse<ApiPlayer>> {
  const res = await fetch(`${API_BASE_URL}/player/by-invite/${invite}`, {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json as ApiResponse<ApiPlayer>;
}

//login
export async function login(email: string, password: string): Promise<ApiResponse<ApiPlayer>> {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
  return json as ApiResponse<ApiPlayer>;
}

