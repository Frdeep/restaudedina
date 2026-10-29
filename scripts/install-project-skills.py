#!/usr/bin/env python3
"""Install project-local Codex skills from reviewed, commit-pinned upstream sources.
Does not run upstream scripts or change website files. Existing installations are protected.
"""
import argparse,hashlib,json,re,shutil,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def install(staging):
 spec=json.loads((ROOT/'.agents/skill-sources.json').read_text())
 destination=ROOT/'.agents/skills'
 sources=[]
 for source in spec['sources']:
  checkout=staging/source['key']
  actual=subprocess.check_output(['git','-C',str(checkout),'rev-parse','HEAD'],text=True).strip()
  if actual!=source['commit']:raise RuntimeError('Commit mismatch: '+source['key'])
  for relative in source['skills']:
   src=checkout/relative
   for f in src.rglob('*'):
    if f.is_symlink() and not f.resolve().is_relative_to(checkout.resolve()):raise RuntimeError('External symlink: '+str(f))
   name=src.name;target=destination/name
   if target.exists():raise RuntimeError('Refusing to overwrite existing skill: '+name)
   sources.append((source,src,target,relative))
 destination.mkdir(parents=True,exist_ok=True)
 records=[]
 for source,src,target,relative in sources:
  shutil.copytree(src,target,ignore=shutil.ignore_patterns('__pycache__','*.pyc','.DS_Store'))
  original=(target/'SKILL.md').read_text()
  (target/'UPSTREAM-SKILL.md').write_text(original)
  adapted=original.replace('${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max','.agents/skills/ui-ux-pro-max')
  # Codex routing must be able to invoke these explicitly requested review skills.
  adapted=re.sub(r'^disable-model-invocation:\s*true\s*\n','',adapted,flags=re.M)
  end=adapted.find('\n---',4)
  if not adapted.startswith('---\n') or end<0:raise RuntimeError('Invalid frontmatter: '+str(src))
  end+=4
  note='\n\n## Codex project adapter\n\nRead [CODEX-ADAPTER.md](../../CODEX-ADAPTER.md) before using this skill in La Cuisine de Dina. The user brief and DESIGN.md take precedence over generic aesthetics. Use only available tools and report unavailable capabilities accurately. Work in the existing checkout; do not rewrite the site for a skill installation.\n'
  adapted=adapted[:end]+note+adapted[end:]
  adapted=adapted.replace('../../tools/','../../marketing-tools/')
  (target/'SKILL.md').write_text(adapted)
  if name=='ads':
   reference=target/'references/google-ads-audit-checklist.md'
   reference.write_text(reference.read_text().replace('](conversion-tracking.md)','](../../conversion-tracking/SKILL.md)'))
  licenses=list(src.glob('LICENSE*')) or [staging/source['key']/p for p in source['licenses']]
  for i,p in enumerate(licenses):shutil.copy2(p,target/('LICENSE.upstream'+('' if i==0 else '-'+str(i))+p.suffix))
  if source['key']=='vercel' and not licenses:
   shutil.copy2(staging/source['key']/'README.md',target/'UPSTREAM-README.md')
   (target/'LICENSE.notice').write_text('The upstream README declares the repository license as MIT.\nSource: '+source['repository']+', commit '+source['commit']+'.\nThe inspected upstream checkout did not contain a standalone license text.\nUPSTREAM-README.md preserves the declaration. This notice does not invent or replace the upstream license terms.\n')
  record={'name':target.name,'repository':source['repository'],'commit':source['commit'],'upstream_path':relative,'upstream_skill_sha256':digest(target/'UPSTREAM-SKILL.md'),'files':{str(p.relative_to(target)):digest(p) for p in sorted(target.rglob('*')) if p.is_file()}}
  records.append(record)
  print('Installed',target.name)
 tools=staging/'marketing/tools';target=ROOT/'.agents/marketing-tools'
 if target.exists():raise RuntimeError('Refusing to overwrite marketing tool references')
 shutil.copytree(tools,target,ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
 extras={str(p.relative_to(ROOT)):digest(p) for p in sorted(target.rglob('*')) if p.is_file()}
 (ROOT/'.agents/skills-lock.json').write_text(json.dumps({'format':1,'skills':records,'tool_reference_files':extras},ensure_ascii=False,indent=2)+'\n')
 print('Installed',len(records),'upstream skills; no upstream scripts executed.')
def main():
 parser=argparse.ArgumentParser(description=__doc__)
 group=parser.add_mutually_exclusive_group(required=True)
 group.add_argument('--source-dir',type=Path)
 group.add_argument('--fetch',action='store_true',help='Fetch exactly the commits in .agents/skill-sources.json')
 args=parser.parse_args()
 if args.source_dir:install(args.source_dir.resolve());return
 if any((ROOT/'.agents/skills'/Path(p).name).exists() for source in json.loads((ROOT/'.agents/skill-sources.json').read_text())['sources'] for p in source['skills']):raise RuntimeError('Already installed; use verify-project-skills.py. Updates require an explicit reviewed diff.')
 with tempfile.TemporaryDirectory(prefix='dina-skills-') as temp:
  staging=Path(temp)
  for source in json.loads((ROOT/'.agents/skill-sources.json').read_text())['sources']:
   dest=staging/source['key'];dest.mkdir()
   for cmd in [['git','init','-q',str(dest)],['git','-C',str(dest),'remote','add','origin',source['repository']+'.git'],['git','-C',str(dest),'fetch','--depth','1','origin',source['commit']],['git','-C',str(dest),'checkout','-q','--detach','FETCH_HEAD']]:subprocess.run(cmd,check=True)
  install(staging)
if __name__=='__main__':main()
