import { test, expect } from "@jest/globals";
import { getUrlsFromHtml, normalizeUrl } from "./crawl";

test('protocol does not matter', () => {
    expect(normalizeUrl("http://test.com")).toBe('test.com')
    expect(normalizeUrl("https://test.com")).toBe('test.com')
});

test('query string removed', () => {
    expect(normalizeUrl("http://test.com/test/other?param=val")).toBe('test.com/test/other')
});
test('trailing slash preserved', () => {
    expect(normalizeUrl("http://test.com/path/?param=val")).toBe('test.com/path/')
});

test('getting all anchor tags', () => {
    expect(getUrlsFromHtml('<body><a href="http://www.test.com/rrr">test</a><a href="/yyy">test relative</a>', 'https://test.com'))
        .toStrictEqual(["http://www.test.com/rrr", "https://test.com/yyy"])
});
