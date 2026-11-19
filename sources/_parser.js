/*

* VeneraX Generic Comic Parser Utilities
* 
* 通用数据处理工具。
* 本文件暂不单独加入 index.json。
* 
* 使用方式：
* 将 WebComicParserUtils 类复制到需要使用的源文件中。
  */

class WebComicParserUtils {

// ==============================
// 1. 文本清理
// ==============================

static cleanText(value) {
if (value === null || value === undefined) {
return "";
}

return String(value)
  .replace(/\s+/g, " ")
  .trim();

}

// ==============================
// 2. 标签标准化
// ==============================

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

// ==============================
// 3. 漫画数据标准化
// ==============================

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
  tags: this.normalizeTags(data.tags),
  description: this.cleanText(data.description)
};

}

// ==============================
// 4. 分页计算
// ==============================

static paginate(items, page, pageSize) {
if (!Array.isArray(items)) {
throw new Error("Pagination input must be an array");
}

const size = Math.max(1, Number(pageSize) || 20);
const currentPage = Math.max(1, Number(page) || 1);

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

// ==============================
// 5. 图片地址检查
// ==============================

static validateImageUrls(images) {
if (!Array.isArray(images)) {
throw new Error("Images must be an array");
}

return images.filter(url => {
  if (typeof url !== "string") {
    return false;
  }

  const value = url.trim();

  return /^https?:\/\/[^\s]+$/i.test(value);
});

}

// ==============================
// 6. 章节数据标准化
// ==============================

static normalizeChapters(chapters) {
if (!chapters || typeof chapters !== "object") {
return {};
}

const result = {};

for (const [id, title] of Object.entries(chapters)) {
  const chapterId = this.cleanText(id);
  const chapterTitle = this.cleanText(title);

  if (chapterId && chapterTitle) {
    result[chapterId] = chapterTitle;
  }
}

return result;

}
}