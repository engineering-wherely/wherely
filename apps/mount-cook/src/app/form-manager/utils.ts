import type { Maybe } from 'np-westland/types';
import type { Page } from './types';

export async function listAll<T>(
  fetch: (nextToken?: Maybe<string>) => Promise<Page<T>>
) {
  const records: T[] = [];
  let token: Maybe<string>;
  do {
    const page = await fetch(token);
    if (page.errors?.length) {
      throw new Error(page.errors.map((error) => error.message).join('; '));
    }
    records.push(...page.data);
    token = page.nextToken;
  } while (token);
  return records;
}
