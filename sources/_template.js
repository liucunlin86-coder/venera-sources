/*
 * VeneraX 3.0.0 Comic Source Template
 *
 * 可运行的中性示例模板。
 * 新建漫画源时，复制本文件并修改：
 * 1. name / key / version
 * 2. exampleComics 示例数据
 * 3. search.load 搜索逻辑
 * 4. comic.loadInfo 详情解析
 * 5. comic.loadEp 图片解析
 */

class ExampleSource extends ComicSource {
  // ==============================
  // 基本信息
  // ==============================

  name = "Example Source";
  key = "example_source";
  version = "1.0.0";
  minAppVersion = "3.0.0";
  url = "";

  // ==============================
  // 示例数据
  // 实际开发时替换为网站数据
  // ==============================

  exampleComics = [
    {
      id: "example_001",
      title: "示例漫画一",
      cover: "https://placehold.co/600x900/png?text=Comic+1",
      subtitle: "示例作品",
      tags: ["示例", "测试"],
      description: "这是一个示例漫画。",
      chapters: {
        chapter_1: "第一章",
        chapter_2: "第二章"
      }
    },
    {
      id: "example_002",
      title: "示例漫画二",
      cover: "https://placehold.co/600x900/png?text=Comic+2",
      subtitle: "分页示例",
      tags: ["示例", "分页"],
      description: "这是第二个示例漫画。",
      chapters: {
        chapter_1: "第一章"
      }
    }
  ];

  // ==============================
  // 搜索与分页
  // ==============================

  search = {
    optionList: [],

    load: async (keyword, options, page) => {
      const text = String(keyword || "").trim().toLowerCase();

      const filtered = this.exampleComics.filter(comic =>
        !text || comic.title.toLowerCase().includes(text)
      );

      const pageSize = 2;
      const pageNumber = Math.max(1, Number(page) || 1);
      const start = (pageNumber - 1) * pageSize;

      return {
        comics: filtered.slice(start, start + pageSize),
        maxPage: Math.max(1, Math.ceil(filtered.length / pageSize))
      };
    }
  };

  // ==============================
  // 漫画详情与章节图片
  // ==============================

  comic = {
    loadInfo: async (id) => {
      const data = this.exampleComics.find(
        item => item.id === id
      );

      if (!data) {
        throw new Error("Comic not found: " + id);
      }

      return {
        title: data.title,
        subtitle: data.subtitle,
        cover: data.cover,
        description: data.description,
        tags: {
          "类型": data.tags
        },
        chapters: data.chapters
      };
    },

    loadEp: async (comicId, epId) => {
      const data = this.exampleComics.find(
        item => item.id === comicId
      );

      if (!data) {
        throw new Error("Comic not found: " + comicId);
      }

      if (!data.chapters[epId]) {
        throw new Error("Chapter not found: " + epId);
      }

      // 示例图片。实际开发时替换为章节图片地址。
      return {
        images: [
          "https://placehold.co/800x1200/png?text=Page+1",
          "https://placehold.co/800x1200/png?text=Page+2"
        ]
      };
    }
  };
}