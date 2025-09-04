import { SweetAlert } from "@/components/common/SweetAlert/SweetAlert";

/**
 * @param itemName - Name of the item you're deleting (e.g., "task", "comment")
 * @returns Promise<boolean> - true if user confirms, false otherwise
 */
export const confirmDelete = async (itemName: string = "item"): Promise<boolean> => {
  const confirmed = await SweetAlert({
    title: "Are you sure?",
    text: `You are about to delete this ${itemName}. This action cannot be undone.`,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    ...({
      customClass: {
        confirmButton: "mr-2",
        cancelButton: "mr-2",
      },
    } as any)
  });

  return confirmed;
};
