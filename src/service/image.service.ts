import { createAxiosClient } from '@/utils/createAxiosClient';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const axiosClient = createAxiosClient({ withCreds: false });

const ImageService = {
  async getResizedImage(path: string, width: number, height?: number, aspect = false): Promise<Blob> {
    try {
      const url = new URL(`${API_URL}/api/image`);
      url.searchParams.append('path', path);
      url.searchParams.append('width', width.toString());
      if (height) url.searchParams.append('height', height.toString());
      url.searchParams.append('aspect', aspect.toString());

      const response = await axiosClient.get(url.toString(), { responseType: 'blob' });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch resized image');
    }
  },
};

export default ImageService;
