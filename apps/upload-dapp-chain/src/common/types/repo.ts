import { Asset } from "./asset";

export interface Repo {
  url: string,
  html_url: string,
  assets_url: string,
  upload_url: string,
  tarball_url: string,
  zipball_url: string,
  discussion_url: string,
  id: 1,
  node_id: string,
  tag_name: string,
  target_commitish: string,
  name: string,
  body: string,
  draft: false,
  prerelease: false,
  created_at: string,
  published_at: string,
  author: any,
  assets: Asset[],
}
