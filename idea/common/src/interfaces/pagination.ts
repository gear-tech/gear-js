interface IPaginationResult {
  count: number;
}

interface IPaginationParams {
  limit?: number;
  offset?: number;
}

export { IPaginationResult, IPaginationParams };
