type FiltersValues = {
  owner: string;
  isRerender: boolean; // TODO: get rid of monkey patch
};

type ParamsValues = {
  query?: string;
  owner?: string;
};

type RequestParams = {
  query?: string;
  destination?: string;
  source?: string;
};

export type { FiltersValues, ParamsValues, RequestParams };
