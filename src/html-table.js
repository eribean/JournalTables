import parseTableFields from "./parser.js";

/**
 * Takes a JSON of table parameters and options and creates a valid HTML
 * string.
 * 
 * @param {JSON} tableParameters dictionary of parameters pulled from the table
 * @param {JSON} tableOptions dictionary of table options 
 * @return {string} HTML string that populates the table
 */
function drawJTable(tableParameters, tableOptions) {
    // Get the Total Width and Default Group Spacers
    let width = tableParameters.ColumnWidths.reduce((x, y) => (x + y)) + 30;
    const headerSpacer = tableParameters.Headers.map(() => '');
    const groupSpacer = [...headerSpacer];
    const dataSpacer = [...headerSpacer];

    const jtTitle = createJTTitle(width, tableParameters, tableOptions);

    const style = [tableOptions.jtBorderTop, tableOptions.jtBorderBottom,
                   "border-collapse: collapse;"].join(" ");
    const jtTable = `<table id="${tableOptions.jtTableId}" style="${style}">`;

    // Assign Groups if applicable
    let jtGroups = '';
    if (tableParameters.hasOwnProperty('Groups') && tableParameters.Groups.length > 0) {
        [jtGroups, width, headerSpacer, groupSpacer, dataSpacer] = 
            createJTGroupHeader(width, tableParameters, tableOptions);
    }

    const jtHeader = createJTHeader(tableParameters, tableOptions, headerSpacer);

    const jtData = createJTData(tableParameters, tableOptions, dataSpacer);

    const jtEnd = '</table>';

    const jtFooter = createJTFooter(tableParameters, tableOptions);

    const tableEnd = '</div>';

    // Return all the strings combined
    return [jtTitle, jtTable, jtGroups,
        jtHeader, jtData, jtEnd, jtFooter, tableEnd].join('');
}

/**
 * Opens and creates the Table title for the Journal Table, string
 * is open ended requiring another </div> to close out the string.
 * 
 * @param {int} width the total width of the table
 * @param {JSON} tableParameters dictionary of table parameters
 * @param {JSON} tableOptions dictionary of table options
 * @return {string} Beginning HTML Header
 */
function createJTTitle(width, tableParameters, tableOptions) {
    const theTitle = parseTableFields(tableParameters.TableTitle);
    const tableNumber = tableParameters.TableNumber;

    const style = [tableOptions.jtTitle, tableOptions.jtFont, 
        `width: ${width}px;`, `font-size: ${tableParameters.FontSize}pt;`].join(' ');

    const jtLabel =
        `<div id="${tableOptions.jtDivId}" style="${style}" data-width=${width}>
            <p style="${tableOptions.jtBold + "margin-bottom: 0.5rem"}">Table ${tableNumber}</p>
            <p style="${tableOptions.jtEmphasis}">${theTitle}</p>`;

    return jtLabel;
}

/**
 * Formats the Group Header for a split header format if necessary
 * 
 * @param {int} width the total width of the table
 * @param {JSON} tableParameters dictionary of table parameters
 * @param {JSON} tableOptions dictionary of table options
 * @return {string} Empty String or group header
 * @return {int} Updated table width
 */
