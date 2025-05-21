import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

// Async thunks
export const createAnnouncement = createAsyncThunk(
  'announcements/create',
  async ({ classId, teacherId, text }) => {
    try {
      const announcementData = {
        classId,
        teacherId,
        text,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'announcements'), announcementData);
      return { id: docRef.id, ...announcementData };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetch',
  async ({ classId, role, userId }) => {
    try {
      let q;
      if (role === 'teacher') {
        q = query(
          collection(db, 'announcements'),
          where('classId', '==', classId),
          where('teacherId', '==', userId)
        );
      } else {
        q = query(
          collection(db, 'announcements'),
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

export const deleteAnnouncement = createAsyncThunk(
  'announcements/delete',
  async (announcementId) => {
    try {
      await deleteDoc(doc(db, 'announcements', announcementId));
      return announcementId;
    } catch (error) {
      throw error;
    }
  }
);

const announcementSlice = createSlice({
  name: 'announcements',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearAnnouncements: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Announcement
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export const { clearAnnouncements } = announcementSlice.actions;
export default announcementSlice.reducer; 