const parser = require('./src/parser')
/**
 * Class Definition for Journal Tables
 * 
 * @param {string} format Format to create APA Table [APA7]
 */
class JournalTables {
    constructor(){
        // Eventually allow other options
        this.format = 'APA7';
    }

    /**
     * 
     * @param {JSON} tableParameters dictionary with table parameters
     * @return {string} string of html table
     */
    createHTMLTable(tableParameters){

        return parser.parseTableFields(tableParameters)

    }

    /**
     * Creates a .docx table for word / google docs / open office
     * 
     * @param {JSON} tableParameters dictionary with table parameters
     * @return {Blob} blob object to write to file
     */
    createDOCXTable(tableParameters){

    }

}

module.exports = JournalTables
