import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Helper function to convert Firestore data to serializable format
const convertToSerializable = (data) => {
  if (!data) return data;
  
  const serialized = { ...data };
  
  // Convert timestamps to ISO strings
  if (data.updatedAt?.toDate) {
    serialized.updatedAt = data.updatedAt.toDate().toISOString();
  }
  if (data.createdAt?.toDate) {
    serialized.createdAt = data.createdAt.toDate().toISOString();
  }
  
  return serialized;
};

// Fetch all settings
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch institution settings
      const institutionDoc = await getDoc(doc(db, 'settings', 'institution'));
      const institutionData = convertToSerializable(institutionDoc.data()) || {};

      // Fetch departments
      const departmentsQuery = query(collection(db, 'departments'));
      const departmentsSnapshot = await getDocs(departmentsQuery);
      const departments = departmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertToSerializable(doc.data())
      }));

      // Fetch class settings
      const classSettingsDoc = await getDoc(doc(db, 'settings', 'classSettings'));
      const classSettings = convertToSerializable(classSettingsDoc.data()) || {
        maxStudentsPerClass: 30,
        defaultClassDuration: 60,
        defaultStatus: 'active'
      };

      return {
        institution: institutionData,
        departments,
        classSettings
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Update institution settings
export const updateInstitutionSettings = createAsyncThunk(
  'settings/updateInstitution',
  async ({ institutionName, logo }, { rejectWithValue }) => {
    try {
      const settingsRef = doc(db, 'settings', 'institution');
      const settingsDoc = await getDoc(settingsRef);
      
      const settingsData = {
        name: institutionName,
        updatedAt: serverTimestamp()
      };
      
      // If there's a new logo, upload it
      if (logo) {
        const storageRef = ref(storage, `institution/logo/${Date.now()}_${logo.name}`);
        await uploadBytes(storageRef, logo);
        const logoUrl = await getDownloadURL(storageRef);
        settingsData.logo = logoUrl;
      }

      // If document doesn't exist, create it with createdAt
      if (!settingsDoc.exists()) {
        await setDoc(settingsRef, {
          ...settingsData,
          createdAt: serverTimestamp()
        });
      } else {
        await updateDoc(settingsRef, settingsData);
      }

      return convertToSerializable(settingsData);
    } catch (error) {
      console.error('Error updating institution settings:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Add department
export const addDepartment = createAsyncThunk(
  'settings/addDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      console.log('Adding department with data:', departmentData);
      
      // Validate required fields
      if (!departmentData.name || !departmentData.code) {
        return rejectWithValue('Department name and code are required');
      }

      // Check if department code already exists
      const departmentsQuery = query(
        collection(db, 'departments'),
        where('code', '==', departmentData.code)
      );
      const existingDepts = await getDocs(departmentsQuery);
      
      if (!existingDepts.empty) {
        return rejectWithValue('Department code already exists');
      }

      const docRef = await addDoc(collection(db, 'departments'), {
        name: departmentData.name,
        code: departmentData.code,
        status: departmentData.status || 'active',
        description: departmentData.description || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('Department added with ID:', docRef.id);

      return {
        id: docRef.id,
        name: departmentData.name,
        code: departmentData.code,
        status: departmentData.status || 'active',
        description: departmentData.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error adding department:', error);
      return rejectWithValue(error.message || 'Failed to add department');
    }
  }
);

// Update department
export const updateDepartment = createAsyncThunk(
  'settings/updateDepartment',
  async ({ id, ...departmentData }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Department ID is required');
      }

      const departmentRef = doc(db, 'departments', id);
      const departmentDoc = await getDoc(departmentRef);

      if (!departmentDoc.exists()) {
        return rejectWithValue('Department not found');
      }

      const updatedData = {
        ...departmentData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(departmentRef, updatedData);

      return {
        id,
        ...departmentData,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating department:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Delete department
export const deleteDepartment = createAsyncThunk(
  'settings/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Department ID is required');
      }
      
      await deleteDoc(doc(db, 'departments', id));
      return id;
    } catch (error) {
      console.error('Error deleting department:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Update class settings
export const updateClassSettings = createAsyncThunk(
  'settings/updateClassSettings',
  async (classSettings, { rejectWithValue }) => {
    try {
      const settingsRef = doc(db, 'settings', 'classSettings');
      const settingsDoc = await getDoc(settingsRef);
      
      const settingsData = {
        maxStudentsPerClass: Number(classSettings.maxStudentsPerClass),
        defaultClassDuration: Number(classSettings.defaultClassDuration),
        defaultStatus: classSettings.defaultStatus,
        updatedAt: serverTimestamp()
      };

      // If document doesn't exist, create it with createdAt
      if (!settingsDoc.exists()) {
        await setDoc(settingsRef, {
          ...settingsData,
          createdAt: serverTimestamp()
        });
      } else {
        await updateDoc(settingsRef, settingsData);
      }

      return {
        ...settingsData,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating class settings:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  institution: {
    name: '',
    logo: ''
  },
  departments: [],
  classSettings: {
    maxStudentsPerClass: 30,
    defaultClassDuration: 60,
    defaultStatus: 'active'
  },
  loading: false,
  error: null,
  success: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.institution = action.payload.institution;
        state.departments = action.payload.departments;
        state.classSettings = action.payload.classSettings;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Institution Settings
      .addCase(updateInstitutionSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstitutionSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.institution = { ...state.institution, ...action.payload };
        state.success = true;
      })
      .addCase(updateInstitutionSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Department
      .addCase(addDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
        state.success = true;
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Department
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.departments.findIndex(dept => dept.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = {
            ...state.departments[index],
            ...action.payload
          };
        }
        state.success = true;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Department
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter(dept => dept.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Class Settings
      .addCase(updateClassSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClassSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.classSettings = { ...state.classSettings, ...action.payload };
        state.success = true;
      })
      .addCase(updateClassSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess } = settingsSlice.actions;
export default settingsSlice.reducer; 