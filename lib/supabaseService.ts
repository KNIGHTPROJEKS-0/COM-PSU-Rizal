import { supabase } from '@/lib/supabaseClient'

// User operations
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: Partial<any>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

// Class operations
export const getClasses = async () => {
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      faculty:users(first_name, last_name)
    `)
  
  return { data, error }
}

export const getClassById = async (classId: string) => {
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      faculty:users(first_name, last_name),
      enrollments(*),
      assignments(*)
    `)
    .eq('id', classId)
    .single()
  
  return { data, error }
}

export const createClass = async (classData: { name: string; description?: string; faculty_id: string }) => {
  const { data, error } = await supabase
    .from('classes')
    .insert([classData])
    .select()
    .single()
  
  return { data, error }
}

export const updateClass = async (classId: string, updates: Partial<any>) => {
  const { data, error } = await supabase
    .from('classes')
    .update(updates)
    .eq('id', classId)
    .select()
    .single()
  
  return { data, error }
}

export const deleteClass = async (classId: string) => {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', classId)
  
  return { error }
}

// Enrollment operations
export const getEnrollments = async (userId: string) => {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      class:classes(name, description),
      student:users(first_name, last_name)
    `)
    .or(`student_id.eq.${userId},class.faculty_id.eq.${userId}`)
  
  return { data, error }
}

export const enrollInClass = async (studentId: string, classId: string) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert([{ student_id: studentId, class_id: classId }])
    .select()
    .single()
  
  return { data, error }
}

export const unenrollFromClass = async (enrollmentId: string) => {
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('id', enrollmentId)
  
  return { error }
}

// Attendance operations
export const getAttendance = async (classId: string, studentId?: string) => {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      student:users(first_name, last_name),
      recorder:users(first_name, last_name)
    `)
    .eq('class_id', classId)
  
  if (studentId) {
    query = query.eq('student_id', studentId)
  }
  
  const { data, error } = await query
  
  return { data, error }
}

export const recordAttendance = async (attendanceData: {
  student_id: string
  class_id: string
  meeting_id: string
  status: 'present' | 'absent' | 'late'
  recorded_by: string
}) => {
  const { data, error } = await supabase
    .from('attendance')
    .insert([attendanceData])
    .select()
    .single()
  
  return { data, error }
}

// Assignment operations
export const getAssignments = async (classId: string) => {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('class_id', classId)
    .order('due_date', { ascending: true })
  
  return { data, error }
}

export const getAssignmentById = async (assignmentId: string) => {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', assignmentId)
    .single()
  
  return { data, error }
}

export const createAssignment = async (assignmentData: {
  class_id: string
  title: string
  description?: string
  due_date?: string
  max_points?: number
}) => {
  const { data, error } = await supabase
    .from('assignments')
    .insert([assignmentData])
    .select()
    .single()
  
  return { data, error }
}

export const updateAssignment = async (assignmentId: string, updates: Partial<any>) => {
  const { data, error } = await supabase
    .from('assignments')
    .update(updates)
    .eq('id', assignmentId)
    .select()
    .single()
  
  return { data, error }
}

export const deleteAssignment = async (assignmentId: string) => {
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', assignmentId)
  
  return { error }
}

// Submission operations
export const getSubmissions = async (assignmentId: string, studentId?: string) => {
  let query = supabase
    .from('submissions')
    .select(`
      *,
      student:users(first_name, last_name)
    `)
    .eq('assignment_id', assignmentId)
  
  if (studentId) {
    query = query.eq('student_id', studentId)
  }
  
  const { data, error } = await query
  
  return { data, error }
}

export const submitAssignment = async (submissionData: {
  assignment_id: string
  student_id: string
  file_path?: string
}) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert([submissionData])
    .select()
    .single()
  
  return { data, error }
}

export const gradeSubmission = async (submissionId: string, grade: number, feedback?: string) => {
  const { data, error } = await supabase
    .from('submissions')
    .update({
      grade,
      feedback,
      graded_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .select()
    .single()
  
  return { data, error }
}

// Grade operations
export const getGrades = async (studentId: string, classId?: string) => {
  let query = supabase
    .from('grades')
    .select(`
      *,
      recorder:users(first_name, last_name)
    `)
    .eq('student_id', studentId)
  
  if (classId) {
    query = query.eq('class_id', classId)
  }
  
  const { data, error } = await query
  
  return { data, error }
}

export const recordGrade = async (gradeData: {
  student_id: string
  class_id: string
  assignment_id?: string
  grade_type: string
  points_earned: number
  points_possible: number
  recorded_by: string
}) => {
  const { data, error } = await supabase
    .from('grades')
    .insert([gradeData])
    .select()
    .single()
  
  return { data, error }
}

// Storage operations
export const uploadFile = async (filePath: string, file: File) => {
  const { data, error } = await supabase.storage
    .from('assignments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  return { data, error }
}

export const downloadFile = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from('assignments')
    .download(filePath)
  
  return { data, error }
}

export const deleteFile = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('assignments')
    .remove([filePath])
  
  return { error }
}