import React, { ReactElement } from "react";
import Form from "next/form";
import SearchFormReset from "@/components/SearchFormReset";
import { Search } from "lucide-react";

type SearchFormProps = { query?: string };

const SearchForm = ({
  query,
}: SearchFormProps): ReactElement<SearchFormProps> => {
  return (
    <Form action="/" className="search-form">
      <label htmlFor="search-query" className="sr-only">
        Search startups
      </label>

      <input
        id="search-query"
        name="query"
        defaultValue={query}
        className="search-input text-black dark:bg-black-100 dark:text-white"
        placeholder="Search Startup"
        aria-label="Search startups"
      />

      <div className="flex gap-2">
        {query ? <SearchFormReset /> : null}

        <button
          type="submit"
          className="search-btn text-white"
          aria-label="Search"
        >
          <Search className="size-5" aria-hidden="true" focusable="false" />
          <span className="sr-only">Search</span>
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
