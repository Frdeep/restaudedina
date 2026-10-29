export const CART_KEY='dina.cart.v1';
export const CART_TTL=30*24*60*60*1000;
export const MAX_QUANTITY=20;
const array=x=>Array.isArray(x)?x:[];
export function lineKey(id,choices){return JSON.stringify([id,choices.sides,choices.sauces]);}
export function validateChoices(product,choices,catalog){
 if(!choices||typeof choices!=='object'||!Array.isArray(choices.sides)||!Array.isArray(choices.sauces))return false;
 const sides=array(choices.sides),sauces=array(choices.sauces);
 return sides.length===product.sidesCount&&sauces.length===product.saucesCount&&sides.every(v=>typeof v==='string'&&catalog.sides.includes(v))&&sauces.every(v=>typeof v==='string'&&catalog.sauces.includes(v));
}
export function sanitizeCart(input,catalog,now=Date.now()){
 const empty={version:1,updatedAt:now,lines:[]};
 let value=input;
 if(typeof input==='string'){
  if(input.length>100000)return empty;
  try{value=JSON.parse(input);}catch{return empty;}
 }
 if(!value||value.version!==1||!Number.isFinite(value.updatedAt)||value.updatedAt>now+300000||now-value.updatedAt>CART_TTL||!Array.isArray(value.lines))return empty;
 const map=new Map(catalog.products.map(p=>[p.id,p])),lines=[];
 for(const line of value.lines.slice(0,100)){
  if(!line||typeof line!=='object')continue;
  const p=map.get(line.productId);
  if(!p||!Number.isInteger(line.qty)||line.qty<1||line.qty>MAX_QUANTITY||!validateChoices(p,line.choices,catalog))continue;
  const choices={sides:[...line.choices.sides],sauces:[...line.choices.sauces]},key=lineKey(p.id,choices);
  const current=lines.find(l=>l.key===key);
  if(current)current.qty=Math.min(MAX_QUANTITY,current.qty+line.qty);
  else lines.push({key,productId:p.id,qty:line.qty,choices});
 }
 return {version:1,updatedAt:value.updatedAt,lines};
}
export function cartTotal(cart,catalog){
 const map=new Map(catalog.products.map(p=>[p.id,p]));
 return cart.lines.reduce((sum,line)=>sum+(map.get(line.productId)?.priceCents||0)*line.qty,0);
}
export function addItem(cart,catalog,id,qty,choices){
 const p=catalog.products.find(p=>p.id===id);
 if(!p||!Number.isInteger(qty)||qty<1||qty>MAX_QUANTITY||!validateChoices(p,choices,catalog))throw new Error('Vérifiez la quantité et tous les choix inclus.');
 const next=sanitizeCart(cart,catalog),key=lineKey(id,choices),existing=next.lines.find(l=>l.key===key);
 if(existing&&existing.qty+qty>MAX_QUANTITY)throw new Error('La quantité maximale est de 20 pour une même sélection.');
 if(!existing&&next.lines.length>=100)throw new Error('Le panier a atteint sa capacité. Retirez une sélection avant de poursuivre.');
 if(existing)existing.qty+=qty;else next.lines.push({key,productId:id,qty,choices:{sides:[...choices.sides],sauces:[...choices.sauces]}});
 next.updatedAt=Date.now();return next;
}
