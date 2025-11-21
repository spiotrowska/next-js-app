import React from "react";
import { render } from "@testing-library/react";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

function makePost(overrides: Partial<StartupTypeCard>): StartupTypeCard {
  return {
    _id: "card-empty-title",
    _createdAt: new Date().toISOString(),
    views: 10,
    title: "", // force falsy title
    category: "Tech",
    image: "https://example.com/startup.png", // truthy image
    description: "Description present and long enough to render.",
    author: {
      _id: "auth1",
      name: "Author Name",
      username: "authoruser",
      email: "author@example.com",
      image: "https://example.com/author.png",
      bio: "bio",
    },
    ...overrides,
  } as StartupTypeCard;
}

describe("StartupCard image && title conditional", () => {
  test("does not render startup image when title is empty (image truthy)", () => {
    const post = makePost({});
    const { container } = render(<StartupCard post={post} />);
    // Author avatar should render
    expect(container.querySelector('img[alt="Author Name"]')).toBeTruthy();
    // Startup main image should not render due to title being empty
    expect(container.querySelector(".startup-card_img")).toBeNull();
  });
});
