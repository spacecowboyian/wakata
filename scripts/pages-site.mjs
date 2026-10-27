import assert from 'node:assert/strict';
import { cp, lstat, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

async function checkTree(root, storage = false) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (storage && entry.name === '.git') continue;
    assert.ok(
      !['.git', '.gitattributes', '.gitignore', '.gitmodules'].includes(entry.name),
      'Artifacts cannot contain Git metadata',
    );
    const path = resolve(root, entry.name);
    const stat = await lstat(path);
    assert.ok(!stat.isSymbolicLink(), `Symlink rejected: ${path}`);
    assert.ok(stat.isFile() || stat.isDirectory(), `Non-static file rejected: ${path}`);
    if (stat.isDirectory()) await checkTree(path);
  }
}

export async function updateSite(site, operation, number, bundle) {
  assert.ok(['main', 'preview', 'remove'].includes(operation), 'Invalid operation');
  if (operation !== 'main') {
    assert.ok(
      typeof number === 'string' && /^[1-9]\d*$/.test(number) && number === number.trim(),
      'Invalid PR number',
    );
  }
  site = resolve(site);
  await mkdir(site, { recursive: true });
  await checkTree(site, true);
  if (operation !== 'remove') {
    bundle = resolve(bundle);
    await checkTree(bundle);
    const names = await readdir(bundle);
    assert.ok(!names.includes('pr'), 'The pr directory is reserved for previews');
    assert.ok(!names.includes('.github'), 'Artifacts cannot contain workflows');
    for (const name of ['index.html', 'iframe.html', 'index.json']) {
      assert.ok((await lstat(resolve(bundle, name))).isFile(), `Missing ${name}`);
    }
  }
  const target = operation === 'main' ? site : resolve(site, 'pr', number);
  if (operation === 'main') {
    for (const name of await readdir(site)) {
      if (name !== 'pr' && name !== '.git') await rm(resolve(site, name), { recursive: true });
    }
  } else {
    await rm(target, { recursive: true, force: true });
  }
  if (operation !== 'remove') {
    await mkdir(target, { recursive: true });
    for (const name of await readdir(bundle)) {
      await cp(resolve(bundle, name), resolve(target, name), { recursive: true });
    }
  }
  await writeFile(resolve(site, '.nojekyll'), '');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await updateSite(...process.argv.slice(2));
}
