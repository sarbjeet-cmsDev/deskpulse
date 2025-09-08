import Swal, { SweetAlertIcon } from "sweetalert2";

/**
 * SweetToast utility class for quick toast and alert dialogs using SweetAlert2.
 * Usage:
 *   SweetToast.show("Your message here");
 *   SweetToast.error("Error message");
 *   SweetToast.warning("Warning message");
 *   const confirmed = await SweetToast.confirm("Are you sure?");
 */
export class SweetToast {
  /**
   * Show a success toast with the given message.
   * @param message The message to display in the toast.
   */
  static show(message: string) {
    this._toast(message, "success");
  }

  /**
   * Show an error toast with the given message.
   * @param message The message to display in the toast.
   */
  static error(message: string) {
    this._toast(message, "error");
  }

  /**
   * Show a warning toast with the given message.
   * @param message The message to display in the toast.
   */
  static warning(message: string) {
    this._toast(message, "warning");
  }

  /**
   * Show a confirmation dialog.
   * @param message The confirmation message.
   * @returns Promise<boolean> resolves to true if confirmed, false otherwise.
   */
  static async confirm(message: string): Promise<boolean> {
    const result = await Swal.fire({
      title: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      focusCancel: true,
    });
    return !!result.isConfirmed;
  }

  /**
   * Private helper to show a toast.
   */
  private static _toast(message: string, icon: SweetAlertIcon) {
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  }
}