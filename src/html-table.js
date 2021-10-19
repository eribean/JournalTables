import parseTableFields from "./parser.js";

/**
 * Takes a JSON of table parameters and options and creates a valid HTML
 * string.
 * 
 * @param {JSON} tableParameters dictionary of parameters pulled from the table
 * @param {JSON} tableOptions dictionary of table options 
 * @return {string} HTML string that populates the table
 */
 function drawAPATable(tableParameters, tableOptions){
    const fontsize = tableOptions.Fontsize;
    const rowHeight = tableOptions.RowHeight;
    const colWidth = tableParameters.ColumnWidths;

    // Get the Total Width and Default Group Spacers
    let width = colWidth.reduce((x, y) => (x + y)) + 30;

    const apaTitle = createAPATitle(tableParameters.Title, tableParameters.TableNumber,
                                    width, fontsize);

    const apaTable = '<table id="theAPATable" class="apa-table-bt apa-table-bb">';    

    // Assign Groups if applicable
    let apaGroups = '';
    if(tableParameters.hasOwnProperty('Groups') && tableParameters.Groups.length > 0){
        [apaGroups, width] = createAPAGroupHeader(tableParameters, width);
    }

    const apaHeader = createAPAHeader();

    const apaData = createAPAData();
   
    const apaEnd = '</table>';

    const apaFooter = createAPAFooter(tableParameters.Footer, fontsize);

    const tableEnd = '</div>';

    // Return all the strings combined
    return [apaTitle, apaTable, apaGroups, 
            apaHeader, apaData, apaEnd, apaFooter, tableEnd].join('');
}

/**
 * Opens and creates the Table title for the APA Table, string
 * is open ended requiring another </div> to close out the string.
 * 
 * @param {string} theTableTitle Unformatted Table String
 * @param {int} tableNumber the number of the table
 * @param {int} width the total width of the table
 * @param {int} fontsize text fontsize in pts
 * @return {string} Beginning HTML Header
 */
 function createAPATitle(theTableTitle, tableNumber, width, fontsize){
    const theTitle = parseTableFields(theTableTitle);

    const apaLabel = 
        `<div id="apaDIV" class='apa-table-title apa-table-font' style='width: ${width}px; font-size:${fontsize}pt' data-width=${width}>
            <p id="theAPATableID" class='apa-table-bold' style="margin-bottom: 0.5rem">Table ${tableNumber}</p>
            <p id="theAPATitleID" class='apa-table-emphasis>${theTitle}</p>`;
    
    return apaLabel;
}

/**
 * Formats the Group Header for a split header format if necessary
 * @param {string} theTableTitle Unformatted Table String
 * @param {int} width the total width of the table
 * @return {String} Empty String or group header
 * @return {int} Updated table width
 */
function createAPAGroupHeader(tableParameters, width){
    const headerSpacer = tableParameters.Headers.map(() => '');
    const groupSpacer = [...headerSpacer];
    const dataSpacer = [...headerSpacer];

    let spacerWidth = tableParameters.hasOwnProperty('SpacerWidth') 
                      ? tableParameters.SpacerWidth : 30;

    // Get the Unique Groups (filter out nulls and spaces)
    let validGroups = [...new Set(tableParameters.Groups)]
                      .filter( (x) => {return (x !== "" && x !== null && x !== " ")});

    // Add padding for the new spaces
    width += (spacerWidth * validGroups.length);

    let colSpans = tableParameters.Groups.map((group, ndx, arrayReference) => {
        let headerValue = "";
        let groupValue = "";
        let dataValue = "";
        let returnValue = 1;

        if(validGroups.includes(group)){
            if(arrayReference.indexOf(group) === ndx){
                returnValue = arrayReference.lastIndexOf(group) -
                              arrayReference.indexOf(group) + 1;
                headerValue = `<td style='width:${spacerWidth}px;'></td>`;
                groupValue = `<td colspan="1"></td>`;
                dataValue = "<td></td>";
            } else{
                returnValue = 0;
            }
        }
        
        headerSpacer[ndx] = headerValue;
        groupSpacer[ndx] = groupValue;
        dataSpacer[ndx] = dataValue;

        return returnValue;
    })

    // Create the Group Header
    const apaGroups = '<tr id="apaGroupRow" class="apa-table-header-height" style="vertical-align: bottom;">' +
                      tableParameters.Groups
                        .map((group, ndx) => {
                            let tableData = groupSpacer[ndx];
                            let columnSpan = colSpans[ndx];

                            if(columnSpan){
                                let theValue = '';
                                let theClass = '';

                                if(validGroups.includes(group)){
                                    theValue = parseTableFields(group);
                                    theClass = 'apa-table-group-format';
                                }

                                tableData += `<td class=${theClass} colspan="${columnSpan}">${theValue}</td>`;
                            }
                            return tableData;
                        })
                        .join('') + '</tr>';

    return [apaGroups, width];
}
/**
 * 
 */
 function createAPAData(){
    // Assign the Table Data
    let apaData = tableParameters.Data.map((tableRow, row) => {
        return `<tr style="height: ${rowHeight}px">` + 
          tableRow.map((tableData, col) => {
            try{
                classList = tableParameters.Style.Data[row][col];
            } catch{
                classList = ''
            }
            theValue = '';
            if(tableData !== null) theValue = tableData;
            theValue = parseTableFields(theValue);

            return dataSpacer[col] + 
                `<td><div class="${classList}">${theValue}</div></td>`;})
        .join('') + '</tr>'
    }).join('');
 }

/**
 * 
 */
 function createAPAHeader(){
    // Assign Header
    const apaHeader = '<tr id="apaHeaderRow" class="apa-table-header-height apa-table-bb">' +
                    theParameters.Headers.map((header, ndx) => {
                        try{
                            classList = theParameters.Style.Headers[ndx];
                        } catch{
                            classList = '';
                        }
                        theValue = '';
                        if(header !== null) theValue = header;
                        theValue = parseTableFields(theValue);

                        return headerSpacer[ndx] +
                            `<td style="width: ${colWidth[ndx]}px;"><div class="${classList}">${theValue}</div></td>`;
                    })
                    .join('') + '</tr>';
    return apaHeader;
}

/**
 * Creates the APA Table Footer
 * 
 * @param {String} footerString String of unformatted footer
 * @param {int} fontsize Size of the font below the table
 * @return {String} HTML string
 */
function createAPAFooter(footerString, fontsize){
    let theFooter = parseTableFields(footerString);

    if(footerString.length > 0){
        theFooter = `<em>Note.</em> ${theFooter}`;
    }

    const apaFooter = `<div id="apaFooter" class="apa-table-footer" style='font-size: ${fontsize-2}pt;'>${theFooter}</div>`;

    return apaFooter;
}

export default drawAPATable