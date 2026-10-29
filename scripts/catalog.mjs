export const productUrl=id=>`./produit-${id}.html`;
const descriptions={
  yassa:'Poulet, oignons fondants et riz : le yassa de la carte de Dina.',
  mafe:'Une sauce arachide servie avec du riz. La viande et la composition complète sont à confirmer auprès du restaurant.',
  thieb:'Poulet, riz et légumes : le thiéb bou guinar de la carte de Dina. Composition et disponibilités à confirmer auprès du restaurant.',
  thiou:'Le thiou proposé par La Cuisine de Dina. Contactez le restaurant pour connaître sa composition et ses accompagnements.',
  saka:'Le saka-saka poulet de la carte de Dina. Composition et allergènes à demander au restaurant.',
  pastels:'Une portion de pastels, parmi les entrées de la carte. Garniture et nombre de pièces à confirmer.',
  fatayas:'Une portion de fatayas, parmi les entrées de la carte. Garniture et nombre de pièces à confirmer.',
  nems:'Une portion de nems. Garniture, nombre de pièces et allergènes à confirmer auprès du restaurant.',
  ailes:'Une portion d’ailes de poulet. Préparation et nombre de pièces à confirmer.',
};
function mediaFor(id){
  if(id==='thieb')return {file:'six-assiettes',crop:'thieb',label:'Thiéb bou guinar — visuel illustratif',specific:true};
  if(id==='daurade')return {file:'six-assiettes',crop:'poisson',label:'Poisson grillé — visuel illustratif',specific:true};
  if(id==='saka')return {file:'six-assiettes',crop:'saka',label:'Poulet, riz et sauce verte — visuel illustratif',specific:true};
  if(id.startsWith('brochettes'))return {file:'six-assiettes',crop:'brochettes',label:'Brochettes grillées — visuel illustratif, viande à confirmer',specific:false};
  if(id==='poulet-entier')return {file:'poulet-braise',crop:'none',label:'Poulet entier braisé — visuel illustratif',specific:true};
  if(['demi-poulet','cuisse-poulet'].includes(id))return {file:'six-assiettes',crop:'poulet',label:'Poulet grillé — visuel illustratif, portion présentée différente',specific:false};
  if(['pastels','fatayas','nems'].includes(id)||id.startsWith('box-'))return {file:'entrees',crop:'none',label:'Assortiment d’entrées — visuel illustratif non spécifique',specific:false};
  if(id==='bissap-rouge')return {file:'boisson',crop:'none',label:'Boisson rouge sombre — visuel illustratif',specific:false};
  return {file:'six-assiettes',crop:'none',label:'Assortiment illustratif — photo spécifique du produit à venir',specific:false};
}
export function buildCatalog(d){
  return {version:1,currency:'EUR',mode:'demo',orderEnabled:false,socials:d.socials,sides:d.sides,sauces:d.sauces,orderUrl:d.orderUrl,products:d.categories.flatMap(c=>c.items.map(item=>{
    let sidesCount=0,saucesCount=0;
    if(c.id==='grillades'){sidesCount=item.id==='poulet-entier'?2:1;saucesCount=sidesCount;}
    if(c.id==='dibi'){const people=item.id.endsWith('-4')?4:item.id.endsWith('-2')?2:1;sidesCount=people;saucesCount=people;}
    let description=descriptions[item.id] || `${item.name}. ${item.detail ? item.detail+'.' : 'Disponibilité et composition à confirmer auprès du restaurant.'}`;
    if(c.id==='chawarmas')description=`${item.name}, dans une galette libanaise avec des crudités.`;
    if(c.id==='partage')description=`Une box de ${item.id.slice(4)} pièces à partager. Le détail de l’assortiment est à confirmer auprès du restaurant.`;
    return {id:item.id,name:item.name,category:c.id,categoryLabel:c.subtitle,priceCents:Math.round(item.price*100),detail:item.detail||'',description,media:mediaFor(item.id),sidesCount,saucesCount,url:productUrl(item.id)};
  }))};
}
export function catalogScript(d){return 'window.DINA_CATALOG = '+JSON.stringify(buildCatalog(d)).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')+';\n';}
