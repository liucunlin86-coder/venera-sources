/*
 * VeneraX Generic Comic Parser Utilities
 * 通用漫画源数据处理工具
 */

class WebComicParserUtils {

  // 1. 清理文本
  static cleanText(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // 2. 标签标准化、去重
  static normalizeTags(tags) {
    if (!Array.isArray(tags)) {
      return [];
    }

    return [...new Set(
      tags
        .map(tag => this.cleanText(tag))
        .filter(Boolean)
    )];
  }

  // 3. 漫画数据标准化
  static normalizeComic(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid comic data");
    }

    const id = this.cleanText(data.id);
    const title = this.cleanText(data.title);
    const cover = this.cleanText(data.cover);

    if (!id) {
      throw new Error("Comic ID is missing");
    }

    if (!title) {
      throw new Error("Comic title is missing");
    }

    return {
      id,
      title,
      cover,
      subtitle: this.cleanText(data.subtitle),
      description: this.cleanText(data.description),
      tags: this.normalizeTags(data.tags)
    };
  }

  // 4. 通用分页
  static paginate(items, page, pageSize) {
    if (!Array.isArray(items)) {
      throw new Error("Pagination input must be an array");
    }

    const size = Math.max(
      1,
      Number(pageSize) || 20
    );

    const currentPage = Math.max(
      1,
      Number(page) || 1
    );

    const totalItems = items.length;

    const maxPage = Math.max(
      1,
      Math.ceil(totalItems / size)
    );

    const start = (currentPage - 1) * size;

    return {
      comics: items.slice(start, start + size),
      page: currentPage,
      pageSize: size,
      totalItems,
      maxPage
    };
  }

  // 5. 图片地址过滤
  static validateImageUrls(images) {
    if (!Array.isArray(images)) {
      return [];
    }

    return images
      .filter(url => typeof url === "string")
      .map(url => url.trim())
      .filter(url => /^https?:\/\/[^\s]+$/i.test(url));
  }

  // 6. 章节标准化
  // 支持数组和对象两种形式
  static normalizeChapters(chapters) {
    if (!chapters) {
      return {};
    }

    const result = {};

    // 数组形式
    if (Array.isArray(chapters)) {
      chapters.forEach((chapter, index) => {
        if (!chapter || typeof chapter !== "object") {
          return;
        }

        const id = this.cleanText(
          chapter.id ?? chapter.chapterId ?? index
        );

        const title = this.cleanText(
          chapter.title ?? chapter.name
        );

        if (id && title) {
          result[id] = title;
        }
      });

      return result;
    }

    // 对象形式
    if (typeof chapters === "object") {
      for (const [id, title] of Object.entries(chapters)) {
        const chapterId = this.cleanText(id);
        const chapterTitle = this.cleanText(title);

        if (chapterId && chapterTitle) {
          result[chapterId] = chapterTitle;
        }
      }
    }

    return result;
  }

  // 7. 图片列表标准化
  static normalizeImages(images) {
    if (!Array.isArray(images)) {
      return [];
    }

    return this.validateImageUrls(
      images.map(image => {
        if (typeof image === "string") {
          return image;
        }

        if (image && typeof image === "object") {
          return image.url || image.src || "";
        }

        return "";
      })
    );
  }

  // 8. 统一错误信息
  static getErrorMessage(error, fallback = "Unknown error") {
    if (error && error.message) {
      return this.cleanText(error.message);
    }

    return fallback;
  }

}