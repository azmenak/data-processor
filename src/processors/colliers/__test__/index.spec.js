/* eslint-env node, mocha */

import chai from 'chai';
const should = chai.should(); // eslint-disable-line

import path from 'path';
import constants from '../../../test/constants';
import fs from 'fs-extra-promise';
import _ from 'lodash';

import propMap from '../mapping.json';
import { getDumpData, findParser, parseData } from '../index';

const testFilePath = path.join(constants.examples, 'Colliers/LeaseProperty.xls');
const mappingKeys = [
  'local_id',
  'available',
  'major_use',
  'address',
  'city',
  'state',
  'zip',
  'admin_email'
];

describe('== Colliers ==', function() {
  let testFile;
  let dumpData;

  before(function getTestFileBuffer(done) {
    fs.readFileAsync(testFilePath).then((file) => {
      testFile = file;
      dumpData = getDumpData(testFile).slice(0, 5);
      done();
    }).catch(done)
  });

  describe('mapping.json', () => {
    it('is an object', () => {
      propMap.should.be.an.object;
    });
  });

  describe('#getDumpData()', () => {
    it('returns an array of properties', () => {
      dumpData.should.be.an.array;
    })
  });

  describe('#findParser()', () => {
    it('maps the keys to proper parsers', () => {
      const keys = _.keys(dumpData[0]);
      const parsed = _.compact((_.map(keys, findParser)));
      parsed.length.should.equal(keys.length);
    });

    it('finds the correct parser key', () => {
      findParser('PropertyID').should.be.equal('local_id');
    });
  });

  describe('#parseData()', () => {
    let parsedData;
    before(function parseMappingData() {
      parsedData = parseData(dumpData);
    });

    it('mapped data should be an array', () => {
      parsedData.should.be.an.array;
    });

    it('has mapped to the keys in mapping.json', () => {
      parsedData[0].should.include.keys(mappingKeys);
    })
  })
})
