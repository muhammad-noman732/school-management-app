import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/authSlice';
import { fetchClasses, assignTeacherToClass, assignStudentToClass } from '../../redux/classSlice';

const ClassAssignment = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const { classes } = useSelector((state) => state.classes);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchClasses());
  }, [dispatch]);

  const teachers = users.filter(user => user.role === 'teacher');
  const students = users.filter(user => user.role === 'student');

  const handleAssignTeacher = async () => {
    if (selectedClass && selectedTeacher) {
      await dispatch(assignTeacherToClass({ classId: selectedClass, teacherId: selectedTeacher }));
      setSelectedTeacher('');
    }
  };

  const handleAssignStudent = async () => {
    if (selectedClass && selectedStudent) {
      await dispatch(assignStudentToClass({ classId: selectedClass, studentId: selectedStudent }));
      setSelectedStudent('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Assign Teacher to Class</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Teacher</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="input"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAssignTeacher}
            disabled={!selectedClass || !selectedTeacher}
            className="btn btn-primary"
          >
            Assign Teacher
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Assign Student to Class</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="input"
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAssignStudent}
            disabled={!selectedClass || !selectedStudent}
            className="btn btn-primary"
          >
            Assign Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassAssignment; 