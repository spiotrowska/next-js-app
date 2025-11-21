"use client";

import { X } from "lucide-react";
import { ReactElement } from "react";
import { useRouter } from "next/navigation";

const SearchFormReset = (): ReactElement => {
  const router = useRouter();

  const handleReset = (): void => {
    const form = document.querySelector(".search-form") as HTMLFormElement;

    if (form) {
      const input = form.querySelector(
        'input[name="query"]'
      ) as HTMLInputElement | null;

      if (input) input.value = "";
    }

    router.push("/");
  };

  return (
    <button
      type="button"
      aria-label="reset search"
      onClick={handleReset}
      className="search-btn text-white"
    >
      <X className="size-5" />
    </button>
  );
};

export default SearchFormReset;
