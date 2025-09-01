import { API_BASE_URL } from '../config';

export interface NicknameResponse {
  nickname: string;
}

export interface MultipleNicknamesResponse {
  nicknames: string[];
}

export const nicknameApi = {
  async getRandomNickname(): Promise<NicknameResponse> {
    const response = await fetch(`${API_BASE_URL}/nickname/random`);
    if (!response.ok) {
      throw new Error('Failed to fetch random nickname');
    }
    return response.json();
  },

  async getMultipleNicknames(count: number = 5): Promise<MultipleNicknamesResponse> {
    const response = await fetch(`${API_BASE_URL}/nickname/multiple?count=${count}`);
    if (!response.ok) {
      throw new Error('Failed to fetch multiple nicknames');
    }
    return response.json();
  }
};