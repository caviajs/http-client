import { HttpClient } from '../src';

it('should handle the error', async () => {
  try {
    await HttpClient
      .request({
        method: 'GET',
        url: 'http://localhost/',
      });
  } catch (e) {
    expect(e.message).toBe('connect ECONNREFUSED ::1:80');
  }
});
