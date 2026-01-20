// reference: https://reactrouter.com/api/hooks/useNavigate#return-type-augmentation
declare module 'react-router' {
  interface NavigateFunction {
    (to: To, options?: NavigateOptions): void;
    (delta: number): void;
  }
}

export {};
