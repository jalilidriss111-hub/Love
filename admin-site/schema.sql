-- Progress only. Safe to run many times.
create table if not exists progress(
  id int primary key default 1 check(id=1),
  love_points int default 0, baby_gender text default 'girl', baby_name text default 'البيبي',
  scores jsonb default '{}'::jsonb, last_mood text, last_mood_at timestamptz);
insert into progress(id) values(1) on conflict (id) do nothing;
alter table progress enable row level security;
drop policy if exists p_read on progress;
create policy p_read on progress for select using (true);
create or replace function add_points(n int) returns void language sql security definer as $$
  update progress set love_points=love_points+least(greatest(n,0),50) where id=1 $$;
create or replace function set_baby(g text,nm text) returns void language sql security definer as $$
  update progress set baby_gender=g,baby_name=nm where id=1 $$;
create or replace function save_score(g text,s int) returns void language sql security definer as $$
  update progress set scores=jsonb_set(coalesce(scores,'{}'::jsonb),array[g],to_jsonb(greatest(coalesce((scores->>g)::int,0),s))) where id=1 $$;
create or replace function add_mood(m text) returns void language sql security definer as $$
  update progress set last_mood=m,last_mood_at=now() where id=1 $$;
create or replace function admin_set(p int,g text,nm text) returns void language sql security definer as $$
  update progress set love_points=p,baby_gender=g,baby_name=nm where id=1 $$;
