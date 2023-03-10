import { expect, it, describe } from 'vitest';
import { testServer } from '~/utils/testContext';

describe('auth', () => {
  it('should be true', async () => {
    const { query } = await testServer();
    const q = `
      getUser {
        user(id: "1"){
          id
        }
      } 
    `;
    const { body } = await query(q);
    // @ts-ignore
    expect(body?.singleResult?.data.user).toBeNull();
  });
});