function createJTGroupHeader(width, tableParameters, tableOptions,
    headerSpacer, groupSpacer, dataSpacer) {

    let spacerWidth = tableParameters.hasOwnProperty('SpacerWidth')
        ? tableParameters.SpacerWidth : 30;

    // Get the Unique Groups (filter out nulls and spaces)
    let validGroups = [...new Set(tableParameters.Groups)]
        .filter((x) => { return (x !== "" && x !== null && x !== " ") });

    // Add padding for the new spaces
    width += (spacerWidth * validGroups.length);

    let colSpans = tableParameters.Groups.map((group, ndx, arrayReference) => {
        let headerValue = "";
        let groupValue = "";
        let dataValue = "";
        let returnValue = 1;

        if (validGroups.includes(group)) {
            if (arrayReference.indexOf(group) === ndx) {
                returnValue = arrayReference.lastIndexOf(group) -
                    arrayReference.indexOf(group) + 1;
                headerValue = `<td style='width:${spacerWidth}px;'></td>`;
                groupValue = `<td colspan="1"></td>`;
                dataValue = "<td></td>";
            } else {
                returnValue = 0;
            }
        }

        headerSpacer[ndx] = headerValue;
        groupSpacer[ndx] = groupValue;
        dataSpacer[ndx] = dataValue;

        return [returnValue, width, headerSpacer, groupSpacer, dataSpacer];
    })

    // Create the Group Header
    const groupStyle = [tableOptions.jtHeaderHeight, "vertical-align: bottom;"].join(" ");
    const tableGroupStyle = [tableOptions.jtCenterAlign, tableOptions.jtBorderBottom].join(" ");
    const jtGroups = `<tr style="${groupStyle}">` +
        tableParameters.Groups
            .map((group, ndx) => {
                let tableData = groupSpacer[ndx];
                let columnSpan = colSpans[ndx];

                if (columnSpan) {
                    let theValue = '';
                    let theStyle = '';

                    if (validGroups.includes(group)) {
                        theValue = parseTableFields(group);
                        theStyle = tableGroupStyle;
                    }

                    tableData += `<td style="${theStyle}" colspan="${columnSpan}">${theValue}</td>`;
                }
                return tableData;
            })
            .join('') + '</tr>';

    return [jtGroups, width, headerSpacer, groupSpacer, dataSpacer];
}


/**
 * Creates the Journal Table Formatted Header
 * 
 * @param {JSON} tableParameters dictionary of table parameters
 * @param {JSON} tableOptions dictionary of table options
 * @return {String} HTML String off Journal Table Header
 */
function createJTHeader(tableParameters, tableOptions, headerSpacer) {
    let headerValue, styleList;

    const style = [tableOptions.jtHeaderHeight, 
        tableOptions.jtBorderBottom].join(" ");

    const jtHeader =
        `<tr style="${style}">` +
        tableParameters.Headers.map((header, ndx) => {
            styleList = cellStyleParser(tableParameters.Style.Headers[ndx], tableOptions);
            headerValue = '';

            if (header !== null) headerValue = header;

            headerValue = parseTableFields(headerValue);

            return headerSpacer[ndx] +
                `<td style="width: ${tableParameters.ColumnWidths[ndx]}px;"><div style='${styleList}'>${headerValue}</div></td>`;
        }).join('') + '</tr>';

    return jtHeader;
}


/**
 * Creates the Journal Table Formatted Body
 * 
 * @param {JSON} tableParameters dictionary of table parameters
 * @param {JSON} tableOptions dictionary of table options
 * @return {String} HTML String of table data
 */
function createJTData(tableParameters, tableOptions, dataSpacer) {
    const tableData = tableParameters.Data;
    const tableDataStyles = tableParameters.Style.Data;

    let rowValue, styleList;

    // Assign the Table Data
    const jtData = tableData.map((tableRow, row) => {
        return `<tr style="${tableOptions.jtRowHeight}">` +
            tableRow.map((tableData, col) => {
                styleList = cellStyleParser(tableDataStyles[row][col], tableOptions);
                rowValue = '';

                if (tableData !== null) rowValue = tableData;
                rowValue = parseTableFields(rowValue);

                return dataSpacer[col] +
                    `<td><div style="${styleList}">${rowValue}</div></td>`;
            }).join('') + '</tr>'
    }).join('');

    return jtData;
}


/**
 * Creates the Journal Table Footer
 * 
 * @param {JSON} tableParameters dictionary with table parameters
 * @param {JSON} tableOptions dictionary with table options
 * @return {String} HTML formatted string
 */
function createJTFooter(tableParameters, tableOptions) {
    let theFooter = parseTableFields(tableParameters.Footer);

    if (tableParameters.Footer.length > 0) {
        theFooter = `<em>Note.</em> ${theFooter}`;
    }
    const style = [tableOptions.Font, tableOptions.jtFooterLineHeight, 
        `font-size: ${tableParameters.FontSize-2}pt;`].join(" ")

    const jtFooter = `<div style="${style}">${theFooter}</div>`;

    return jtFooter;
}


/**
 * Parses Cells applied to individual cells
 * 
 * @param {Array} theStyle the journal table styles
 * @return {String} the inline css string associated with that style
 */
function cellStyleParser(theStyle, tableOptions){
    let styleString = "";
    
    if(theStyle.length){
        styleString = theStyle.map(localStyle => {
            return tableOptions[localStyle];
        }).join(" ")
    }

    return styleString
}

export default drawJTable