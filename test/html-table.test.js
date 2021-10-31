import drawJTable, {
    createJTTitle,
    createJTGroupHeader,
    createJTHeader,
    createJTData,
    createJTFooter, 
    cellStyleParser
} from '../src/html-table.js';

const tableOptions = {
    jtTag1: 'Hi',
    jtTag2: "Bye",
    jtFont: "Times",
    jtTitle: "Dude",
    jtHeaderHeight: '24',
    jtFooterLineHeight: '23',
    jtDivId: "Test",
    jtBold: "Bold",
    jtEmphasis: "Emphasis",
    jtRowHeight: "12",
    jtBorderBottom: "Bottom",
    jtCenterAlign: "Middle",
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
            <p style="Emphasis">The Table</p>`;

    expect(createJTTitle(25, tableParameters, tableOptions))
    .toBe(expected);
});

// Test the Data
test("Test Table Data", () => {
    const tableParameters = {
        Data: [["1", "2"], ["3", null]], 
        Style: {
            Data: [[["jtTag1"], ["jtTag2"]], [["jtBold", "jtEmphasis"], [null]]]
        }
    };
    const dataSpacer = ["Space 1", "Space 2"];

    const expected = '<tr style="12">Space 1<td><div style="Hi">1</div></td>' 
    + 'Space 2<td><div style="Bye">2</div></td></tr><tr style="12">'
    + 'Space 1<td><div style="Bold Emphasis">3</div></td>'
    + 'Space 2<td><div style=""></div></td></tr>';

    expect(createJTData(tableParameters, tableOptions, dataSpacer))
    .toBe(expected);
});

// Test Header Data
test("Test Header Data", () => {
    const tableParameters = {
        ColumnWidths: [100, 110, 120],
        Headers: ['Header 1', null, 'Header 3'], 
        Style: {
            Headers: [['jtTitle', 'jtBold'], ['jtEmphasis', 'jtBold'],
                      ['jtDivId', ]]
        }
    };
    const dataSpacer = ["Space 1", "Space 2", "Space 3"];

    const expected = '<tr style="24 Bottom">Space 1<td style="width: 100px;">' 
    + '<div style="Dude Bold">Header 1</div></td>Space 2<td style="width: 110px;">'
    + '<div style="Emphasis Bold"></div></td>Space 3<td style="width: 120px;">'
    + '<div style="Test">Header 3</div></td></tr>';

    expect(createJTHeader(tableParameters, tableOptions, dataSpacer))
    .toBe(expected);
});

// Group Header Data
test("Test Group Header Data", () => {
    const tableParameters = {Groups: ["Hi", "", "Bye", "Bye"]};
    const colSpans = [1, 0, 2, 0];
    const dataSpacer = ["Space 1", "Space 2", "Space 3", "Space 4"];

    const expected = '<tr style="24 vertical-align: bottom;">Space 1' 
    + '<td style="Middle Bottom" colspan="1">Hi</td>Space 2Space 3'
    + '<td style="Middle Bottom" colspan="2">Bye</td>Space 4</tr>';

    expect(createJTGroupHeader(tableParameters, tableOptions, colSpans, dataSpacer))
    .toBe(expected);
});