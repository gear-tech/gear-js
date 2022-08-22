import { Asset } from './asset';

export interface Release {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: any;
  node_id: string;
  tag_name: string; // release  '0.1.0'
  target_commitish: string;
  name: string; // release  '0.1.0'
  draft: false;
  prerelease: false;
  created_at: string;
  published_at: string;
  assets: Asset[];
}
