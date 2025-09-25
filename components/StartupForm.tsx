"use client";

import React, {
  FormEvent,
  startTransition,
  useActionState,
  useState,
  ReactElement,
} from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

type InitialState = {
  error: string;
  status: "INITIAL" | "PENDING" | "SUCCESS" | "ERROR";
};

const StartupForm = (): ReactElement => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (
    prevState: InitialState,
    formData: FormData
  ): Promise<
    InitialState & { _id?: string; status: InitialState["status"] }
  > => {
    try {
      const formValues = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        link: formData.get("link"),
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(formData, pitch);

      if (result.status === "SUCCESS") {
        router.push(`/startup/${result?._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Validation Error",
          description: "Please check the form fields for errors.",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting the form.",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  const [, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>

        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />

        {errors.title ? (
          <p className="startup-form_error">{errors.title}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>

        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />

        {errors.description ? (
          <p className="startup-form_error">{errors.description}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>

        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education, etc.)"
        />

        {errors.category ? (
          <p className="startup-form_error">{errors.category}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>

        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Paste a link to your demo or promotional media"
        />

        {errors.link ? (
          <p className="startup-form_error">{errors.link}</p>
        ) : null}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          value={pitch}
          onChange={(value?: string | undefined) => setPitch(value || "")}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what a problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.pitch ? (
          <p className="startup-form_error">{errors.pitch}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
