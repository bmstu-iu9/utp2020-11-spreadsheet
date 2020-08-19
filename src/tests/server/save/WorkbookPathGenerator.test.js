import * as assert from 'assert';
import WorkbookPathGenerator from '../../../server/save/WorkbookPathGenerator.js';

describe('WorkbookPathGenerator', () => {
  describe('#constructor()', () => {
    it('should create an object with correct fields', () => {
      const pathToWorkbooks = '.';
      const generator = new WorkbookPathGenerator(pathToWorkbooks);
      assert.strictEqual(generator.pathToWorkbooks, pathToWorkbooks);
    });
    it('should throw an exception for non-string path', () => {
      assert.throws(() => {
        new WorkbookPathGenerator(1);
      }, TypeError);
    });
  });
  describe('#generate()', () => {
    it('should return workbooks/2.json', () => {
      const generator = new WorkbookPathGenerator('workbooks');
      const result = generator.generate(2);
      assert.strictEqual(result, 'workbooks/2.json');
    });
  });
});
