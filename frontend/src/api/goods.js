const BASE_URL = 'http://localhost:3000/api/goods';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getGoods() {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!response.ok) throw new Error('Failed to fetch goods');
  return response.json();
}

export async function addGood(data) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Failed to add good');
  return response.json();
}

export async function updateGood(id, data) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
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