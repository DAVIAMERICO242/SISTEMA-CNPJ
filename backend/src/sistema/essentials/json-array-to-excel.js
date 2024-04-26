const XLSX = require('xlsx');
async function array_json_to_excel(future_excel,prefix){
    const ws = XLSX.utils.json_to_sheet(future_excel);

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the workbook to a file
    XLSX.writeFile(wb, `CNPJS_${prefix}.xlsx`);
}

module.exports={
    array_json_to_excel
}