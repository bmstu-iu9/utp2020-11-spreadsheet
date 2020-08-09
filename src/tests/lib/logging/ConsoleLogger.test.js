import sinon from 'sinon';
import * as assert from 'assert';
import logLevel from '../../../lib/logging/logLevel.js';
import ConsoleLogger from '../../../lib/logging/ConsoleLogger.js';

describe('ConsoleLogger', () => {
  describe('#addLog()', () => {
    it('should write message to stdout', () => {
      const message = 'test message';
      let called = false;
      sinon.stub(process.stdout, 'write').callsFake((outputMessage) => {
        called = true;
        assert.strictEqual(outputMessage, `${message}\n`);
      });
      const logger = new ConsoleLogger(logLevel.info);
      logger.addLog(message);
      assert.strictEqual(called, true);
      sinon.restore();
    });
  });
});
