const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const images = {
'poulet-braise':'exec-20760c8e-b55c-43e5-9984-067fa06714de.png',
'assortiment':'exec-fde88cc0-c569-4aa5-9d76-5b4699d05a1e.png',
'buffet':'exec-08d776b8-42bb-428f-b780-f149c201e570.png',
'entrees':'exec-dbc3c6b0-ed02-4651-9915-60246f2b131e.png',
'six-assiettes':'exec-02c72e9c-1f5d-432c-b274-acf6a028b92a.png',
'desserts':'exec-1540f8d2-8712-4424-ac68-5fd250d65459.png',
'boisson':'exec-4d5b5714-b2e6-4eb3-aef8-c746eda50c41.png',
'buffet-portrait':'exec-2b13dfc5-e9dd-44c1-9859-9ee2e444545b.png',
'logo':'exec-8f68c5ae-3173-4cda-9f57-4db0a5004396.png'};
(async()=>{
 await fs.mkdir('public/media',{recursive:true});
 for (const [name,file] of Object.entries(images)) {
  for (const width of name==='logo'?[160,400]:[480,960,1440]) {
   await sharp(path.join('/workspace/generated_images',file)).resize({width,withoutEnlargement:true}).webp({quality:83}).toFile(`public/media/${name}-${width}.webp`);
  }
 }
 await fs.writeFile('data/media-provenance.json',JSON.stringify({type:'Visuels recréés par IA à partir des photos du client. Déclinaison chromatique du logo également recréée ; pas le fichier original.',images},null,2)+'\n');
 console.log('Images optimisées en WebP, originaux conservés.');
})().catch(e=>{console.error(e);process.exit(1)});
