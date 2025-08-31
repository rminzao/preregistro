// src/services/api.ts
// API CLIENT PARA INTEGRAÇÃO COM BACKEND LARAVEL

import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Backend Laravel
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para logs (desenvolvimento)
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// =============================================
// TIPOS/INTERFACES
// =============================================

export interface PreRegistroData {
  nickname: string;
  email: string;
  celular: string;
  senha: string;
  referrer_code?: string;
}

export interface PreRegistroResponse {
  message: string;
  invite_code: string;
}

export interface RankingItem {
  name: string;
  invite_code: string;
  points: number;
}

export interface WhatsAppOtpData {
  email: string;
  phone: string; // formato: +5511999999999
}

export interface WhatsAppVerifyData {
  email: string;
  otp: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// =============================================
// CLASSE PRINCIPAL DA API
// =============================================

export class PreRegistroAPI {
  
  // Testar conexão com API
  static async testConnection(): Promise<boolean> {
    try {
      const response = await api.get('/test');
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao conectar com API:', error);
      return false;
    }
  }

  // Fazer pré-registro
  static async register(data: PreRegistroData): Promise<PreRegistroResponse> {
    try {
      const response = await api.post('/preregister', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer pré-registro';
      throw new Error(message);
    }
  }

  // Buscar ranking
  static async getRanking(): Promise<RankingItem[]> {
    try {
      const response = await api.get('/ranking');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao carregar ranking:', error);
      throw new Error('Erro ao carregar ranking');
    }
  }

  // Enviar código WhatsApp (opcional)
  static async sendWhatsAppOtp(data: WhatsAppOtpData): Promise<{message: string}> {
    try {
      const response = await api.post('/phone/send-otp', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao enviar código';
      throw new Error(message);
    }
  }

  // Verificar código WhatsApp (opcional)
  static async verifyWhatsAppOtp(data: WhatsAppVerifyData): Promise<{message: string}> {
    try {
      const response = await api.post('/phone/verify-otp', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Código inválido';
      throw new Error(message);
    }
  }
}

// =============================================
// HELPER FUNCTIONS
// =============================================

// Capturar código de referência da URL (?ref=CODIGO)
export function getReferrerCodeFromURL(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
}

// Formatar celular para envio (Brasil)
export function formatPhoneForAPI(phone: string): string {
  // Remove tudo que não é dígito
  const digits = phone.replace(/\D/g, '');
  
  // Se já tem código do país, retorna com +
  if (digits.startsWith('55')) {
    return `+${digits}`;
  }
  
  // Adiciona código do Brasil
  return `+55${digits}`;
}

// Validar formato de celular brasileiro
export function validateBrazilianPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  // Aceita: 11999999999 ou 5511999999999
  return /^(\d{11}|\d{13})$/.test(cleanPhone);
}

// Gerar link de convite
export function generateInviteLink(inviteCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/?ref=${inviteCode}`;
}

// Gerar mensagem para WhatsApp
export function generateWhatsAppMessage(inviteCode: string): string {
  const inviteLink = generateInviteLink(inviteCode);
  return `🎮 Me cadastrei no pré-registro! Use meu convite: ${inviteLink}`;
}

// Gerar URL do WhatsApp
export function generateWhatsAppURL(inviteCode: string): string {
  const message = generateWhatsAppMessage(inviteCode);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

// Formatar pontos (1000 -> 1.000)
export function formatPoints(points: number): string {
  return new Intl.NumberFormat('pt-BR').format(points);
}

// =============================================
// REACT HOOKS (OPCIONAL)
// =============================================

// Hook para testar conexão
export function useApiConnection() {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);
  
  React.useEffect(() => {
    PreRegistroAPI.testConnection().then(setIsConnected);
  }, []);
  
  return isConnected;
}

// Hook para ranking
export function useRanking() {
  const [ranking, setRanking] = React.useState<RankingItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    PreRegistroAPI.getRanking()
      .then(setRanking)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  return { ranking, loading, error, refetch: () => {
    setLoading(true);
    PreRegistroAPI.getRanking()
      .then(setRanking)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }};
}

// =============================================
// EXEMPLO DE USO NO COMPONENTE
// =============================================

/*
import React, { useState, useEffect } from 'react';
import { PreRegistroAPI, getReferrerCodeFromURL, generateWhatsAppURL } from './services/api';

export function ExampleUsage() {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    celular: '',
    senha: '',
    referrer_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Capturar referrer code da URL
  useEffect(() => {
    const refCode = getReferrerCodeFromURL();
    if (refCode) {
      setFormData(prev => ({ ...prev, referrer_code: refCode }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await PreRegistroAPI.register(formData);
      setSuccess(response.invite_code);
      
      // Mostrar link do WhatsApp
      const whatsappURL = generateWhatsAppURL(response.invite_code);
      console.log('Compartilhar:', whatsappURL);
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      // Seus inputs aqui...
      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Fazer Pré-Registro'}
      </button>
    </form>
  );
}
*/