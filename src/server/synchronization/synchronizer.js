import fs from 'fs';

const copyJson = (json) => JSON.parse(JSON.stringify(json));

export default class Synchronizer {
  constructor(pathToWorkbook, page) {
    this.jsonWorkbook = JSON.parse(fs.readFileSync(pathToWorkbook));
    this.page = page;
    this.logs = [];
    this.cancelChange = 0;
    this.IDlogs = 0;

    this.lastJsonWorkbook = copyJson(this.jsonWorkbook);
    this.lastPosLogs = 0;
  }

  static maxLogSize() {
    return 20;
  } // длина максимального возможного отката - Ctrl+Z

  static minLogSize() {
    return 10;
  } // длина максимального возможного лога

  addLog(log, check = true) {
    this.IDlogs += 1;
    switch (log.type) {
      case 'cancelChange': {
        if (this.cancelChange === Synchronizer.minLogSize()
        || this.cancelChange === this.logs.length) {
          throw new TypeError('roll back log change more change log');
        }
        this.cancelChange += 1;
        break;
      }
      case 'cancelСancelChange': {
        if (this.cancelChange === 0) {
          throw new TypeError('haven\'t cansel roll back log');
        }
        this.cancelChange -= 1;
        break;
      }
      default: {
        if (this.cancelChange !== 0) {
          if (this.logs.length - this.cancelChange < this.lastPosLogs) {
            this.lastJsonWorkbook = copyJson(this.jsonWorkbook);
            this.lastPosLogs = 0;
          }
          this.logs = this.logs.slice(0, this.logs.length - this.cancelChange);
          this.cancelChange = 0;
        }
        this.logs.push(log);
        if (check) {
          this.updateLogSize();
        }
      }
    }
  }

  addArrayLogs(arrayLogs) {
    arrayLogs.forEach((log) => this.addLog(log, false));
    this.updateLogSize();
  }

  updateLogSize() {
    if (this.logs.length > Synchronizer.maxLogSize()) {
      if (this.logs.length - Synchronizer.minLogSize() === this.lastPosLogs) {
        this.jsonWorkbook = copyJson(this.lastJsonWorkbook);
        this.lastPosLogs = 0;
      } else if (this.logs.length - Synchronizer.minLogSize() < this.lastPosLogs) {
        this.updateWorkbook(
          this.jsonWorkbook, 0, this.logs.length - Synchronizer.minLogSize(),
        );
        this.lastPosLogs = this.lastPosLogs + Synchronizer.minLogSize() - this.logs.length;
      } else {
        this.updateWorkbook(
          this.lastJsonWorkbook, this.lastPosLogs, this.logs.length - Synchronizer.minLogSize(),
        );
        this.jsonWorkbook = copyJson(this.lastJsonWorkbook);
        this.lastPosLogs = 0;
      }
      this.logs = this.logs.slice(this.logs.length - Synchronizer.minLogSize(), this.logs.length);
    }
  }

  updateWorkbook(jsonWorkbook = this.lastJsonWorkbook,
    from = this.lastPosLogs, to = this.logs.length - this.cancelChange) {
    this.logs
      .slice(from, to)
      .forEach((log) => {
        switch (log.type) {
          case 'color': {
            const { cells } = jsonWorkbook.sheets[this.page];
            if (cells[log.cellAddress] === undefined) {
              cells[log.cellAddress] = {};
            }
            cells[log.cellAddress].color = log.color;
            break;
          }
          case 'value': {
            const { cells } = jsonWorkbook.sheets[this.page];
            if (cells[log.cellAddress] === undefined) {
              cells[log.cellAddress] = {};
            }
            cells[log.cellAddress].type = log.valueType;
            cells[log.cellAddress].value = log.value;
            break;
          }
          default:
            throw new TypeError('undefined log change type');
        }
      });
    return jsonWorkbook;
  }

  synchronize() {
    if (this.logs.length - this.cancelChange !== this.lastPosLogs) {
      if (this.logs.length - this.cancelChange < this.lastPosLogs) {
        this.lastJsonWorkbook = copyJson(this.jsonWorkbook);
        this.lastPosLogs = 0;
      }
      this.updateWorkbook();
      this.lastPosLogs = this.logs.length - this.cancelChange;
    }
    return { ID: this.IDlogs, jsonWorkbook: this.lastJsonWorkbook };
  }
}
