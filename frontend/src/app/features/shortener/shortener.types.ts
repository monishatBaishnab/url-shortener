export interface LinkData {
  id: string;
  original_url: string;
  keyword: string;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLinkResponse {
  id: string;
  original_url: string;
  keyword: string;
  clicks: number;
  created_at: string;
  updated_at: string;
}
