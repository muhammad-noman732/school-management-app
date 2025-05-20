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
  getCountFromServer
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
      const docRef = await addDoc(classesRef, {
        ...classData,
        createdAt: serverTimestamp(),
        status: 'active'
      });
      return {
        id: docRef.id,
        ...classData,
        createdAt: new Date().toISOString(),
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
      await updateDoc(classRef, {
        ...classData,
        updatedAt: serverTimestamp()
      });
      return {
        id,
        ...classData,
        updatedAt: new Date().toISOString()
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
      await updateDoc(classRef, {
        status: 'archived',
        archivedAt: serverTimestamp()
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
      });
  },
});

export const { setFilters, resetFilters, clearError, clearSuccess } = classSlice.actions;

export default classSlice.reducer; 