-- Create users table
create table if not exists users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  role text check (role in ('student', 'faculty', 'admin')) not null default 'student',
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create classes table
create table if not exists classes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  faculty_id uuid references users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create enrollments table (many-to-many relationship between students and classes)
create table if not exists enrollments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references users(id) on delete cascade not null,
  class_id uuid references classes(id) on delete cascade not null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, class_id)
);

-- Create attendance table
create table if not exists attendance (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references users(id) on delete cascade not null,
  class_id uuid references classes(id) on delete cascade not null,
  meeting_id uuid not null, -- References meeting ID from your video conferencing system
  status text check (status in ('present', 'absent', 'late')) not null,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  recorded_by uuid references users(id) on delete cascade not null
);

-- Create assignments table
create table if not exists assignments (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade not null,
  title text not null,
  description text,
  due_date timestamp with time zone,
  max_points integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create submissions table
create table if not exists submissions (
  id uuid default gen_random_uuid() primary key,
  assignment_id uuid references assignments(id) on delete cascade not null,
  student_id uuid references users(id) on delete cascade not null,
  file_path text, -- Path to the file in Supabase Storage
  grade integer,
  feedback text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  graded_at timestamp with time zone,
  graded_by uuid references users(id) on delete cascade,
  unique(assignment_id, student_id)
);

-- Create grades table (alternative to storing grades in submissions)
create table if not exists grades (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references users(id) on delete cascade not null,
  class_id uuid references classes(id) on delete cascade not null,
  assignment_id uuid references assignments(id) on delete cascade,
  grade_type text check (grade_type in ('assignment', 'exam', 'participation', 'final')) not null,
  points_earned numeric(5,2),
  points_possible numeric(5,2),
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  recorded_by uuid references users(id) on delete cascade not null
);

-- Set up Row Level Security (RLS)
alter table users enable row level security;
alter table classes enable row level security;
alter table enrollments enable row level security;
alter table attendance enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table grades enable row level security;

-- RLS Policies
-- Users can only see their own record
create policy "Users can view their own record" on users
  for select using (auth.uid() = id);

create policy "Users can update their own record" on users
  for update using (auth.uid() = id);

-- Faculty can view classes they created, students can view classes they're enrolled in
create policy "Faculty can view their classes" on classes
  for select using (auth.uid() = faculty_id);

create policy "Students can view enrolled classes" on classes
  for select using (
    id in (
      select class_id from enrollments where student_id = auth.uid()
    )
  );

-- Faculty can create classes
create policy "Faculty can create classes" on classes
  for insert with check (
    auth.uid() in (
      select id from users where id = auth.uid() and role = 'faculty'
    )
  );

-- Faculty can update their own classes
create policy "Faculty can update their classes" on classes
  for update using (auth.uid() = faculty_id);

-- Students and faculty can view enrollments for their classes
create policy "Users can view enrollments for their classes" on enrollments
  for select using (
    class_id in (
      select id from classes where faculty_id = auth.uid()
    ) or student_id = auth.uid()
  );

-- Students can enroll themselves, faculty can enroll students in their classes
create policy "Users can create enrollments" on enrollments
  for insert with check (
    student_id = auth.uid() or 
    class_id in (
      select id from classes where faculty_id = auth.uid()
    )
  );

-- Faculty can view attendance for their classes, students can view their own attendance
create policy "Users can view attendance" on attendance
  for select using (
    class_id in (
      select id from classes where faculty_id = auth.uid()
    ) or student_id = auth.uid()
  );

-- Faculty can record attendance for their classes
create policy "Faculty can record attendance" on attendance
  for insert with check (
    class_id in (
      select id from classes where faculty_id = auth.uid()
    ) and recorded_by = auth.uid()
  );

-- Faculty can view assignments for their classes, students can view assignments for enrolled classes
create policy "Users can view assignments" on assignments
  for select using (
    class_id in (
      select id from classes where faculty_id = auth.uid()
    ) or class_id in (
      select class_id from enrollments where student_id = auth.uid()
    )
  );

-- Faculty can create assignments for their classes
create policy "Faculty can create assignments" on assignments
  for insert with check (
    class_id in (
      select id from classes where faculty_id = auth.uid()
    )
  );

-- Students can view their own submissions, faculty can view submissions for their classes
create policy "Users can view submissions" on submissions
  for select using (
    student_id = auth.uid() or 
    assignment_id in (
      select id from assignments where class_id in (
        select id from classes where faculty_id = auth.uid()
      )
    )
  );

-- Students can create submissions, faculty can update grades
create policy "Students can create submissions" on submissions
  for insert with check (student_id = auth.uid());

create policy "Faculty can grade submissions" on submissions
  for update using (
    assignment_id in (
      select id from assignments where class_id in (
        select id from classes where faculty_id = auth.uid()
      )
    )
  );

-- Users can view their own grades or faculty can view grades for their classes
create policy "Users can view grades" on grades
  for select using (
    student_id = auth.uid() or
    class_id in (
      select id from classes where faculty_id = auth.uid()
    )
  );

-- Faculty can record grades for their classes
create policy "Faculty can record grades" on grades
  for insert with check (
    class_id in (
      select id from classes where faculty_id = auth.uid()
    ) and recorded_by = auth.uid()
  );

-- Faculty can update grades they recorded
create policy "Faculty can update grades" on grades
  for update using (
    recorded_by = auth.uid()
  );

-- Create storage bucket for assignments
insert into storage.buckets (id, name, public)
  values ('assignments', 'assignments', false)
  on conflict (id) do nothing;

-- Storage policies for assignments bucket
create policy "Users can upload assignments" on storage.objects
  for insert with check (
    bucket_id = 'assignments' and
    (auth.role() = 'authenticated')
  );

create policy "Users can view their own assignments" on storage.objects
  for select using (
    bucket_id = 'assignments' and
    (
      owner = auth.uid() or
      name ilike auth.uid() || '/%' or
      auth.uid() in (
        select faculty_id from classes c
        join assignments a on a.class_id = c.id
        where a.id = (
          select assignment_id from submissions
          where file_path = storage.objects.name
        )
      )
    )
  );

create policy "Users can delete their own assignments" on storage.objects
  for delete using (
    bucket_id = 'assignments' and
    (owner = auth.uid() or name ilike auth.uid() || '/%')
  );