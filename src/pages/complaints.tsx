interface Complaint {
    id: number;
    description: string;
    status: 'pending' | 'resolved' | 'rejected';
  }

import { useEffect, useState } from 'react';
import axios from 'axios';

const Complaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get<Complaint[]>('http://localhost:3000/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const addComplaint = async () => {
    try {
      await axios.post('http://localhost:3000/complaints', { description });
      setDescription('');
      fetchComplaints();
    } catch (error) {
      console.error('Error adding complaint:', error);
    }
  };

  const changeStatus = async (id: number, status: 'pending' | 'resolved' | 'rejected') => {
    try {
      await axios.patch(`http://localhost:3000/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  return (
    <div>
      <h1>Complaints</h1>
      <div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter complaint description"
        />
        <button onClick={addComplaint}>Add Complaint</button>
      </div>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id}>
            {complaint.description} - {complaint.status}
            <button onClick={() => changeStatus(complaint.id, 'resolved')}>Resolve</button>
            <button onClick={() => changeStatus(complaint.id, 'rejected')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Complaints;
