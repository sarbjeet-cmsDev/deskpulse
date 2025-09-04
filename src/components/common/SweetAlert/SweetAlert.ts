
import Swal from "sweetalert2";

export interface ConfirmDialogOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: "warning" | "error" | "success" | "info" | "question";
}

export async function SweetAlert({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  confirmButtonText = "Yes, do it!",
  cancelButtonText = "Cancel",
  icon = "warning",
}: ConfirmDialogOptions = {}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      confirmButton:
        "bg-red-600 text-white px-4 py-2 ml-3 rounded hover:bg-red-700 focus:outline-none mr-2",
      cancelButton:
        "bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 focus:outline-none",
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
}
