import { HttpClient } from '../src';

it('should handle the error', async () => {
  try {
    await HttpClient
      .request({
        method: 'GET',
        url: 'http://localhost/',
      });
  } catch (e) {
    expect(typeof e.message).toBe('string');
  }
});
