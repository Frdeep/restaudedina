const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function visitMap(d){
 const src=new URL('https://maps.google.com/maps');
 for(const [key,value] of Object.entries({width:'772',height:'400',hl:'fr',q:'35 rue Vivenel, 60200 Compiègne',z:'16',ie:'UTF8',iwloc:'B',output:'embed'}))src.searchParams.set(key,value);
 return `<figure class="visit-map" aria-labelledby="visit-map-title"><div class="visit-map-heading"><div><h3 id="visit-map-title">Nous trouver à Compiègne</h3><p>${esc(d.address)}</p></div><a class="text-link" href="${esc(d.mapsUrl)}" target="_blank" rel="noopener noreferrer">Ouvrir l’itinéraire <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div><iframe class="restaurant-map" src="${esc(src.href)}" width="772" height="400" loading="lazy" title="Localisation de La Cuisine de Dina, 35 rue Vivenel, 60200 Compiègne" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><figcaption>35 rue Vivenel, 60200 Compiègne · <a href="${esc(d.mapsUrl)}" target="_blank" rel="noopener noreferrer">Voir dans Google Maps</a></figcaption></figure>`;
}
