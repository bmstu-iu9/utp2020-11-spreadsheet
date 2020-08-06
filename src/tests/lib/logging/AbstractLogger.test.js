import * as assert from 'assert';
import NotImplementedError from '../../../lib/errors/NotImplementedError.js';
import AbstractLogger from '../../../lib/logging/AbstractLogger.js';
import logLevel from '../../../lib/logging/logLevel.js';

class TestLogger extends AbstractLogger {
  constructor(level) {
    super(level);
    this.logs = [];
  }

  addLog(message) {
    this.logs.push(message);
  }
}

describe('AbstractLogger', () => {
  describe('#constructor()', () => {
    it('should throw an exception for non-number log level', () => {
      assert.throws(() => {
        new TestLogger('1');
      }, TypeError);
    });
    it('should set correct log level', () => {
      const logger = new TestLogger(logLevel.info);
      assert.strictEqual(logger.logLevel, logLevel.info);
    });
  });
  describe('#acceptLog()', () => {
    it('should log message with the same log level', () => {
      const logger = new TestLogger(logLevel.info);
      const message = 'info message';
      logger.acceptLog(logLevel.info, message);
      assert.deepStrictEqual(logger.logs, [message]);
    });
    it('should not log message with a lower log level', () => {
      const logger = new TestLogger(logLevel.info);
      const message = 'debug message';
      logger.acceptLog(logLevel.debug, message);
      assert.deepStrictEqual(logger.logs, []);
    });
    it('should log message with a higher log level', () => {
      const logger = new TestLogger(logLevel.info);
      const message = 'error message';
      logger.acceptLog(logLevel.error, message);
      assert.deepStrictEqual(logger.logs, [message]);
    });
  });
  describe('#addLog()', () => {
    it('should throw an implementation error', () => {
      const logger = new AbstractLogger(logLevel.critical);
      assert.throws(() => {
        logger.addLog();
      }, NotImplementedError);
    });
  });
});
