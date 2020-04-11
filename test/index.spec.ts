import * as index from '../src/index';

describe('Index', () => {
  test('should return 10 exports', () => {
    expect(Object.keys(index)).toHaveLength(10);
  });
});