import { SearchResponse } from "@/components/global-search/types";
import { createAxiosClient } from "@/utils/createAxiosClient";
const axiosClient = createAxiosClient({ withCreds: true });

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const searchAll = async (query: string): Promise<SearchResponse> => {
  const response = await axiosClient.get(`${API_URL}/search`, {
    params: { q: query },
  });
  return response.data;
};