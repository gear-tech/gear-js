type FiltersValues = {
  uploadedBy: string;
  isRerender: boolean; // TODO: get rid of monkey patch
};

type RequestParams = {
  query?: string;
  uploadedBy?: string;
};

export type { FiltersValues, RequestParams };
