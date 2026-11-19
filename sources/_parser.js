
/*
 * VeneraX Generic Comic Parser
 * 通用漫画源解析工具
 */

class WebComicParserUtils {

  // 清理文本
  static cleanText(value) {
    if (value == null) return "";

    return String(value)
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  // 统一网址，支持相对地址
  static resolveUrl(url, baseUrl = "") {
    if (!url) return "";

    const value = String(url).trim();

    if (!value) return "";

    try {
      return baseUrl
        ? new URL(value, baseUrl).href
        : new URL(value).href;
    } catch (_) {
      return "";
    }
  }

  // 标签清理和去重
  static normalizeTags(tags) {
    if (!tags) return [];

    if (typeof tags === "string") {
      tags = tags.split(/[,，、|]/);
    }

    if (!Array.isArray(tags)) return [];

    return [...new Set(
      tags.map(tag => this.cleanText(tag)).filter(Boolean)
    )];
  }

  // 漫画数据标准化
  static normalizeComic(data = {}, baseUrl = "") {
    const id = this.cleanText(data.id ?? data.comicId);
    const title = this.cleanText(data.title ?? data.name);

    return {
      id,
      title,
      cover: this.resolveUrl(
        data.cover ?? data.coverUrl ?? data.image,
        baseUrl
      ),
      subtitle: this.cleanText(
        data.subtitle ?? data.author
      ),
      description: this.cleanText(
        data.description ?? data.desc ?? data.intro
      ),
      tags: this.normalizeTags(data.tags),
      url: this.resolveUrl(data.url ?? data.link, baseUrl)
    };
  }

  // 漫画列表去重
  static dedupeComics(comics = []) {
    if (!Array.isArray(comics)) return [];

    const seen = new Set();

    return comics.filter(comic => {
      if (!comic) return false;

      const id = String(comic.id ?? "").trim();

      if (!id || seen.has(id)) return false;

      seen.add(id);
      return true;
    });
  }

  // 通用分页
  static paginate(items = [], page = 1, pageSize = 20) {
    if (!Array.isArray(items)) items = [];

    const size = Math.max(1, Number(pageSize) || 20);
    const current = Math.max(1, Number(page) || 1);
    const maxPage = Math.max(1, Math.ceil(items.length / size));
    const start = (current - 1) * size;

    return {
      comics: items.slice(start, start + size),
      page: current,
      pageSize: size,
      totalItems: items.length,
      maxPage
    };
  }

  // 图片网址标准化、去重
  static normalizeImages(images = [], baseUrl = "") {
    if (!Array.isArray(images)) return [];

    const seen = new Set();
    const result = [];

    for (const item of images) {
      let url = "";

      if (typeof item === "string") {
        url = item;
      } else if (item && typeof item === "object") {
        url = item.url ?? item.src ?? item.original ?? "";
      }

      url = this.resolveUrl(url, baseUrl);

      if (!url || seen.has(url)) continue;

      seen.add(url);
      result.push(url);
    }

    return result;
  }

  // 兼容旧方法名
  static validateImageUrls(images, baseUrl = "") {
    return this.normalizeImages(images, baseUrl);
  }

  // 章节排序：识别章节号
  static getChapterNumber(chapter, index = 0) {
    const title = String(
      chapter.title ?? chapter.name ?? ""
    );

    const match = title.match(
      /(\d+(?:\.\d+)?)/
    );

    if (match) return Number(match[1]);

    return index;
  }

  // 章节标准化，支持数组及对象
  static normalizeChapters(chapters, sort = false) {
    if (!chapters) return {};

    let list = [];

    if (Array.isArray(chapters)) {
      list = chapters.map((chapter, index) => {
        if (typeof chapter === "string") {
          return {
            id: String(index),
            title: this.cleanText(chapter),
            index
          };
        }

        if (!chapter || typeof chapter !== "object") {
          return null;
        }

        return {
          id: String(
            chapter.id ?? chapter.chapterId ?? index
          ),
          title: this.cleanText(
            chapter.title ?? chapter.name ?? `第${index + 1}章`
          ),
          index,
          url: chapter.url ?? chapter.link ?? ""
        };
      }).filter(Boolean);
    } else if (typeof chapters === "object") {
      list = Object.entries(chapters).map(
        ([id, title], index) => ({
          id: String(id),
          title: this.cleanText(
            typeof title === "object"
              ? title.title ?? title.name ?? id
              : title
          ),
          index
        })
      );
    }

    if (sort) {
      list.sort((a, b) =>
        this.getChapterNumber(a, a.index) -
        this.getChapterNumber(b, b.index)
      );
    }

    const result = {};

    for (const chapter of list) {
      if (!chapter.id || !chapter.title) continue;

      result[chapter.id] = chapter.title;
    }

    return result;
  }

  // 获取错误信息
  static getErrorMessage(error, fallback = "请求失败") {
    if (error && error.message) {
      return this.cleanText(error.message);
    }

    return fallback;
  }

}
