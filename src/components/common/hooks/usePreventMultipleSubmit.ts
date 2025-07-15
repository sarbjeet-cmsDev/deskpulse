import { useRef, useState } from 'react';

export function usePreventMultipleSubmit() {
  const isSubmittingRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitWithLock = async (
    submitCallback: () => Promise<void>
  ) => {
    if (isSubmittingRef.current || buttonRef.current?.disabled) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    if (buttonRef.current) buttonRef.current.disabled = true;

    try {
      await submitCallback();
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      if (buttonRef.current) buttonRef.current.disabled = false;
    }
  };

  return {
    isSubmitting,
    handleSubmitWithLock,
    buttonRef,
  };
}
