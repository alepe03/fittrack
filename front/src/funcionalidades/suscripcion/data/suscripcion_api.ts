import { clienteApi } from '@/nucleo/red/cliente_api'

export interface UpgradeSimuladoPayload {
  cardholder_name: string
  card_number: string
  expiry: string
  cvv: string
}

export interface UpgradeSimuladoResponse {
  message: string
  user: {
    id: number
    name: string
    email: string
    plan: 'free' | 'premium'
  }
  receipt: {
    receipt_id: string
    issued_at: string
    plan: 'premium'
    amount: number
    currency: 'EUR'
    status: 'paid_simulated'
    user_email: string
    card_last4: string | null
  }
}

export interface CancelSuscripcionResponse {
  message: string
  user: {
    id: number
    name: string
    email: string
    plan: 'free' | 'premium'
  }
}

export async function upgradeSimulado(payload: UpgradeSimuladoPayload): Promise<UpgradeSimuladoResponse> {
  const resp = await clienteApi.post<UpgradeSimuladoResponse>('/subscription/upgrade-simulated', payload)
  return resp.data
}

export async function cancelarSuscripcionPremium(): Promise<CancelSuscripcionResponse> {
  const resp = await clienteApi.post<CancelSuscripcionResponse>('/subscription/cancel')
  return resp.data
}
