import axios, {
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Swal from "sweetalert2";
import { SweetToast } from "@/utils/sweetToast";
import { signOut } from "@/store/slices/authSlice";
import { store } from "@/store/store";
import Cookies from "js-cookie";

/**
 * Custom Exception Classes
 */
export class BadRequestException extends Error {
  constructor(message: string = "Bad Request") {
    super(message);
    this.name = "BadRequestException";
  }
}
export class InternalServerException extends Error {
  constructor(message: string = "Internal Server Error") {
    super(message);
    this.name = "InternalServerException";
  }
}
export class UnauthorizedException extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedException";
  }
}
export class NotFoundException extends Error {
  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundException";
  }
}




/**
 * Axios Client Options
 */
interface AxiosClientOptions {
  baseURL?: string;
  withCreds?: boolean; // If true, set Authorization header with token
  getToken?: () => string | null; // Function to get token (optional)
  onSuccess?: (response: AxiosResponse) => void; // Success callback
}



/**
 * Axios Client Factory
 */
export function createAxiosClient(options: AxiosClientOptions = {}) {



/**
 * Default Toast on Success
 */


const defaultOnSuccess = (response: AxiosResponse) => {
  if (
    typeof response.data === "object" &&
    response.data &&
    "message" in response.data &&
    response.data.message
  ) {
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      title: response.data.message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  }
};






  const {
    baseURL = process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:3001/api",

    withCreds = false,
    getToken,
    onSuccess = defaultOnSuccess,
  } = options;

  const instance = axios.create({ baseURL });

  // Add Authorization header if withCreds is true
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (withCreds) {
      let token =
        (getToken && getToken()) ||
        (typeof window !== "undefined" && localStorage.getItem("token"));

      if (!token && typeof window !== "undefined") {
        // Redirect if no token
        window.location.href = "/auth/login";
        return Promise.reject("No token found. Redirecting to login.");
      }

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  });

  // Handle success toast
  instance.interceptors.response.use(
    (response) => {
      onSuccess && onSuccess(response);
      return response;
    },
    (error: AxiosError) => {
      // Recognize error and throw custom exceptions
      if (error.response) {
        const { status, data } = error.response;
        const msg =
          typeof data === "object" && data && "message" in data
            ? (data as any).message
            : error.message;

        if (status === 401) {
          store.dispatch(signOut());

          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }

          return Promise.reject(error);
        }

        SweetToast.error(msg);
        switch (status) {
          case 400:
            throw new BadRequestException(msg);
          case 401:
            throw new UnauthorizedException(msg);
          case 404:
            throw new NotFoundException(msg);
          case 500:
            throw new InternalServerException(msg);
          default:
            throw new Error(msg || "An error occurred");
        }
      }
      throw error;
    }
  );

  return instance;
}
