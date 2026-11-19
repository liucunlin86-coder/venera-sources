
/*
 * VeneraX 3.0.0 Demo Test Source
 * A fictional source for testing search, details and image loading.
 */

class DemoTestSource extends ComicSource {
  name = "VeneraX 测试源";
  key = "demo_test_source";
  version = "1.0.0";
  minAppVersion = "3.0.0";
  url = "https://github.com/liucunlin86-coder/venera-sources";

  // Fictional comic data
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
    }
  ];

  // Search
  search = {
    optionList: [],

    load: async (keyword, options, page) => {
      const text = String(keyword || "").trim().toLowerCase();

      const comics = this.demoComics.filter(comic =>
        !text || comic.title.toLowerCase().includes(text)
      );

      return {
        comics: comics,
        maxPage: 1
      };
    }
  };

  // Comic details and chapters
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

    // Chapter images
    loadEp: async (comicId, epId) => {
      const comic = this.demoComics.find(
        item => item.id === comicId
      );

      if (!comic) {
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
