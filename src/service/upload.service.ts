import { createAxiosClient } from '@/utils/createAxiosClient';

export interface IUploadResponse {
  url: string;
  filename?: string;
  originalName?: string;
  mimetype?: string;
  size?: number;
  [key: string]: any;
}

const axiosClient = createAxiosClient({ withCreds: true });

const UPLOAD_PATH = '/upload';

export const UploadService = {
  async uploadFile(file: File, onProgress?: (p: number) => void): Promise<IUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosClient.post(UPLOAD_PATH, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      },
    });
    return res.data;
  },

  async uploadImageForQuill(file: File): Promise<string> {
    const { url } = await this.uploadFile(file);
    return url;
  },
};

export default UploadService;

