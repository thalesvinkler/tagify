import { supabase, storageBucket } from './supabase';

export async function uploadFile(path: string, buffer: Buffer, contentType: string) {
  const { error } = await supabase.storage.from(storageBucket).upload(path, buffer, {
    contentType,
    upsert: true
  });

  if (error) {
    throw new Error(`Erro ao enviar arquivo: ${error.message}`);
  }
}

export async function createSignedUrl(path: string, expiresInSeconds = 60 * 60 * 24) {
  const { data, error } = await supabase.storage
    .from(storageBucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    throw new Error(`Erro ao gerar link assinado: ${error.message}`);
  }

  return data.signedUrl;
}
