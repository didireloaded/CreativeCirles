-- API privileges complement RLS; anonymous visitors receive no table access.
grant usage on schema public to authenticated;

grant select on table
  public.regions,
  public.cities,
  public.creative_disciplines,
  public.skills
to authenticated;

grant select, insert, update, delete on table
  public.profiles,
  public.profile_disciplines,
  public.profile_skills,
  public.profile_links,
  public.user_interests,
  public.collaboration_preferences,
  public.collaboration_preferred_disciplines,
  public.collaboration_locations,
  public.availability_windows,
  public.privacy_settings,
  public.notification_preferences
to authenticated;

revoke all on all tables in schema public from anon;
