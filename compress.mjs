import sharp from 'sharp';
import { readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';

async function run() {
  const files = await readdir('./public/fleet').catch(() => []);
  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
    const name = file.replace(/\.(jpg|jpeg|png)$/i, "");
    const srcPath = `./public/fleet/${file}`;
    await sharp(srcPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`./public/fleet/${name}.webp`);
    await unlink(srcPath);
    console.log(`[Generated] fleet/${name}.webp (source ${file} supprimée)`);
  }

  if (existsSync('./public/hero.jpg')) {
    await sharp('./public/hero.jpg')
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile('./public/hero.webp');
    console.log('[Generated] hero.webp');

    await sharp('./public/hero.jpg')
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 75, mozjpeg: true, progressive: true })
      .toFile('./public/og-hero.jpg');
    console.log('[Generated] og-hero.jpg (OpenGraph 1200x630)');

    await unlink('./public/hero.jpg');
    console.log('[Cleaned] hero.jpg supprimé');
  } else {
    console.warn('⚠️ [Avertissement] hero.jpg introuvable dans public/. Assurez-vous d\'avoir hero.webp et og-hero.jpg déjà présents.');
  }

  if (existsSync('./public/meeting-point.jpg')) {
    await sharp('./public/meeting-point.jpg')
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile('./public/meeting-point.webp');
    await unlink('./public/meeting-point.jpg');
    console.log('[Generated] meeting-point.webp (source meeting-point.jpg supprimée)');
  } else {
    console.log('[Skipped] meeting-point.jpg not found');
  }

  console.log('DONE.');
}

run();