import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/staff.js';

export const useStaff = () => {
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [empData, rolesData] = await Promise.all([
                api.getEmployees(),
                api.getRoles()
            ]);
            setEmployees(empData);
            setRoles(rolesData);
            setError(null);
        } catch (err) {
            setError(err.message || 'Ошибка загрузки персонала');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addStaff = async (payload) => {
        const created = await api.addEmployee(payload);
        setEmployees(prev => [created, ...prev]);
        return created;
    };

    const updateRole = async (id, roleID) => {
        const updated = await api.updateEmployeeRole(id, Number(roleID));
        setEmployees(prev => 
            prev.map(emp => emp.id === id ? updated : emp)
        );
        return updated;
    };

    const removeStaff = async (id) => {
        await api.deleteEmployee(id);
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    return {
        employees,
        roles,
        loading,
        error,
        addStaff,
        updateRole,
        removeStaff,
        refresh: fetchData
    };
};