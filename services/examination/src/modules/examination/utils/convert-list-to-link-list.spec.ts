import { convertListToLinkList } from './convert-list-to-link-list';

describe('ConvertListToLinkList Tests', () => {
  test('list to link list', () => {
    const presets = [
      { _id: '2', prev: '1', next: null },
      { _id: '3', prev: null, next: null },
      { _id: '1', prev: null, next: '2' },
    ];

    const results = convertListToLinkList(presets, []);

    expect(results.length).toBe(2);
    expect(results[0]._id).toBe('1');
    expect(results[1]._id).toBe('2');
  });
});
