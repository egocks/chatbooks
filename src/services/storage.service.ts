import { supabase } from '../lib/supabase';

/**
 * Storage buckets for different content types
 */
export enum StorageBucket {
  Manuscripts = 'manuscripts',
  Audio = 'audio',
  Covers = 'covers',
  Profiles = 'profiles'
}

/**
 * Service for handling file uploads and downloads using Supabase Storage
 */
export class StorageService {
  /**
   * Upload a file to a specific bucket
   * @param bucket The storage bucket to upload to
   * @param path The path within the bucket
   * @param file The file to upload
   * @returns The URL of the uploaded file
   */
  async uploadFile(bucket: StorageBucket, path: string, file: File): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      if (!data) throw new Error('Upload failed');

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error(`Error uploading file to ${bucket}/${path}:`, error);
      throw error;
    }
  }

  /**
   * Download a file from a specific bucket
   * @param bucket The storage bucket to download from
   * @param path The path within the bucket
   * @returns The downloaded file
   */
  async downloadFile(bucket: StorageBucket, path: string): Promise<Blob> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      if (!data) throw new Error('Download failed');

      return data;
    } catch (error) {
      console.error(`Error downloading file from ${bucket}/${path}:`, error);
      throw error;
    }
  }

  /**
   * Get a public URL for a file
   * @param bucket The storage bucket
   * @param path The path within the bucket
   * @returns The public URL
   */
  getPublicUrl(bucket: StorageBucket, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Delete a file from a specific bucket
   * @param bucket The storage bucket
   * @param path The path within the bucket
   */
  async deleteFile(bucket: StorageBucket, path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting file from ${bucket}/${path}:`, error);
      throw error;
    }
  }

  /**
   * List files in a specific bucket and folder
   * @param bucket The storage bucket
   * @param folder The folder path within the bucket
   * @returns Array of file objects
   */
  async listFiles(bucket: StorageBucket, folder: string = ''): Promise<{
    name: string;
    size: number;
    created_at: string;
    path: string;
    publicUrl: string;
  }[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);

      if (error) throw error;
      if (!data) return [];

      return data
        .filter(item => !item.id.endsWith('/'))
        .map(item => ({
          name: item.name,
          size: item.metadata?.size || 0,
          created_at: item.created_at,
          path: folder ? `${folder}/${item.name}` : item.name,
          publicUrl: this.getPublicUrl(bucket, folder ? `${folder}/${item.name}` : item.name)
        }));
    } catch (error) {
      console.error(`Error listing files in ${bucket}/${folder}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();
