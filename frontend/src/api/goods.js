const BASE_URL = 'http://localhost:3000/api/goods';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 
      'Content-Type': 'application/json' 
  };
  
  if (token) {
      headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

export async function getGoods() {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) throw new Error('Failed to fetch goods');
  return response.json();
}

export async function addGood(data) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Failed to add good');
  return response.json();
}

export async function updateGood(id, data) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Failed to update good');
  return response.json();
}

export async function deleteGood(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) throw new Error('Failed to delete good');
}