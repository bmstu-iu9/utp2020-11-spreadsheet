export default class UuidValidator {
  static isUuidValid(uuid) {
    const regExp = new RegExp(
      '^[a-fA-F0-9]{8}-([a-fA-F0-9]{4}-){3}[a-fA-F0-9]{12}$',
    );
    return regExp.test(uuid);
  }
}
