import { z } from "zod";

// @ts-expect-error
type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

export const jsonContent = <
  T extends ZodSchema,
>(schema: T,
  description: string,
  required = false
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    required,
  };
};

export const defaultErrorJsonContent = (
  description: string) => {
    return jsonContent(
      z.object({
        success: z.boolean().openapi({
          example: false,
        }),
        message: z.string().openapi({
          example: "Invalid input: [ 'id' ]",
        }),
      }),
      description
    )
}