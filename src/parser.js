/**
 * Simple Parser for to support a few markdown-like options
 * 
 * @param {sting} value Input string to format
 * @return {string} The HTML formatted string.
 */
function parseTableFields(value){
    const returnValue = value
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\_{(.*?)}/gim, '<sub>$1</sub>')
        .replace(/\^{(.*?)}/gim, '<sup>$1</sup>');

    return returnValue;
}

module.exports.parseTableFields = parseTableFields