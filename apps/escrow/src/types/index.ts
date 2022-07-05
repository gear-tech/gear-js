type CreateWalletFormData = {
  values: { buyer: string; seller: string; amount: string };
  onSuccess: () => void;
};

export type { CreateWalletFormData };
