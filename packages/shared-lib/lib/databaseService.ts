import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export interface DatabaseUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'student' | 'faculty' | 'admin'
  phone?: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  description?: string
  faculty_id: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  class_id: string
  enrolled_at: string
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  meeting_id: string
  status: 'present' | 'absent' | 'late'
  recorded_at: string
  recorded_by: string
}

export interface Assignment {
  id: string
  class_id: string
  title: string
  description?: string
  due_date?: string
  max_points?: number
  created_at: string
  updated_at: string
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  file_path?: string
  grade?: number
  feedback?: string
  submitted_at: string
  graded_at?: string
  graded_by?: string
}

export interface Grade {
  id: string
  student_id: string
  class_id: string
  assignment_id?: string
  grade_type: 'assignment' | 'exam' | 'participation' | 'final'
  points_earned?: number
  points_possible?: number
  recorded_at: string
  recorded_by: string
}

export interface StudentVerification {
  id: string
  student_id: string
  status: 'pending' | 'verified' | 'rejected'
  document_url?: string
  notes?: string
  submitted_at: string
  verified_at?: string
  verified_by?: string
}

class DatabaseService {
  private static instance: DatabaseService

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // User Profile Methods
  async getUserProfile(userId: string): Promise<{ data: DatabaseUser | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  }

  async updateUserProfile(userId: string, updates: Partial<DatabaseUser>): Promise<{ data: DatabaseUser | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  }

