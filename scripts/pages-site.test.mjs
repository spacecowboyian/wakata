import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { updateSite } from './pages-site.mjs';

test('bootstrap, replace main, update previews, and remove only the closed preview', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'wakata-pages-'));
  try {
    const site = join(temp, 'site');
    const bundle = join(temp, 'bundle');
    await mkdir(bundle);
    for (const name of ['index.html', 'iframe.html', 'index.json']) {
      await writeFile(join(bundle, name), 'first');
    }
    await updateSite(site, 'preview', '38', bundle);
    await updateSite(site, 'main', '', bundle);
    await mkdir(join(site, '.git'));
    await writeFile(join(site, '.git', 'keep'), 'git metadata');
    await writeFile(join(site, 'obsolete.js'), '');
    await updateSite(site, 'preview', '39', bundle);
    await writeFile(join(site, 'pr/38/obsolete.js'), '');
    await writeFile(join(bundle, 'index.html'), 'second');
    await updateSite(site, 'preview', '38', bundle);
    assert.equal(await readFile(join(site, 'index.html'), 'utf8'), 'first');
    assert.equal(await readFile(join(site, 'pr/38/index.html'), 'utf8'), 'second');
    assert.ok(!(await readdir(join(site, 'pr/38'))).includes('obsolete.js'));
    await updateSite(site, 'main', '', bundle);
    assert.ok(!(await readdir(site)).includes('obsolete.js'));
    assert.equal(await readFile(join(site, '.git/keep'), 'utf8'), 'git metadata');
    assert.equal(await readFile(join(site, 'pr/39/index.html'), 'utf8'), 'first');
    await updateSite(site, 'remove', '38');
    await updateSite(site, 'remove', '38');
    assert.deepEqual(await readdir(join(site, 'pr')), ['39']);
    assert.equal(await readFile(join(site, 'index.html'), 'utf8'), 'second');
    for (const number of ['../39', '0', '-1', '1/2', '01', '1\n']) {
      await assert.rejects(updateSite(site, 'remove', number), /Invalid PR number/);
    }
    await symlink(join(site, 'index.html'), join(bundle, 'link'));
    await assert.rejects(updateSite(site, 'preview', '40', bundle), /Symlink rejected/);
    await rm(join(bundle, 'link'));
    await mkdir(join(bundle, 'pr'));
    await assert.rejects(updateSite(site, 'main', '', bundle), /reserved/);
    await rm(join(bundle, 'pr'), { recursive: true });
    await mkdir(join(bundle, '.git'));
    await assert.rejects(updateSite(site, 'main', '', bundle), /Git metadata/);
    await rm(join(bundle, '.git'), { recursive: true });
    await symlink(bundle, join(site, 'pr/40'));
    await assert.rejects(updateSite(site, 'remove', '40'), /Symlink rejected/);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
