import drawJTable from './src/html-table.js'

/**
 * Default options for APA 7
 * 
 * Inline style so a CSS isn't needed
 */
const defaultTableOptions = {
  jtDivId: "jtDiv",
  jtTableId: "jtTable",
  jtTitle: "padding: 15px;",
  jtFont: "font-family: 'Times New Roman', Times, sans-serif;",
  jtBold: "font-weight: bold;",
  jtEmphasis: "font-style: italic;",
  jtUnderline: "text-decoration: underline;",
  jtLeftAlign: "text-align: left;",
  jtCenterAlign: "text-align: center;",
  jtRightAlign: "text-align: right;",
  jtTabAlign: "text-indent: 1.5em;",
  jtRowHeight: "height: 30px;",
  jtHeaderHeight: "height: 35px;",
  jtBorderTop: "border-top: solid rgba(0, 0, 0, 0.7) 1px;",
  jtBorderBottom: "border-bottom: solid rgba(0, 0, 0, 0.7) 1px;",
  jtFooterLineHeight: "line-height: 2;"
}

/**
 * Class Definition for Journal Tables
 * 
 * @param {string} format Format to create APA Table [APA7]
 */
class JournalTables {
  constructor() {
    // Eventually allow other options
    this.format = 'APA7';
    this.tableOptions = defaultTableOptions;
  }

  /**
   * 
   * @param {JSON} tableParameters dictionary with table parameters
   * @return {string} string of html table
   */
  createHTMLTable(tableParameters) {
    const theHTMLString = drawJTable(tableParameters, this.tableOptions);
    return theHTMLString;
  }

  /**
   * Creates a .docx table for word / google docs / open office
   * 
   * @param {JSON} tableParameters dictionary with table parameters
   * @return {Blob} blob object to write to file
   */
  createDOCXTable(tableParameters) {

  }
}

export default JournalTables
