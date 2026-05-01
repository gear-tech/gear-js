import { useMutation } from "@tanstack/react-query";
import { generatePath, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

import { useApi } from "@/app/api";
import { useAddMyActivity } from "@/app/store";
import { TransactionTypes, unpackReceipt } from "@/app/store/my-activity";
import { routes } from "@/shared/config";

export const useUploadCode = () => {
  const { data: api } = useApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();
  const { address } = useAccount();

  const uploadCode = async (code: Uint8Array) => {
    if (!api || !address) return;

    const { router, wvara } = api.eth;

    const [baseFee, extraFee] = await Promise.all([
      router.requestCodeValidationBaseFee(),
      router.requestCodeValidationExtraFee(),
    ]);

    const deadline = BigInt(Date.now() + 10000);

    const { signature: wvaraPermitSig } = await wvara.prepareAndSignPermitData(
      router.address,
      baseFee + extraFee,
      deadline,
    );

    const {
      signature: requestCodeValidationSig,
      blobHashes,
      codeId,
    } = await router.prepareAndSignRequestCodeValidationPermitData(code, deadline);

    const tx = await router.requestCodeValidationOnBehalf(
      address,
      code,
      blobHashes,
      deadline,
      requestCodeValidationSig,
      wvaraPermitSig,
    );

    const receipt = await tx.sendAndWaitForReceipt();
    const isValidated = await tx.waitForCodeGotValidated();

    await addMyActivity({
      type: TransactionTypes.codeValidation,
      codeId,
      resultStatus: isValidated ? "success" : "error",
      error: isValidated ? undefined : "validation error",
      ...unpackReceipt(receipt),
    });

    void navigate(generatePath(routes.code, { codeId }));
  };

  const mutation = useMutation({
    mutationFn: uploadCode,
    onError: (error) => {
      console.error("🚀 ~ mutation ~ error:", error);
    },
  });

  return mutation;
};
