Venera Source Repository

A starter repository for organizing Venera-compatible JavaScript comic sources.


Repository URL vs. source script URL


A source script URL points directly to a .js file.

A source repository URL points to an index.json file containing an array of source entries.


Official-style index entry

Use one of url or filename (not both) per entry. Example:


[
  {
    "name": "Example Source",
    "url": "https://example.com/source.js",
    "version": "1.0.0",
    "description": "Example comic source"
  }
]

Keep index.json as an empty array until a source is implemented and tested.


Source script requirements

A source script defines a class extending ComicSource and includes source metadata such as name, unique key, version, minAppVersion, and url. Actual search, comic detail, chapter, and image loading methods must follow the target app version's API and be tested in-app.

