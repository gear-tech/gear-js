import { useEffect, useState } from 'react';

function useFormOpen(isLotteryStarted: boolean, isOwner: boolean) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  useEffect(() => {
    if (!isLotteryStarted && isOwner) {
      openForm();
    } else {
      closeForm();
    }
  }, [isLotteryStarted, isOwner]);

  return { isFormOpen, openForm };
}

export { useFormOpen };
