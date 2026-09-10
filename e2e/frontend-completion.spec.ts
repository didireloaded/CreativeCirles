import { expect, test, type Page } from '@playwright/test';

const profile = { completed:true,role:'Photographer',interests:['Photography','Film','Design'],availability:'selective',location:'Windhoek',displayName:'Jordan K.',handle:'jordan.creates',bio:'Visual storyteller.' };
const evidenceRoot = '../../work/ui-evidence/frontend-completion';

async function seed(page: Page) {
  await page.addInitScript(value => {
    localStorage.setItem('circle:onboarding:v1', JSON.stringify(value));
    sessionStorage.setItem('circle:entered', '1');
  }, profile);
}
async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
}

test('primary routes remain responsive and visually coherent', async ({ page }, testInfo) => {
  await seed(page);
  for (const route of ['home','discover','tasks','inbox','profile','workspace']) {
    await page.goto(`/${route}`);
    await expect(page.locator('.app-shell')).toBeVisible();
    await expectNoOverflow(page);
    await page.screenshot({ path: `${evidenceRoot}/${testInfo.project.name}-${route}.png`, fullPage: true });
  }
});

test('dashboard meetings remain separate from tasks', async ({ page }, testInfo) => {
  test.skip(!['mobile-390', 'desktop'].includes(testInfo.project.name), 'Capture the mobile and desktop compositions.');
  await seed(page);
  await page.goto('/workspace');
  await page.getByRole('tab', { name: 'Meetings' }).click();
  await expect(page.getByRole('heading', { name: 'Upcoming meetings' })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Your tasks');
  await expectNoOverflow(page);
  await page.waitForTimeout(750);
  await page.screenshot({ path: `${evidenceRoot}/${testInfo.project.name}-dashboard-meetings.png`, fullPage: true });
});

test('a message can become a prefilled task', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'One representative contextual task flow is sufficient.');
  await seed(page);
  await page.goto('/inbox');
  await page.getByRole('button', { name: 'Open conversation with Amara K.' }).click();
  await page.getByRole('button', { name: 'Turn latest message into a task' }).click();
  await expect(page).toHaveURL(/\/tasks/);
  await expect(page.getByLabel('What needs to move forward?')).toHaveValue(/editorial in the dunes/i);
});

test('first-run onboarding validates and preserves choices', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'One representative first-run journey is sufficient.');
  await page.goto('/');
  await page.getByRole('button', { name: /get started/i }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('Choose your primary creative role.')).toBeVisible();
  await page.getByRole('radio', { name: 'Photographer' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  for (const interest of ['Photography','Film','Design']) await page.getByRole('checkbox', { name: interest }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('radio', { name: /Selective/ }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Display name').fill('Jordan K.');
  await page.getByLabel('Handle').fill('jordan.creates');
  await page.getByRole('button', { name: /finish setup/i }).click();
  await expect(page).toHaveURL(/\/home/);
  await page.screenshot({ path: `${evidenceRoot}/onboarding-complete.png`, fullPage: true });
});

test('connected social and creation details work locally', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'Interaction journey is captured at the primary mobile viewport.');
  await seed(page); await page.goto('/home');
  const firstPost = page.locator('.post-media').first();
  await firstPost.click();
  await expect(page.getByRole('dialog', { name: 'Between sand & sky' })).toBeVisible();
  await page.getByLabel('Add a comment').fill('The framing feels intentional.');
  await page.getByRole('button', { name: 'Post comment' }).click();
  await expect(page.getByText('The framing feels intentional.')).toBeVisible();
  await page.screenshot({ path: `${evidenceRoot}/comments.png`, fullPage: true });
  await page.keyboard.press('Escape');
  await expect(firstPost).toBeFocused();

  await page.locator('.post-author-button').first().click();
  await expect(page.getByRole('button', { name: 'Send collaboration request' })).toBeVisible();
  await page.screenshot({ path: `${evidenceRoot}/creator.png`, fullPage: true });
  await page.keyboard.press('Escape');

  await page.locator('.story:not(.add)').first().click();
  await expect(page.getByRole('button', { name: 'Next story' })).toBeVisible();
  await page.screenshot({ path: `${evidenceRoot}/story.png` });
  await page.keyboard.press('Escape');

  await page.locator('button[aria-label="Notifications"]:visible').first().click();
  await expect(page.getByRole('button', { name: 'Mark all as read' })).toBeVisible();
  await page.screenshot({ path: `${evidenceRoot}/notifications.png`, fullPage: true });
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Discover' }).last().click();
  await page.getByRole('button', { name: 'Communities' }).click();
  await page.locator('.ds-circle').first().click();
  await page.getByRole('button', { name: 'Join community' }).click();
  await expect(page.getByRole('button', { name: 'Leave community' })).toBeVisible();
  await page.screenshot({ path: `${evidenceRoot}/community.png`, fullPage: true });
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Events' }).click();
  await page.locator('.ds-event').first().click();
  await expect(page.getByRole('dialog', { name: 'Golden hour photo walk' })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Create' }).last().click();
  await page.getByRole('button', { name: /Post\. Share a quick thought/ }).click();
  await page.getByLabel('Add image, video, or audio').setInputFiles({ name:'frame.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=','base64') });
  await expect(page.getByLabel('image preview')).toBeVisible();
  await page.getByLabel('Add image, video, or audio').setInputFiles({ name:'notes.txt',mimeType:'text/plain',buffer:Buffer.from('not media') });
  await expect(page.getByText('Choose an image, video, or audio file.')).toBeVisible();
  await expect(page.getByLabel('image preview')).toBeVisible();
  await page.screenshot({ path: `${evidenceRoot}/media-preview.png`, fullPage: true });
});

test('reduced motion pauses timed stories and create animation', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'Motion behavior is independent of viewport size.');
  await page.emulateMedia({ reducedMotion: 'reduce' }); await seed(page); await page.goto('/home');
  await page.locator('.story:not(.add)').first().click();
  await expect(page.getByText('Golden light, before the road wakes.')).toBeVisible();
  await page.waitForTimeout(6200);
  await expect(page.getByText('Golden light, before the road wakes.')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Create' }).last().click();
  const duration = await page.locator('.create-menu>button').first().evaluate(element => getComputedStyle(element).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});

test('non-happy states and offline status remain actionable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'State evidence is captured once.');
  await seed(page); await page.goto('/home?state=error');
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  await page.screenshot({ path: `${evidenceRoot}/error.png`, fullPage: true });
  await page.context().setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.getByText('You’re offline')).toBeVisible();
  await page.screenshot({ path: `${evidenceRoot}/offline.png`, fullPage: true });
  await page.context().setOffline(false);
});
