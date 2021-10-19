import drawAPATable from './src/html-table.js'

/**
 * Class Definition for Journal Tables
 * 
 * @param {string} format Format to create APA Table [APA7]
 */
class JournalTables {
    constructor(){
        // Eventually allow other options
        this.format = 'APA7';
        this.tableOptions = defaultTableOptions();
    }

    /**
     * 
     * @param {JSON} tableParameters dictionary with table parameters
     * @return {string} string of html table
     */
    createHTMLTable(tableParameters){
        const theHTMLString = drawAPATable(tableParameters, this.tableOptions);
        return theHTMLString;
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

export default JournalTables
