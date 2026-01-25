import { supabase } from './supabase';
import type { LabelPayload } from './generator';

export interface OrderRecord {
  id: string;
  status: 'pending' | 'approved' | 'failed';
  mp_payment_id?: string | null;
  email?: string | null;
  payload: LabelPayload;
  created_at?: string;
}

export async function createOrder(payload: LabelPayload) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      status: 'pending',
      payload,
      mp_payment_id: null
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Erro ao criar pedido: ${error.message}`);
  }

  return data as { id: string };
}

export async function getOrder(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, payload')
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error(`Erro ao buscar pedido: ${error.message}`);
  }

  return data as { id: string; status: string; payload: LabelPayload };
}

export async function markOrderApproved(orderId: string, paymentId: string) {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'approved',
      mp_payment_id: paymentId
    })
    .eq('id', orderId);

  if (error) {
    throw new Error(`Erro ao atualizar pedido: ${error.message}`);
  }
}

export async function saveDownload(orderId: string, filePath: string, expiresAt: string) {
  const { error } = await supabase
    .from('downloads')
    .insert({
      order_id: orderId,
      file_path: filePath,
      expires_at: expiresAt,
      download_count: 0
    });

  if (error) {
    throw new Error(`Erro ao salvar download: ${error.message}`);
  }
}

export async function getDownload(orderId: string) {
  const { data, error } = await supabase
    .from('downloads')
    .select('file_path, expires_at, download_count')
    .eq('order_id', orderId)
    .single();

  if (error) {
    throw new Error(`Erro ao buscar download: ${error.message}`);
  }

  return data as { file_path: string; expires_at: string; download_count: number };
}

export async function incrementDownloadCount(orderId: string) {
  const { error } = await supabase
    .rpc('increment_download_count', { order_id_input: orderId });

  if (error) {
    console.warn('Falha ao incrementar contador de downloads', error.message);
  }
}
