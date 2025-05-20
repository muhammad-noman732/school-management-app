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
  async (_, { rejectWithValue, dispatch }) => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const docSnap = await getDoc(doc(db, "users", user.uid));
            const dbUser = docSnap.data();
            
            // Reject if user not approved
            if (dbUser?.role === "pending") {
              return reject("Your account is not approved yet.");
            }

            dispatch(setUserState(dbUser));
            resolve(dbUser);
          } catch (err) {
            reject(rejectWithValue(err.message));
          }
        } else {
          // No user is logged in
          dispatch(setUserState(null));
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
  async ({ name, email, password, role, departmentId }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Create user document in Firestore with minimal info
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: 'pending', // Set initial role as pending
        departmentId,
        status: "waiting_approval",
        isApproved: false,
        createdAt: new Date().toISOString()
      });

      return {
        uid: user.uid,
        name,
        email,
        role: 'pending',
        departmentId,
        status: "waiting_approval",
        isApproved: false
      };
    } catch (error) {
      return rejectWithValue(error.message);
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
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("User document not found");
      }

      const userData = userDoc.data();
      
      // Check if user is approved
      if (!userData.isApproved) {
        throw new Error("Your account is pending approval");
      }

      // Check if user has a valid role
      if (userData.role === 'pending') {
        throw new Error("Your account is pending role assignment");
      }

      return {
        uid: user.uid,
        ...userData
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
      return null;
  } catch (error) {
    return rejectWithValue(error.message);
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
    }
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
      state.error = action.payload;
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
      state.error = action.payload;
    });

    // Approve User
    builder.addCase(approveUser.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(approveUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      if (state.user && state.user.uid === action.payload.userId) {
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
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.authChecked = true;
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
  }
})

export const { setUserState, clearError } = authSlice.actions;
export default authSlice.reducer;
