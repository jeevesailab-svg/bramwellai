revoke execute on function public.delete_email(text, bigint) from anon, authenticated;
revoke execute on function public.move_to_dlq(text, text, bigint, jsonb) from anon, authenticated;
revoke execute on function public.enqueue_email(text, jsonb) from anon, authenticated;
revoke execute on function public.read_email_batch(text, integer, integer) from anon, authenticated;
revoke execute on function public.email_queue_dispatch() from anon, authenticated;
revoke execute on function public.email_queue_wake() from anon, authenticated;

alter function public.delete_email(text, bigint) set search_path = '';
alter function public.move_to_dlq(text, text, bigint, jsonb) set search_path = '';
alter function public.enqueue_email(text, jsonb) set search_path = '';
alter function public.read_email_batch(text, integer, integer) set search_path = '';