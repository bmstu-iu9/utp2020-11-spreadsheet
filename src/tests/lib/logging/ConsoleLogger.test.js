import sinon from 'sinon';
import * as assert from 'assert';
import logLevel from '../../../lib/logging/logLevel.js';
import ConsoleLogger from '../../../lib/logging/ConsoleLogger.js';

describe('ConsoleLogger', () => {
  describe('#addLog()', () => {
    it('should write message to stdout', () => {
      let passed = false;
      const message = 'test message';
      sinon.stub(process.stdout, 'write').callsFake((inputMessage) => {
        passed = message === inputMessage;
      });
      const logger = new ConsoleLogger(logLevel.info);
      logger.addLog(message);
      assert.strictEqual(passed, true);
    });
  });
});
