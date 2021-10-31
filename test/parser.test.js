import parseTableFields from "../src/parser";

test('Parser Bolds Double Asterisk', () => {
    expect(parseTableFields("This is **bold**"))
    .toBe("This is <strong>bold</strong>");
});

test('Parser Italics Single Asterisk', () => {
    expect(parseTableFields("This is *emphasized*"))
    .toBe("This is <em>emphasized</em>");
});

test('Parser adds super script', () => {
    expect(parseTableFields("This is x^{2}"))
    .toBe("This is x<sup>2</sup>");
});

test('Parser adds sub script', () => {
    expect(parseTableFields("This is x_{2}"))
    .toBe("This is x<sub>2</sub>");
});

test('Parser adds super script in bold', () => {
    expect(parseTableFields("This is x_{**2**}"))
    .toBe("This is x<sub><strong>2</strong></sub>");
});

test('Parser Bolds and Emphasizes in order', () => {
    expect(parseTableFields("This is ** *thing* **"))
    .toBe("This is <strong> <em>thing</em> </strong>");
});