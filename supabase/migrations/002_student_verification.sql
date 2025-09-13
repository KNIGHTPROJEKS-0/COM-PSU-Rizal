-- Create student verification table
create table if not exists student_verification (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references users(id) on delete cascade not null,
  status text check (status in ('pending', 'verified', 'rejected')) not null default 'pending',
  document_url text, -- URL to the verification document in storage
  notes text, -- Admin notes about verification
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verified_at timestamp with time zone,
  verified_by uuid references users(id) on delete set null,
  unique(student_id)
);

-- Set up Row Level Security (RLS)
alter table student_verification enable row level security;

-- RLS Policies
-- Students can view their own verification status
create policy "Students can view their own verification" on student_verification
  for select using (student_id = auth.uid());

-- Students can submit their own verification documents
create policy "Students can submit verification" on student_verification
  for insert with check (student_id = auth.uid());

-- Students can update their own verification documents if status is pending
create policy "Students can update pending verification" on student_verification
  for update using (student_id = auth.uid() and status = 'pending');

-- Admin and faculty can view all verifications
create policy "Admin and faculty can view verifications" on student_verification
  for select using (
    auth.uid() in (
      select id from users where role in ('admin', 'faculty')
    )
  );

-- Admin and faculty can verify students
create policy "Admin and faculty can verify students" on student_verification
  for update using (
    auth.uid() in (
      select id from users where role in ('admin', 'faculty')
    )
  );

-- Create storage bucket for verification documents
insert into storage.buckets (id, name, public)
  values ('verification', 'verification', false)
  on conflict (id) do nothing;

-- Storage policies for verification bucket
create policy "Students can upload verification documents" on storage.objects
  for insert with check (
    bucket_id = 'verification' and
    auth.role() = 'authenticated' and
    name ilike auth.uid() || '/%'
  );

create policy "Users can view their own verification documents" on storage.objects
  for select using (
    bucket_id = 'verification' and
    (
      owner = auth.uid() or
      name ilike auth.uid() || '/%' or
      auth.uid() in (
        select id from users where role in ('admin', 'faculty')
      )
    )
  );

create policy "Students can delete their own verification documents" on storage.objects
  for delete using (
    bucket_id = 'verification' and
    (owner = auth.uid() or name ilike auth.uid() || '/%') and
    auth.uid() in (
      select student_id from student_verification
      where status = 'pending'
    )
  );