  async createUserProfile(user: User, additionalData: { first_name: string; last_name: string; role: string }): Promise<{ data: DatabaseUser | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        ...additionalData,
      })
      .select()
      .single()

    return { data, error }
  }

  // Class Methods
  async getClasses(): Promise<{ data: Class[] | null; error: any }> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  }

  async getClassById(classId: string): Promise<{ data: Class | null; error: any }> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single()

    return { data, error }
  }

  async createClass(classData: Omit<Class, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Class | null; error: any }> {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single()

    return { data, error }
  }

  async updateClass(classId: string, updates: Partial<Class>): Promise<{ data: Class | null; error: any }> {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', classId)
      .select()
      .single()

    return { data, error }
  }

  // Enrollment Methods
  async getEnrollmentsByStudent(studentId: string): Promise<{ data: Enrollment[] | null; error: any }> {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        classes (*)
      `)
      .eq('student_id', studentId)

    return { data, error }
  }

  async getEnrollmentsByClass(classId: string): Promise<{ data: Enrollment[] | null; error: any }> {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        users (*)
      `)
      .eq('class_id', classId)

    return { data, error }
  }

  async enrollStudent(studentId: string, classId: string): Promise<{ data: Enrollment | null; error: any }> {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        student_id: studentId,
        class_id: classId,
      })
      .select()
      .single()

    return { data, error }
  }

  // Attendance Methods
  async recordAttendance(attendanceData: Omit<Attendance, 'id' | 'recorded_at'>): Promise<{ data: Attendance | null; error: any }> {
    const { data, error } = await supabase
      .from('attendance')
      .insert(attendanceData)
      .select()
      .single()

    return { data, error }
  }

  async getAttendanceByClass(classId: string): Promise<{ data: Attendance[] | null; error: any }> {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        users!attendance_student_id_fkey (*)
      `)
      .eq('class_id', classId)
      .order('recorded_at', { ascending: false })

    return { data, error }
  }

  // Assignment Methods
  async getAssignmentsByClass(classId: string): Promise<{ data: Assignment[] | null; error: any }> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .order('due_date', { ascending: true })

    return { data, error }
  }

  async createAssignment(assignmentData: Omit<Assignment, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Assignment | null; error: any }> {
    const { data, error } = await supabase
      .from('assignments')
      .insert(assignmentData)
      .select()
      .single()

    return { data, error }
  }

  // Submission Methods
  async submitAssignment(submissionData: Omit<Submission, 'id' | 'submitted_at'>): Promise<{ data: Submission | null; error: any }> {
    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select()
      .single()

    return { data, error }
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<{ data: Submission[] | null; error: any }> {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        users (*)
      `)
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false })

    return { data, error }
  }

  async gradeSubmission(submissionId: string, grade: number, feedback?: string): Promise<{ data: Submission | null; error: any }> {
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

  // Student Verification Methods
  async submitVerification(documentUrl: string, notes?: string): Promise<{ data: StudentVerification | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('student_verification')
      .insert({
        student_id: user.id,
        document_url: documentUrl,
        notes,
      })
      .select()
      .single()

    return { data, error }
  }

  async getVerificationStatus(): Promise<{ data: StudentVerification | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('student_verification')
      .select('*')
      .eq('student_id', user.id)
      .single()

    return { data, error }
  }

  async updateVerificationStatus(verificationId: string, status: 'verified' | 'rejected', notes?: string): Promise<{ data: StudentVerification | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('student_verification')
      .update({
        status,
        notes,
        verified_at: new Date().toISOString(),
        verified_by: user.id,
      })
      .eq('id', verificationId)
      .select()
      .single()

    return { data, error }
  }

  // Enhanced User Methods
  async getUsersByRole(role: string): Promise<{ data: DatabaseUser[] | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  async deleteUser(userId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    return { error }
  }

  // Enhanced Class Methods
  async getClassesByInstructor(instructorId: string): Promise<{ data: Class[] | null; error: any }> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('faculty_id', instructorId)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  async deleteClass(classId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId)

    return { error }
  }

  // Enhanced Enrollment Methods
  async unenrollStudent(studentId: string, classId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('student_id', studentId)
      .eq('class_id', classId)

    return { error }
  }

  async getEnrollmentStatus(studentId: string, classId: string): Promise<{ data: Enrollment | null; error: any }> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('class_id', classId)
      .single()

    return { data, error }
  }

  // Enhanced Attendance Methods
  async getAttendanceByStudent(studentId: string, classId?: string): Promise<{ data: Attendance[] | null; error: any }> {
    let query = supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('recorded_at', { ascending: false })

    if (classId) {
      query = query.eq('class_id', classId)
    }

    const { data, error } = await query
    return { data, error }
  }

  async updateAttendance(attendanceId: string, updates: Partial<Attendance>): Promise<{ data: Attendance | null; error: any }> {
    const { data, error } = await supabase
      .from('attendance')
      .update(updates)
      .eq('id', attendanceId)
      .select()
      .single()

    return { data, error }
  }

  async getAttendanceByDate(classId: string, date: string): Promise<{ data: Attendance[] | null; error: any }> {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        users!attendance_student_id_fkey (*)
      `)
      .eq('class_id', classId)
      .eq('recorded_at', date)

    return { data, error }
  }

  // Enhanced Assignment Methods
  async updateAssignment(assignmentId: string, updates: Partial<Assignment>): Promise<{ data: Assignment | null; error: any }> {
    const { data, error } = await supabase
      .from('assignments')
      .update(updates)
      .eq('id', assignmentId)
      .select()
      .single()

    return { data, error }
  }

  async deleteAssignment(assignmentId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId)

    return { error }
  }

  async getAssignmentById(assignmentId: string): Promise<{ data: Assignment | null; error: any }> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single()

    return { data, error }
  }

  // Enhanced Submission Methods
  async getSubmissionsByStudent(studentId: string): Promise<{ data: Submission[] | null; error: any }> {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        assignments (*)
      `)
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false })

    return { data, error }
  }

  async updateSubmission(submissionId: string, updates: Partial<Submission>): Promise<{ data: Submission | null; error: any }> {
    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', submissionId)
      .select()
      .single()

    return { data, error }
  }

  async deleteSubmission(submissionId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', submissionId)

    return { error }
  }

  // Grade Methods
  async recordGrade(gradeData: Omit<Grade, 'id' | 'recorded_at'>): Promise<{ data: Grade | null; error: any }> {
    const { data, error } = await supabase
      .from('grades')
      .insert(gradeData)
      .select()
      .single()

    return { data, error }
  }

  async getGradesByStudent(studentId: string, classId?: string): Promise<{ data: Grade[] | null; error: any }> {
    let query = supabase
      .from('grades')
      .select(`
        *,
        assignments (*),
        classes (*)
      `)
      .eq('student_id', studentId)
      .order('recorded_at', { ascending: false })

    if (classId) {
      query = query.eq('class_id', classId)
    }

    const { data, error } = await query
    return { data, error }
  }

  async getGradesByClass(classId: string): Promise<{ data: Grade[] | null; error: any }> {
    const { data, error } = await supabase
      .from('grades')
      .select(`
        *,
        users (*),
        assignments (*)
      `)
      .eq('class_id', classId)
      .order('recorded_at', { ascending: false })

    return { data, error }
  }

  async updateGrade(gradeId: string, updates: Partial<Grade>): Promise<{ data: Grade | null; error: any }> {
    const { data, error } = await supabase
      .from('grades')
      .update(updates)
      .eq('id', gradeId)
      .select()
      .single()

    return { data, error }
  }

  async deleteGrade(gradeId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', gradeId)

    return { error }
  }

  // Enhanced Student Verification Methods
  async getVerificationDocuments(studentId: string): Promise<{ data: StudentVerification[] | null; error: any }> {
    const { data, error } = await supabase
      .from('student_verification')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false })

    return { data, error }
  }

  async getPendingVerifications(): Promise<{ data: StudentVerification[] | null; error: any }> {
    const { data, error } = await supabase
      .from('student_verification')
      .select(`
        *,
        users (*)
      `)
      .eq('status', 'pending')
      .order('submitted_at', { ascending: true })

    return { data, error }
  }

  async reviewVerificationDocument(
    verificationId: string,
    status: 'verified' | 'rejected',
    notes?: string
  ): Promise<{ data: StudentVerification | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('student_verification')
      .update({
        status,
        notes,
        verified_at: new Date().toISOString(),
        verified_by: user.id,
      })
      .eq('id', verificationId)
      .select()
      .single()

    return { data, error }
  }

  // Analytics and Reporting Methods
  async getClassStatistics(classId: string): Promise<{ data: any; error: any }> {
    try {
      // Get enrollment count
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact' })
        .eq('class_id', classId)

      if (enrollmentError) throw enrollmentError

      // Get attendance statistics
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('status')
        .eq('class_id', classId)

      if (attendanceError) throw attendanceError

      // Get assignment statistics
      const { data: assignments, error: assignmentError } = await supabase
        .from('assignments')
        .select('id')
        .eq('class_id', classId)

      if (assignmentError) throw assignmentError

      // Get submission statistics
      const { data: submissions, error: submissionError } = await supabase
        .from('submissions')
        .select('grade')
        .in('assignment_id', assignments?.map(a => a.id) || [])

      if (submissionError) throw submissionError

      const totalStudents = enrollments?.length || 0
      const totalAttendance = attendance?.length || 0
      const presentCount = attendance?.filter(a => a.status === 'present').length || 0
      const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0

      const gradedSubmissions = submissions?.filter(s => s.grade !== null) || []
      const averageGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
        : 0

      const data = {
        totalStudents,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        totalAssignments: assignments?.length || 0,
        averageGrade: Math.round(averageGrade * 100) / 100,
        totalSubmissions: submissions?.length || 0
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  async getStudentPerformance(studentId: string): Promise<{ data: any; error: any }> {
    try {
      // Get all grades for the student
      const { data: grades, error } = await supabase
        .from('grades')
        .select(`
          points_earned,
          points_possible,
          assignments (
            title
          ),
          classes (
            name
          )
        `)
        .eq('student_id', studentId)

      if (error) throw error

      // Get attendance records
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', studentId)

      if (attendanceError) throw attendanceError

      const totalGrades = grades?.length || 0
      const averageGrade = totalGrades > 0
        ? grades!.reduce((sum, g) => {
            const percentage = g.points_possible ? (g.points_earned || 0) / g.points_possible : 0
            return sum + percentage
          }, 0) / totalGrades * 100
        : 0

      const totalAttendance = attendance?.length || 0
      const presentCount = attendance?.filter(a => a.status === 'present').length || 0
      const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0

      const data = {
        averageGrade: Math.round(averageGrade * 100) / 100,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        totalGrades,
        totalAttendance
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Bulk Operations
  async bulkEnrollStudents(studentIds: string[], classId: string): Promise<{ data: Enrollment[] | null; error: any }> {
    const enrollments = studentIds.map(studentId => ({
      student_id: studentId,
      class_id: classId,
    }))

    const { data, error } = await supabase
      .from('enrollments')
      .insert(enrollments)
      .select()

    return { data, error }
  }

  async bulkRecordAttendance(attendanceRecords: Omit<Attendance, 'id' | 'recorded_at'>[]): Promise<{ data: Attendance[] | null; error: any }> {
    const { data, error } = await supabase
      .from('attendance')
      .insert(attendanceRecords)
      .select()

    return { data, error }
  }

  // Search and Filter Methods
  async searchClasses(query: string): Promise<{ data: Class[] | null; error: any }> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    return { data, error }
  }

  async searchUsers(query: string, role?: string): Promise<{ data: DatabaseUser[] | null; error: any }> {
    let queryBuilder = supabase
      .from('users')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)

    if (role) {
      queryBuilder = queryBuilder.eq('role', role)
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })

    return { data, error }
  }

  // Notification Methods (for future use)
  async createNotification(userId: string, title: string, message: string, type: string = 'info'): Promise<{ data: any; error: any }> {
    // This would require a notifications table
    // For now, we'll just return a placeholder
    return { data: null, error: 'Notifications table not implemented yet' }
  }

  async getUserNotifications(userId: string): Promise<{ data: any[] | null; error: any }> {
    // This would require a notifications table
    return { data: [], error: null }
  }

export const databaseService = DatabaseService.getInstance()