
/*
 * VeneraX 3.0.0
 * Generic Comic Source Template
 * 通用网页漫画源模板
 */

class ExampleSource extends ComicSource {
  name = "Example Source";
  key = "example_source";
  version = "1.3.0";
  minAppVersion = "3.0.0";
  url = "";

  pageSize = 20;

  // ==========================================
  // 漫画数据
  // 正式源只需要替换这里的数据及对应的解析逻辑
  // ==========================================

  comicsData = [
    {
      id: "comic_001",
      title: "示例漫画",
      cover: "https://placehold.co/600x900",
      subtitle: "示例作者",
      description: "示例简介",
      tags: ["示例", "原创"],
      chapters: [
        {
          id: "chapter_001",
          title: "第一章",
          images: [
            "https://placehold.co/800x1200"
          ]
        },
        {
          id: "chapter_002",
          title: "第二章",
          images: [
            "https://placehold.co/800x1200"
          ]
        }
      ]
    }
  ];

  // ==========================================
  // 工具方法
  // ==========================================

  findComic(id) {
    return this.comicsData.find(
      comic => String(comic.id) === String(id)
    );
  }

  safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  safeText(value) {
    return String(value ?? "").trim();
  }

  // ==========================================
  // 搜索
  // ==========================================

  search = {
    optionList: [],

    load: async (keyword, options, page) => {
      const query = this.safeText(keyword).toLowerCase();

      const results = this.comicsData.filter(comic => {
        const title = this.safeText(comic.title).toLowerCase();
        const subtitle = this.safeText(comic.subtitle).toLowerCase();

        const tags = this.safeArray(comic.tags);

        const tagMatch = tags.some(tag =>
          this.safeText(tag).toLowerCase().includes(query)
        );

        return (
          !query ||
          title.includes(query) ||
          subtitle.includes(query) ||
          tagMatch
        );
      });

      // 去重
      const seen = new Set();

      const uniqueResults = results.filter(comic => {
        const id = String(comic.id ?? "");

        if (!id || seen.has(id)) {
          return false;
        }

        seen.add(id);
        return true;
      });

      // 分页
      const currentPage = Math.max(
        1,
        Number(page) || 1
      );

      const start = (currentPage - 1) * this.pageSize;

      const maxPage = Math.max(
        1,
        Math.ceil(uniqueResults.length / this.pageSize)
      );

      return {
        comics: uniqueResults
          .slice(start, start + this.pageSize)
          .map(comic => ({
            id: String(comic.id),
            title: this.safeText(comic.title),
            cover: this.safeText(comic.cover),
            subtitle: this.safeText(comic.subtitle)
          })),

        maxPage
      };
    }
  };

  // ==========================================
  // 漫画详情及章节
  // ==========================================

  comic = {

    // 漫画详情
    loadInfo: async (id) => {
      const comic = this.findComic(id);

      if (!comic) {
        throw new Error("Comic not found");
      }

      const chapters = {};
      const chapterList = this.safeArray(comic.chapters);

      chapterList.forEach((chapter, index) => {
        if (!chapter) return;

        const chapterId = String(
          chapter.id ?? index
        );

        const chapterTitle = this.safeText(
          chapter.title || `第${index + 1}章`
        );

        chapters[chapterId] = chapterTitle;
      });

      return {
        comicId: String(comic.id),
        sourceKey: this.key,
        title: this.safeText(comic.title),
        subtitle: this.safeText(comic.subtitle),
        cover: this.safeText(comic.cover),
        description: this.safeText(comic.description),

        tags: {
          "标签": this.safeArray(comic.tags)
        },

        chapters
      };
    },

    // 章节内容
    loadEp: async (comicId, epId) => {
      const comic = this.findComic(comicId);

      if (!comic) {
        throw new Error("Comic not found");
      }

      const chapterList = this.safeArray(comic.chapters);

      const chapter = chapterList.find(
        item =>
          item &&
          String(item.id) === String(epId)
      );

      if (!chapter) {
        throw new Error("Chapter not found");
      }

      // 过滤无效图片
      const images = this.safeArray(chapter.images)
        .filter(image => typeof image === "string")
        .map(image => image.trim())
        .filter(image => /^https?:\/\/\S+/i.test(image));

      if (images.length === 0) {
        throw new Error("No images found");
      }

      return {
        images
      };
    }
  };
}
