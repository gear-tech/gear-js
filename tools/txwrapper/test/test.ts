import TEST_METHOD_ARGS, { CODE_TO_UPLOAD } from './TEST_METHOD_ARGS';
import TEST_OPTIONS from './TEST_OPTIONS';
import TEST_BASE_TX_INFO from './TEST_BASE_TX_INFO';
import { methods } from '../src';

describe('gear', () => {
  test('send_message', () => {
    const unsigned = methods.gear.sendMessage(TEST_METHOD_ARGS.gear.sendMessage, TEST_BASE_TX_INFO, TEST_OPTIONS);

    expect(unsigned.method).toBe(
      '0x6803d1af58fc299327124b22a54359150894eda348899e0d431c86ad03bd3cdbc0bc1050494e4700e87648170000000000000000000000000000000000000001',
    );
  });

  test('send_reply', () => {
    const unsigned = methods.gear.sendReply(TEST_METHOD_ARGS.gear.sendReply, TEST_BASE_TX_INFO, TEST_OPTIONS);

    expect(unsigned.method).toBe(
      '0x6804d1af58fc299327124b22a54359150894eda348899e0d431c86ad03bd3cdbc0bc10504f4e4700e87648170000008096980000000000000000000000000001',
    );
  });

  test('upload_code', () => {
    const unsigned = methods.gear.uploadCode(TEST_METHOD_ARGS.gear.uploadCode, TEST_BASE_TX_INFO, TEST_OPTIONS);

    expect(unsigned.method).toBe('0x6800827b0200' + CODE_TO_UPLOAD.slice(2));
  });

  test('upload_program', () => {
    const unsigned = methods.gear.uploadProgram(TEST_METHOD_ARGS.gear.uploadProgram, TEST_BASE_TX_INFO, TEST_OPTIONS);

    expect(unsigned.method).toBe(
      '0x6801827b0200' +
        CODE_TO_UPLOAD.slice(2) +
        '1c307831323334350000e876481700000000000000000000000000000000000000' +
        '01',
    );
  });

  test('claim_value', () => {
    const unsigned = methods.gear.claimValue(TEST_METHOD_ARGS.gear.claimValue, TEST_BASE_TX_INFO, TEST_OPTIONS);

    expect(unsigned.method).toBe('0x6805d1af58fc299327124b22a54359150894eda348899e0d431c86ad03bd3cdbc0bc');
  });

  test('create_program', () => {
    const unsigned = methods.gear.createProgram(TEST_METHOD_ARGS.gear.createProgram, TEST_BASE_TX_INFO, TEST_OPTIONS);

    expect(unsigned.method).toBe(
      '0x6802d1af58fc299327124b22a54359150894eda348899e0d431c86ad03bd3cdbc0bc0812340000e87648170000000000000000000000000000000000000001',
    );
  });
});
