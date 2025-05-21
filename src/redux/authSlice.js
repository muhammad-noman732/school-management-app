import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, collection, query, where, getDocs, getCountFromServer } from "firebase/firestore";
import { auth, db } from '../config/firebase'
import { onAuthStateChanged } from "firebase/auth";

// Get current logged-in user (with onAuthStateChanged)
export const getCurrentUser = createAsyncThunk(
  "/auth/getCurrentUser",
  async () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.role === 'teacher') {
                resolve({
                  id: user.uid,
                  email: user.email,
                  ...userData
                });
              } else {
                reject(new Error('Access denied. Teachers only.'));
              }
            } else {
              reject(new Error('User data not found'));
            }
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      });
    });
  }
);

// // Helper function to generate roll number
// const generateRollNumber = async (departmentId) => {
//   const year = new Date().getFullYear().toString().slice(-2);
//   const prefix = `CS${year}`;
  
//   // Get the last roll number for this department
//   const usersRef = collection(db, "users");
//   const q = query(
//     usersRef,
//     where("role", "==", "student"),
//     where("departmentId", "==", departmentId)
//   );
  
//   const querySnapshot = await getDocs(q);
//   const lastRollNumber = querySnapshot.docs
//     .map(doc => doc.data().rollNumber)
//     .filter(roll => roll.startsWith(prefix))
//     .sort()
//     .pop();
  
//   if (!lastRollNumber) {
//     return `${prefix}-001`;
//   }
  
//   const lastNumber = parseInt(lastRollNumber.split('-')[1]);
//   return `${prefix}-${(lastNumber + 1).toString().padStart(3, '0')}`;
// };

// Helper function to generate employee ID
// const generateEmployeeId = async () => {
//   const usersRef = collection(db, "users");
//   const q = query(usersRef, where("role", "==", "teacher"));
//   const querySnapshot = await getDocs(q);
//   const lastEmployeeId = querySnapshot.docs
//     .map(doc => doc.data().employeeId)
//     .filter(id => id.startsWith('TCHR-'))
//     .sort()
//     .pop();
  
//   if (!lastEmployeeId) {
//     return 'TCHR-1001';
//   }
  
//   const lastNumber = parseInt(lastEmployeeId.split('-')[1]);
//   return `TCHR-${lastNumber + 1}`;
// };

// Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        name,
        role: 'teacher',
        createdAt: new Date().toISOString()
      };

      return userData;
    } catch (error) {
      throw error;
    }
  }
);

// Fetch Pending Users
export const fetchPendingUsers = createAsyncThunk(
  'auth/fetchPendingUsers',
  async (_, { rejectWithValue }) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("status", "==", "waiting_approval")
      );
      
      const querySnapshot = await getDocs(q);
      const pendingUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return pendingUsers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Approve User
export const approveUser = createAsyncThunk(
  'auth/approveUser',
  async ({ 
    userId, 
    role,
    // Student specific fields
    batch,
    semester,
    section,
    rollNumber,
    // Teacher specific fields
    qualification,
    designation,
    employeeId
  }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (!userData) {
        throw new Error("User not found");
      }

      const updateData = {
        role,
        status: "active",
        isApproved: true,
        approvedAt: new Date().toISOString()
      };

      if (role === 'student') {
        // Check if roll number is unique
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("rollNumber", "==", rollNumber)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          throw new Error("Roll number already exists");
        }

        Object.assign(updateData, {
          rollNumber,
          batch,
          semester,
          section
        });
      } else if (role === 'teacher') {
        // Check if employee ID is unique
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("employeeId", "==", employeeId)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          throw new Error("Employee ID already exists");
        }

        Object.assign(updateData, {
          employeeId,
          qualification,
          designation
        });
      }

      await updateDoc(userRef, updateData);
      return { userId, ...updateData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      if (userData.role !== 'teacher') {
        await signOut(auth);
        throw new Error('Access denied. Teachers only.');
      }

      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        ...userData
      };
    } catch (error) {
      throw error;
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }
);

// New thunks for admin dashboard
export const fetchUserStats = createAsyncThunk(
  'auth/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      // Get total teachers
      const teachersQuery = query(collection(db, 'users'), where('role', '==', 'teacher'));
      const teachersSnapshot = await getCountFromServer(teachersQuery);
      const totalTeachers = teachersSnapshot.data().count;

      // Get total students
      const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const studentsSnapshot = await getCountFromServer(studentsQuery);
      const totalStudents = studentsSnapshot.data().count;

      // Get pending approvals
      const pendingQuery = query(collection(db, 'users'), where('status', '==', 'pending'));
      const pendingSnapshot = await getCountFromServer(pendingQuery);
      const totalPending = pendingSnapshot.data().count;

      // Get recent pending users (last 5)
      const recentPendingQuery = query(
        collection(db, 'users'),
        where('status', '==', 'pending'),
        // Add orderBy if you want to sort by creation date
        // orderBy('createdAt', 'desc')
      );
      const recentPendingSnapshot = await getDocs(recentPendingQuery);
      const recentPending = recentPendingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).slice(0, 5); // Get only last 5

      return {
        totalTeachers,
        totalStudents,
        totalPending,
        recentPending
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Add this new async thunk
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    authChecked: false,
    pendingUsers: [],
    dashboardStats: {
      totalTeachers: 0,
      totalStudents: 0,
      totalPending: 0,
      recentPending: []
    },
    users: []
  },
  reducers: {
    setUserState: (state, action) => {
      state.user = action.payload;
      state.authChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // Approve User
    builder.addCase(approveUser.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(approveUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      if (state.user && state.user.id === action.payload.userId) {
        state.user = { ...state.user, ...action.payload };
      }
      state.error = null;
    });
    builder.addCase(approveUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    });

    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.authChecked = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.authChecked = true;
      state.error = action.error.message;
    });

    // Fetch Pending Users
    builder.addCase(fetchPendingUsers.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchPendingUsers.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.pendingUsers = action.payload;
      state.error = null;
    });
    builder.addCase(fetchPendingUsers.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Add new cases for user stats
    builder.addCase(fetchUserStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserStats.fulfilled, (state, action) => {
      state.loading = false;
      state.dashboardStats = action.payload;
    });
    builder.addCase(fetchUserStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch user statistics';
    });

    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
})

export const { setUserState, clearError } = authSlice.actions;
export default authSlice.reducer;
