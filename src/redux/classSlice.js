import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp,
  getCountFromServer,
  getDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../config/firebase';

const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  if (error.code === 'permission-denied') {
    return 'You do not have permission to perform this action. Please contact an administrator.';
  }
  return error.message || 'An error occurred. Please try again.';
};

// Async thunks
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const classesRef = collection(db, 'classes');
      const snapshot = await getDocs(classesRef);
      const classes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return classes;
    } catch (error) {
      return rejectWithValue(handleFirebaseError(error));
    }
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData, { rejectWithValue }) => {
    try {
      const classesRef = collection(db, 'classes');
      const timestamp = new Date().toISOString();
      const docRef = await addDoc(classesRef, {
        ...classData,
        createdAt: timestamp,
        status: 'active'
      });
      return {
        id: docRef.id,
        ...classData,
        createdAt: timestamp,
        status: 'active'
      };
    } catch (error) {
      return rejectWithValue(handleFirebaseError(error));
    }
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ id, classData }, { rejectWithValue }) => {
    try {
      const classRef = doc(db, 'classes', id);
      const timestamp = new Date().toISOString();
      await updateDoc(classRef, {
        ...classData,
        updatedAt: timestamp
      });
      return {
        id,
        ...classData,
        updatedAt: timestamp
      };
    } catch (error) {
      console.error('Error updating class:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (id, { rejectWithValue }) => {
    try {
      const classRef = doc(db, 'classes', id);
      const timestamp = new Date().toISOString();
      await updateDoc(classRef, {
        status: 'archived',
        archivedAt: timestamp
      });
      return { id };
    } catch (error) {
      console.error('Error deleting class:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Add new thunk for class statistics
export const fetchClassStats = createAsyncThunk(
  'classes/fetchClassStats',
  async (_, { rejectWithValue }) => {
    try {
      // Get total classes
      const classesQuery = query(collection(db, 'classes'));
      const classesSnapshot = await getCountFromServer(classesQuery);
      const totalClasses = classesSnapshot.data().count;

      // Get active classes
      const activeClassesQuery = query(
        collection(db, 'classes'),
        where('status', '==', 'active')
      );
      const activeClassesSnapshot = await getCountFromServer(activeClassesQuery);
      const activeClasses = activeClassesSnapshot.data().count;

      // Get classes by department
      const departments = ['computer-science', 'mathematics', 'physics'];
      const departmentStats = {};
      
      for (const dept of departments) {
        const deptQuery = query(
          collection(db, 'classes'),
          where('department', '==', dept),
          where('status', '==', 'active')
        );
        const deptSnapshot = await getCountFromServer(deptQuery);
        departmentStats[dept] = deptSnapshot.data().count;
      }

      // Get recent classes (last 5)
      const recentClassesQuery = query(
        collection(db, 'classes'),
        where('status', '==', 'active')
        // Add orderBy if you want to sort by creation date
        // orderBy('createdAt', 'desc')
      );
      const recentClassesSnapshot = await getDocs(recentClassesQuery);
      const recentClasses = recentClassesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).slice(0, 5);

      return {
        totalClasses,
        activeClasses,
        departmentStats,
        recentClasses
      };
    } catch (error) {
      console.error('Error fetching class stats:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Add these new async thunks
export const assignTeacherToClass = createAsyncThunk(
  'classes/assignTeacher',
  async ({ classId, teacherId }, { rejectWithValue }) => {
    try {
      const classRef = doc(db, 'classes', classId);
      const userRef = doc(db, 'users', teacherId);

      // Get user data
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return rejectWithValue('User not found');
      }

      const userData = userDoc.data();
      if (userData.role !== 'teacher') {
        return rejectWithValue('Selected user is not a teacher');
      }

      // Update class with teacher information
      await updateDoc(classRef, {
        teacherId: teacherId,
        teacherName: userData.name,
        updatedAt: new Date().toISOString()
      });

      // Update user's classes array
      await updateDoc(userRef, {
        classes: arrayUnion({
          id: classId,
          name: userData.name,
          role: 'teacher',
          assignedAt: new Date().toISOString()
        }),
        updatedAt: new Date().toISOString()
      });

      return { 
        classId, 
        teacherId, 
        teacherName: userData.name,
        assignedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error assigning teacher to class:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const assignStudentToClass = createAsyncThunk(
  'classes/assignStudentToClass',
  async ({ classId, studentId }, { rejectWithValue }) => {
    try {
      // Get student data
      const userRef = doc(db, 'users', studentId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Student not found');
      }

      const userData = userDoc.data();
      
      // Validate role
      if (userData.role !== 'student') {
        throw new Error('User is not a student');
      }

      // Get class data
      const classRef = doc(db, 'classes', classId);
      const classDoc = await getDoc(classRef);
      
      if (!classDoc.exists()) {
        throw new Error('Class not found');
      }

      const classData = classDoc.data();

      // Check if student is already enrolled
      if (classData.students?.some(s => s.id === studentId)) {
        throw new Error('Student is already enrolled in this class');
      }

      // Update class with new student
      await updateDoc(classRef, {
        students: arrayUnion({
          id: studentId,
          name: userData.name,
          email: userData.email,
          rollNumber: userData.rollNumber,
          enrolledAt: new Date().toISOString() // Use ISO string instead of serverTimestamp
        })
      });

      // Update student's classes array
      await updateDoc(userRef, {
        classes: arrayUnion({
          id: classId,
          name: classData.name,
          department: classData.department,
          role: 'student',
          enrolledAt: new Date().toISOString() // Use ISO string instead of serverTimestamp
        })
      });

      return { classId, studentId };
    } catch (error) {
      console.error('Error assigning student to class:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  classes: [],
  loading: false,
  error: null,
  success: false,
  filters: {   // Active filter settings
    status: 'all',      // 'active' | 'archived' | 'all'
    department: 'all',  // 'computer-science' | 'mathematics' | 'all'
    search: '',         // Search keyword
  },
  // Add new state for dashboard stats
  dashboardStats: {
    totalClasses: 0,
    activeClasses: 0,
    departmentStats: {},
    recentClasses: []
  }
};

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      // Merges new filter values with existing ones
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      // Resets to default
      state.filters = initialState.filters;
    },
  
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch classes';
      })
      // Create Class
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
        state.success = true;
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create class';
      })
      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update class';
      })
      // Delete Class
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index].status = 'archived';
        }
        state.success = true;
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete class';
      })
      // Add new cases for class stats
      .addCase(fetchClassStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchClassStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch class statistics';
      })
      // Assign Teacher to Class
      .addCase(assignTeacherToClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTeacherToClass.fulfilled, (state, action) => {
        state.loading = false;
        const classIndex = state.classes.findIndex(c => c.id === action.payload.classId);
        if (classIndex !== -1) {
          state.classes[classIndex] = {
            ...state.classes[classIndex],
            teacherId: action.payload.teacherId,
            teacherName: action.payload.teacherName
          };
        }
        state.success = true;
      })
      .addCase(assignTeacherToClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign Student to Class
      .addCase(assignStudentToClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignStudentToClass.fulfilled, (state, action) => {
        state.loading = false;
        const classIndex = state.classes.findIndex(c => c.id === action.payload.classId);
        if (classIndex !== -1) {
          const student = {
            studentId: action.payload.studentId,
            studentName: action.payload.studentName,
            enrollmentDate: new Date().toISOString()
          };
          state.classes[classIndex].students = [
            ...(state.classes[classIndex].students || []),
            student
          ];
        }
        state.success = true;
      })
      .addCase(assignStudentToClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, clearError, clearSuccess } = classSlice.actions;

export default classSlice.reducer; 