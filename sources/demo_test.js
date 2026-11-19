
/*
 * VeneraX 3.0.0 Demo Test Source
 * Tests search, pagination, details and chapter images.
 */

class DemoTestSource extends ComicSource {
  name = "VeneraX 测试源";
  key = "demo_test_source";
  version = "1.1.0";
  minAppVersion = "3.0.0";
  url = "https://github.com/liucunlin86-coder/venera-sources";

  demoComics = [
    {
      id: "demo_001",
      title: "测试漫画一",
      cover: "https://placehold.co/600x900/png?text=Demo+Comic+1",
      subtitle: "VeneraX 功能测试",
      tags: ["测试", "演示"],
      description: "这是一本虚构的测试漫画。"
    },
    {
      id: "demo_002",
      title: "测试漫画二",
      cover: "https://placehold.co/600x900/png?text=Demo+Comic+2",
      subtitle: "第二本测试作品",
      tags: ["测试", "示例"],
      description: "这是第二本虚构的测试漫画。"
    },
    {
      id: "demo_003",
      title: "测试漫画三",
      cover: "https://placehold.co/600x900/png?text=Demo+Comic+3",
      subtitle: "第三本测试作品",
      tags: ["测试", "分页"],
      description: "这是第三本虚构的测试漫画。"
    },
    {
      id: "demo_004",
      title: "测试漫画四",
      cover: "https://placehold.co/600x900/png?text=Demo+Comic+4",
      subtitle: "第四本测试作品",
      tags: ["测试", "分页"],
      description: "这是第四本虚构的测试漫画。"
    }
  ];

  search = {
    optionList: [],

    load: async (keyword, options, page) => {
      const text = String(keyword || "").trim().toLowerCase();

      const filtered = this.demoComics.filter(comic =>
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

  comic = {
    loadInfo: async (id) => {
      const data = this.demoComics.find(item => item.id === id);

      if (!data) {
        throw new Error("Comic not found");
      }

      return {
        title: data.title,
        subtitle: data.subtitle,
        cover: data.cover,
        description: data.description,
        tags: {
          "类型": data.tags
        },
        chapters: {
          "chapter_1": "测试章节一",
          "chapter_2": "测试章节二"
        }
      };
    },

    loadEp: async (comicId, epId) => {
      const data = this.demoComics.find(
        item => item.id === comicId
      );

      if (!data) {
        throw new Error("Comic not found");
      }

      if (epId === "chapter_1") {
        return {
          images: [
            "https://placehold.co/800x1200/png?text=Demo+Page+1",
            "https://placehold.co/800x1200/png?text=Demo+Page+2"
          ]
        };
      }

      if (epId === "chapter_2") {
        return {
          images: [
            "https://placehold.co/800x1200/png?text=Demo+Page+3"
          ]
        };
      }

      throw new Error("Chapter not found");
    }
  };
}
