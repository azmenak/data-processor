import xlsx from 'xlsx';
import _ from 'lodash';

export default function getJSON(buffer) {
  return workbookToJSON(xlsx.read(buffer));
}

export function workbookToJSON(workbook) {
  return _.reduce(workbook.SheetNames, (result, sheetName) => {
    const roa = xlsx.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result[sheetName] = roa;
    }
    return result;
  }, {});
}
