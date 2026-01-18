import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // Handle Zod error - error.issues is an array
    const fieldErrors = error.issues.map(
      (err: { message: string }) => err.message
    );

    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Handle Prisma unique constraint error
    let field = "Field";
    if (error.meta?.target) {
      // target can be an array of field names
      field = Array.isArray(error.meta.target)
        ? error.meta.target[0]
        : error.meta.target;
    } else if (error.meta?.modelName) {
      // Fallback: try to extract from the error message
      const match = error.message?.match(/fields: \(`(\w+)`\)/);
      field = match ? match[1] : "Field";
    }
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}
