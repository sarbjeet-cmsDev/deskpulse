import { useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(
    ref: React.RefObject<T>,
    isActive: boolean,
    onOutsideClick: () => void
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOutsideClick();
            }
        }

        if (isActive) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isActive, ref, onOutsideClick]);
}
