import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Async thunks
export const createAssignment = createAsyncThunk(
  'assignments/create',
  async ({ classId, teacherId, title, description, dueDate, totalMarks }) => {
    try {
      const assignmentData = {
        classId,
        teacherId,
        title,
        description,
        dueDate,
        totalMarks,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'assignments'), assignmentData);
      return { id: docRef.id, ...assignmentData };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchAssignments = createAsyncThunk(
  'assignments/fetch',
  async ({ classId, role, userId }) => {
    try {
      let q;
      if (role === 'teacher') {
        q = query(
          collection(db, 'assignments'),
          where('classId', '==', classId),
          where('teacherId', '==', userId)
        );
      } else {
        q = query(
          collection(db, 'assignments'),
          where('classId', '==', classId)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/delete',
  async (assignmentId) => {
    try {
      await deleteDoc(doc(db, 'assignments', assignmentId));
      return assignmentId;
    } catch (error) {
      throw error;
    }
  }
);

export const submitAssignment = createAsyncThunk(
  'assignments/submit',
  async ({ assignmentId, studentId, submission }) => {
    try {
      const assignmentRef = doc(db, 'assignments', assignmentId);
      const assignment = await getDocs(assignmentRef);
      const submissions = assignment.data().submissions || [];
      
      // Check if student has already submitted
      const existingSubmission = submissions.find(sub => sub.studentId === studentId);
      if (existingSubmission) {
        throw new Error('You have already submitted this assignment');
      }

      const newSubmission = {
        studentId,
        submission,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };

      await updateDoc(assignmentRef, {
        submissions: [...submissions, newSubmission]
      });

      return { assignmentId, submission: newSubmission };
    } catch (error) {
      throw error;
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearAssignments: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Assignment
      .addCase(createAssignment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch Assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Delete Assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Submit Assignment
      .addCase(submitAssignment.fulfilled, (state, action) => {
        const assignment = state.items.find(item => item.id === action.payload.assignmentId);
        if (assignment) {
          assignment.submissions.push(action.payload.submission);
        }
      });
  }
});

export const { clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer; 