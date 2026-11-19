const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Load parser utilities without modifying the VeneraX source file.
const parserPath = path.join(
__dirname,
"../sources/_parser.js"
);

const parserCode = fs.readFileSync(parserPath, "utf8");

const sandbox = {};
vm.runInNewContext(
parserCode + "\nthis.WebComicParserUtils = WebComicParserUtils;",
sandbox
);

const Parser = sandbox.WebComicParserUtils;

// 1. Text cleaning
test("cleanText removes extra whitespace", () => {
assert.equal(
Parser.cleanText("  Hello   World \n"),
"Hello World"
);
});

test("cleanText handles null values", () => {
assert.equal(Parser.cleanText(null), "");
assert.equal(Parser.cleanText(undefined), "");
});

// 2. Tag normalization
test("normalizeTags removes empty and duplicate tags", () => {
const result = Parser.normalizeTags([
" Action ",
"Drama",
"",
"Action",
null
]);

assert.deepEqual(Array.from(result), [
"Action",
"Drama"
]);
});

// 3. Comic normalization
test("normalizeComic returns standard comic data", () => {
const result = Parser.normalizeComic({
id: " comic_001 ",
title: " Example Comic ",
cover: "https://example.com/cover.jpg",
subtitle: " Demo ",
tags: ["Action", "Drama"],
description: " Example description "
});

assert.equal(result.id, "comic_001");
assert.equal(result.title, "Example Comic");
assert.equal(result.subtitle, "Demo");
assert.equal(result.description, "Example description");
assert.deepEqual(Array.from(result.tags), [
"Action",
"Drama"
]);
});

test("normalizeComic rejects missing IDs", () => {
assert.throws(
() => Parser.normalizeComic({ title: "Example" }),
/Comic ID is missing/
);
});

test("normalizeComic rejects missing titles", () => {
assert.throws(
() => Parser.normalizeComic({ id: "comic_001" }),
/Comic title is missing/
);
});

// 4. Pagination
test("paginate returns the requested page", () => {
const items = [1, 2, 3, 4, 5];

const result = Parser.paginate(items, 2, 2);

assert.deepEqual(Array.from(result.comics), [3, 4]);
assert.equal(result.page, 2);
assert.equal(result.pageSize, 2);
assert.equal(result.totalItems, 5);
assert.equal(result.maxPage, 3);
});

test("paginate handles empty lists", () => {
const result = Parser.paginate([], 1, 2);

assert.equal(result.comics.length, 0);
assert.equal(result.maxPage, 1);
});

test("paginate rejects non-array input", () => {
assert.throws(
() => Parser.paginate(null, 1, 10),
/must be an array/
);
});

// 5. Image URL validation
test("validateImageUrls filters invalid URLs", () => {
const result = Parser.validateImageUrls([
"https://example.com/1.jpg",
"http://example.com/2.png",
"javascript:alert(1)",
"",
null
]);

assert.deepEqual(Array.from(result), [
"https://example.com/1.jpg",
"http://example.com/2.png"
]);
});

test("validateImageUrls rejects non-array input", () => {
assert.throws(
() => Parser.validateImageUrls(null),
/must be an array/
);
});

// 6. Chapter normalization
test("normalizeChapters removes invalid entries", () => {
const result = Parser.normalizeChapters({
chapter_1: " Chapter One ",
chapter_2: "Chapter Two",
"": "Invalid",
chapter_3: "   "
});

assert.equal(result.chapter_1, "Chapter One");
assert.equal(result.chapter_2, "Chapter Two");
assert.equal(Object.keys(result).length, 2);
});

test("normalizeChapters handles empty input", () => {
assert.deepEqual(
Parser.normalizeChapters(null),
{}
);
});