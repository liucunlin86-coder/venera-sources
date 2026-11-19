Generic Web Comic Source Development Guide

This guide defines a reusable, website-independent workflow for developing comic sources.

Target repository: VeneraX comic sources

1. Development Architecture

Keep website-specific parsing separate from normalized comic data.

Recommended layers:

1. Request Layer: obtains website responses through a supported runtime network API.
2. Parsing Layer: extracts information from HTML, JSON or other response formats.
3. Normalization Layer: converts website data into a consistent comic structure.
4. Source Layer: implements search, pagination, details and chapter images.
5. Validation Layer: checks returned data and handles errors.

Do not assume a network API exists. Verify the target application's supported request interface before implementing the Request Layer.

2. Recommended Project Structure

sources/
├── _template.js
├── demo_test.js
├── README.md
└── WEB_SOURCE_GUIDE.md

For each new website source, create one JavaScript file.

Use a unique source key containing only letters, numbers and underscores.

3. Normalized Comic Data

Search results should be converted into a consistent structure:

{
  id: "comic_id",
  title: "Comic Title",
  cover: "https://example.com/cover.jpg",
  subtitle: "",
  tags: [],
  description: ""
}

Keep IDs stable and unique within the source.

Do not return missing or invalid image URLs.

4. Search Module

Responsibilities:

- Accept a keyword.
- Apply available search filters.
- Parse the website response.
- Normalize comic records.
- Return the requested page.

Expected interface:

search = {
  optionList: [],

  load: async (keyword, options, page) => {
    // Obtain and parse website search results.
    // Normalize records.
    // Calculate pagination.

    return {
      comics: [],
      maxPage: 1
    };
  }
};

Pagination rules:

- Page numbering starts at 1.
- Page size should remain consistent.
- Empty results should return an empty comics array.
- maxPage should be a valid positive number.

5. Comic Details

Responsibilities:

- Find the requested comic.
- Parse title, cover and description.
- Normalize tags.
- Extract chapter identifiers and names.

Expected return structure:

{
  title: "Comic Title",
  subtitle: "",
  cover: "https://example.com/cover.jpg",
  description: "",
  tags: {
    "Genre": ["Example"]
  },
  chapters: {
    "chapter_1": "Chapter 1"
  }
}

Chapter IDs must remain stable between detail loading and chapter loading.

6. Chapter Images

Responsibilities:

- Identify the requested comic.
- Identify the requested chapter.
- Parse image URLs in reading order.
- Return an images array.

Expected return structure:

{
  images: [
    "https://example.com/page1.jpg",
    "https://example.com/page2.jpg"
  ]
}

Do not reverse image order unless the website explicitly requires it.

7. Error Handling

Handle these cases explicitly:

- Network request failure
- HTTP error response
- Invalid response format
- Empty search results
- Missing comic
- Missing chapter
- Empty image list
- Invalid image URL

Errors should be informative and should not silently return unrelated content.

8. Development Workflow

For every new source:

1. Identify the website's public page structure.
2. Identify search parameters and pagination behavior.
3. Identify comic detail fields.
4. Identify chapter identifiers.
5. Identify chapter image ordering.
6. Implement the request adapter using verified runtime APIs.
7. Implement parsing and normalization.
8. Test search and pagination.
9. Test comic details and chapters.
10. Test image loading.
11. Add the source to index.json only after testing.
12. Update the source registry.

9. Quality Checklist

- [ ] Unique source key
- [ ] Correct source metadata
- [ ] Search works
- [ ] Keyword filtering works
- [ ] Pagination works
- [ ] Comic details load
- [ ] Chapter list loads
- [ ] Chapter images load
- [ ] Error handling works
- [ ] JavaScript syntax passes
- [ ] Tested in the target application

10. Compatibility and Security

- Verify APIs against the target application version.
- Never invent network methods or undocumented interfaces.
- Do not hardcode account credentials, cookies or private tokens.
- Respect website access restrictions.
- Do not bypass authentication, access controls or anti-abuse protections.
- Keep test data separate from production sources.

A source must not be marked Stable until its core functions have been tested in the target application.