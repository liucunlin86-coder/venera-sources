/*
 * VeneraX 3.0.0
 * Generic Comic Source Template
 */

class ExampleSource extends ComicSource {
  name = "Example Source";
  key = "example_source";
  version = "1.2.0";
  minAppVersion = "3.0.0";
  url = "";

  pageSize = 20;

  // 统一漫画数据格式
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

  // 通用查找
  findComic(id) {
    return this.comicsData.find(
      comic => String(comic.id) === String(id)
    );
  }

  // 搜索
  search = {
    optionList: [],

    load: async (keyword, options, page) => {
      const query = String(keyword || "").trim().toLowerCase();

      const results = this.comicsData.filter(comic =>
        !query ||
        comic.title.toLowerCase().includes(query) ||
        comic.subtitle.toLowerCase().includes(query) ||
        comic.tags.some(tag => tag.toLowerCase().includes(query))
      );

      const currentPage = Math.max(1, Number(page) || 1);
      const start = (currentPage - 1) * this.pageSize;

      return {
        comics: results.slice(start, start + this.pageSize).map(comic => ({
          id: comic.id,
          title: comic.title,
          cover: comic.cover,
          subtitle: comic.subtitle
        })),
        maxPage: Math.max(1, Math.ceil(results.length / this.pageSize))
      };
    }
  };

  // 详情、章节、图片
  comic = {
    loadInfo: async (id) => {
      const comic = this.findComic(id);

      if (!comic) {
        throw new Error("Comic not found");
      }

      const chapters = {};

      comic.chapters.forEach(chapter => {
        chapters[chapter.id] = chapter.title;
      });

      return {
        comicId: comic.id,
        sourceKey: this.key,
        title: comic.title,
        subtitle: comic.subtitle,
        cover: comic.cover,
        description: comic.description,
        tags: {
          "标签": comic.tags
        },
        chapters
      };
    },

    loadEp: async (comicId, epId) => {
      const comic = this.findComic(comicId);

      if (!comic) {
        throw new Error("Comic not found");
      }

      const chapter = comic.chapters.find(
        item => String(item.id) === String(epId)
      );

      if (!chapter) {
        throw new Error("Chapter not found");
      }

      return {
        images: chapter.images
      };
    }
  };
}