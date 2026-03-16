// api/employees.js
import { BASE_OPTIONS, buildUrl } from '../utils/apiBase.js';

const BASE_URL = buildUrl('staff');

export async function getEmployees() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        ...BASE_OPTIONS
    });
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
}

export async function addEmployee(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add employee');
    }
    return response.json();
}

export async function updateEmployeeRole(id, roleID) {
    const response = await fetch(`${BASE_URL}/${id}/role`, {
        method: 'PUT',
        ...BASE_OPTIONS,
        body: JSON.stringify({ roleID })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update employee role');
    }
    return response.json();
}

export async function deleteEmployee(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        ...BASE_OPTIONS
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete employee');
    }
}

export async function getRoles() {
    const response = await fetch(`${BASE_URL}/roles`, {
        method: 'GET',
        ...BASE_OPTIONS
    });
    if (!response.ok) throw new Error('Failed to fetch roles');
    return response.json();
}