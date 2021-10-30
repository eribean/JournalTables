import drawJTable, {
    createJTTitle,
    createJTFooter, 
    cellStyleParser
} from '../src/html-table.js';

const tableOptions = {
    jtTag1: 'Hi',
    jtTag2: "Bye",
    jtFont: "Times",
    jtTitle: "Dude",
    jtFooterLineHeight: '23',
    jtDivId: "Test",
    jtBold: "Bold",
    jtEmphasis: "Emphasis"
}

// The Cell Parser
test('Testing Cell Parser Blank Input', () => {
    expect(cellStyleParser([], tableOptions))
    .toBe("");
});

test('Testing Cell Parser Two Inputs', () => {
    expect(cellStyleParser(['jtTag1', 'jtTag2'], tableOptions))
    .toBe("Hi Bye");
});

test('Testing Cell Bad Input', () => {
    expect(cellStyleParser(['jtTag3'], tableOptions))
    .toBe("");
});

// Test the Footer
test("Test Blank Table Footer", () => {
    const tableParameters = {Footer: "", FontSize: 12};

    expect(createJTFooter(tableParameters, tableOptions))
    .toBe('<div style="Times 23 font-size: 10pt;"></div>');
});

test("Test Filled Table Footer", () => {
    const tableParameters = {Footer: "This is Dope", FontSize: 12};

    expect(createJTFooter(tableParameters, tableOptions))
    .toBe('<div style="Times 23 font-size: 10pt;"><em>Note.</em> This is Dope</div>');
});

// Test the Title
test("Test Table Title", () => {
    const tableParameters = {TableTitle: "The Table", TableNumber: 2, FontSize: 12};

    const expected = `<div id="Test" style="Dude Times width: 25px; font-size: 12pt;" data-width=25>
            <p style="Boldmargin-bottom: 0.5rem">Table 2</p>
            <p style="Emphasis">The Table</p>`

    expect(createJTTitle(25, tableParameters, tableOptions))
    .toBe(expected);
});