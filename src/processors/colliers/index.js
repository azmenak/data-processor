import _ from 'lodash';
import propMap from './mapping.json';
import getExcelJSON from '../../utils/getExcelJSON';

export function handler(event, context) {

}

export function findParser(key) {
  return _.findKey(propMap, (val) => {
    if (typeof val === 'string') {
      return key === val;
    } else if (_.isArray(val)) {
      return _.includes(val, key);
    } else if (val.label === key) {
      return true;
    } else {
      return false;
    }
  })
}

export function parseData(data) {
  return _.map(data, (prop) =>
    _.transform(prop, (result, val, key) => {
      const mappedKey = findParser(key);
      const parser = propMap[mappedKey];
      if (val) {
        if (typeof parser === 'string') {
          result[mappedKey] = val;
        } else if (_.isArray(parser)) {
          (result[mappedKey] || (result[mappedKey] = [])).push(val)
        } else {
          switch (parser.type) {
          case 'lowercase':
            result[mappedKey] = val.toLowerCase();
            break;
          case 'integer':
            result[mappedKey] = parseInt(val, 10);
            break;
          case 'float':
            result[mappedKey] = parseFloat(val);
            break;
          case 'enum':
            const enumValue = parser.values[val] || parser.values._default;
            if (enumValue) {
              result[mappedKey] = enumValue;
            }
            break;
          case 'attachement':
            const attachement = { label: mappedKey, file: val.toLowerCase() };
            (result.attachements || (result.attachements = [])).push(attachement);
            break;
          default:
            throw new Error(`Unknown parser type "${parser.type}"`);
          }
        }
      }
    })
  )
}

export function getDumpData(xlsFileBuffer) {
  const data = getExcelJSON(xlsFileBuffer).PropertyImportTemplate;
  return _.drop(data, 1);
}
