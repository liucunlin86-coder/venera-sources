
/*
 * VeneraX 3.0.0 Comic Source Template
 *
 * This is a development template, not a working source.
 * Implement and test the required methods before publishing.
 */

class ExampleSource extends ComicSource {
  // ========================================
  // Basic information
  // ========================================

  name = "Example Source";
  key = "example_source";
  version = "1.0.0";
  minAppVersion = "3.0.0";
  url = "";

  // ========================================
  // Search
  // ========================================
  //
  // VeneraX calls:
  // search.load(keyword, options, page)
  //
  // Expected return:
  // {
  //   comics: [
  //     {
  //       id: "comic_id",
  //       title: "Comic Title",
  //       cover: "https://example.com/cover.jpg",
  //       subtitle: "",
  //       tags: [],
  //       description: ""
  //     }
  //   ],
  //   maxPage: 10
  // }
  //
  // For next-page pagination, implement:
  // search.loadNext(keyword, options, next)
  //
  // Expected return:
  // {
  //   comics: [],
  //   next: "next_page_token"
  // }

  // ========================================
  // Comic details
  // ========================================
  //
  // Implement:
  // comic.loadInfo(id)
  //
  // Expected return example:
  // {
  //   title: "Comic Title",
  //   subtitle: "",
  //   cover: "https://example.com/cover.jpg",
  //   description: "",
  //   tags: {},
  //   chapters: {
  //     "chapter_1": "Chapter 1"
  //   }
  // }

  // ========================================
  // Chapter images
  // ========================================
  //
  // Implement:
  // comic.loadEp(comicId, epId)
  //
  // Expected return:
  // {
  //   images: [
  //     "https://example.com/page1.jpg",
  //     "https://example.com/page2.jpg"
  //   ]
  // }

  // ========================================
  // Notes
  // ========================================
  //
  // 1. Keep the key unique.
  // 2. Follow the VeneraX 3.0.0 API.
  // 3. Do not publish this template as a working source.
  // 4. Test search, details, chapters and images.
}
