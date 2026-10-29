#!/usr/bin/env python3
"""Validate the installed project-local skills without touching the website or network."""
import hashlib,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 errors=[];registry=json.loads((ROOT/'.agents/skills-lock.json').read_text());seen=set()
 for record in registry['skills']:
  folder=ROOT/'.agents/skills'/record['name'];p=folder/'SKILL.md'
  if not p.is_file():errors.append('Missing '+str(p));continue
  text=p.read_text()
  if not text.startswith('---\n') or '\n---\n' not in text[4:]:errors.append('Invalid frontmatter '+str(p));continue
  front=text.split('---',2)[1]
  name=re.search(r'^name:\s*(.+)$',front,re.M)
  desc=re.search(r'^description:\s*(.+)$',front,re.M)
  name=name.group(1).strip().strip('"\'') if name else ''
  if name!=record['name'] or name in seen or not re.fullmatch('[a-z0-9-]{1,64}',name):errors.append('Name/collision '+record['name'])
  seen.add(name)
  if not desc:errors.append('Missing description '+name)
  if 'disable-model-invocation: true' in front:errors.append('Automatic routing disabled '+name)
  if not list(folder.glob('LICENSE*')):errors.append('Missing license notice '+name)
  if not (folder/'../../CODEX-ADAPTER.md').resolve().is_file():errors.append('Missing adapter '+name)
  if 'CLAUDE_PLUGIN_ROOT' in text:errors.append('Unresolved Claude path '+name)
  for relative,expected in record['files'].items():
   target=folder/relative
   if not target.is_file() or digest(target)!=expected:errors.append('Modified or missing '+str(target.relative_to(ROOT)))
  if digest(folder/'UPSTREAM-SKILL.md')!=record['upstream_skill_sha256']:errors.append('Upstream changed '+name)
 for relative,expected in registry['tool_reference_files'].items():
  target=ROOT/relative
  if not target.is_file() or digest(target)!=expected:errors.append('Modified tool reference '+relative)
 for p in (ROOT/'.agents/skills').rglob('*'):
  if p.is_symlink() and not p.resolve().is_relative_to(ROOT):errors.append('External symlink '+str(p))
  if p.is_file() and p.suffix=='.md' and not p.name.startswith(('UPSTREAM','LICENSE')):
   for label,url in re.findall(r'\[([^\]]+)\]\(([^)]+)\)',p.read_text(errors='replace')):
    if re.match(r'^[a-z]+:|^#|^/|[<>{}]',url) or ' ' in url:continue
    relative=url.split('#')[0]
    if relative.endswith(('.md','.py','.js','.sh')) and not (p.parent/relative).exists():errors.append('Broken local reference '+str(p.relative_to(ROOT))+': '+relative)
 for required in ['AGENTS.md','DESIGN.md','SKILL.md','.agents/CODEX-ADAPTER.md','.agents/skills/dina-workflow/SKILL.md','.agents/product-marketing.md']:
  if not (ROOT/required).is_file():errors.append('Missing project integration '+required)
 if errors:
  print('\n'.join(errors));return 1
 print(f'OK: {len(seen)} upstream skills + dina-workflow; unique names, active metadata, pinned hashes, licenses, adapter and marketing tool references.')
 return 0
if __name__=='__main__':sys.exit(main())
