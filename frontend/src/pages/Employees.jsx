import { useEffect, useState } from 'react';
import NavigateTo from '../utils/navBtn.jsx';
import { 
    getEmployees, 
    addEmployee, 
    updateEmployeeRole, 
    deleteEmployee, 
    getRoles 
} from '../api/staff.js';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [newEmployee, setNewEmployee] = useState({
        username: '',
        email: '',
        password: '',
        roleID: 1
    });
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [employeesData, rolesData] = await Promise.all([
                    getEmployees(),
                    getRoles()
                ]);
                setEmployees(employeesData);
                setRoles(rolesData);
                setError(null);
            } catch (err) {
                console.error('Error loading employees:', err);
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: name === 'roleID' ? Number(value) : value
        }));
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        if (!newEmployee.username || !newEmployee.email || !newEmployee.password) {
            alert('All fields are required');
            return;
        }
        if (newEmployee.password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        try {
            const created = await addEmployee(newEmployee);
            setEmployees(prev => [created, ...prev]);
            setNewEmployee({ username: '', email: '', password: '', roleID: 1 });
            setIsFormOpen(false);
            console.log('Employee added:', created.username);
        } catch (err) {
            console.error('Error adding employee:', err);
            alert(err.message || 'Failed to add employee');
        }
    };

    const handleRoleChange = async (employeeId, newRoleID) => {
        try {
            const updated = await updateEmployeeRole(employeeId, Number(newRoleID));
            setEmployees(prev => 
                prev.map(emp => emp.id === employeeId ? updated : emp)
            );
            console.log('Role updated for employee:', employeeId);
        } catch (err) {
            console.error('Error updating role:', err);
            alert(err.message || 'Failed to update role');
        }
    };

    const handleDelete = async (employeeId) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;
        
        try {
            await deleteEmployee(employeeId);
            setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
            console.log('Employee deleted:', employeeId);
        } catch (err) {
            console.error('Error deleting employee:', err);
            alert(err.message || 'Failed to delete employee');
        }
    };

    const admins = employees.filter(emp => emp.roleID === 3);
    const staff = employees.filter(emp => emp.roleID !== 3);

    if (loading) return <div className="loading">Loading employees...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <section className="employees">
            <div className="container">
                <div className="head">
                    <NavigateTo path="store" />
                    <div className="controllers">
                        {/* <NavigateTo path="profile" /> */}
                        <button 
                            className="" 
                            onClick={() => setIsFormOpen(!isFormOpen)}
                        >
                            {isFormOpen ? 'Cancel' : '+ Add Employee'}
                        </button>
                    </div>
                </div>

                <div className="head addStaffBtn">
                    {/* <h2>Staff Management</h2> */}

                    {isFormOpen && (
                    <form className="form formStaff" onSubmit={handleAddEmployee}>
                        <h3>New Employee</h3>
                        <input
                            type="text"
                            name="username"
                            value={newEmployee.username}
                            onChange={handleInputChange}
                            placeholder="Full name"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={newEmployee.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={newEmployee.password}
                            onChange={handleInputChange}
                            placeholder="Password (min 6 chars)"
                            required
                            minLength={6}
                        />
                        <select
                            name="roleID"
                            value={newEmployee.roleID}
                            onChange={handleInputChange}
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn-submit">Create</button>
                    </form>
                )}
                </div>

                

                <section className="containerStart">
                <div className="section">
                    <h3>Administrators</h3>
                    <div className="containerColumn">
                        {admins.length === 0 ? (
                            <p className="status">No administrators</p>
                        ) : (
                            admins.map(employee => (
                                <div className="card admin-card" key={employee.id}>
                                    <div className="block">
                                        <h4>Name: {employee.username}</h4>
                                        <p className="email">Email: {employee.email}</p>
                                        <p className="created">
                                            Joined: {new Date(employee.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="controls">
                                            <select
                                                value={employee.roleID}
                                                disabled
                                                className="admin-select"
                                            >
                                                <option>Administrator</option>
                                            </select>
                                            <span className="admin-badge">Admin</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Секция: Сотрудники */}
                <div className="section">
                    <h3>Employees</h3>
                    <div className="containerColumn">
                        {staff.length === 0 ? (
                            <p className="status">No employees</p>
                        ) : (
                            staff.map(employee => (
                                <div className="card staff-card" key={employee.id}>
                                    <div className="block">
                                        <h4>Name: {employee.username}</h4>
                                        <p className="email">Email: {employee.email}</p>
                                        <p className="created">
                                            Joined: {new Date(employee.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="controls">
                                            <select
                                                value={employee.roleID}
                                                onChange={(e) => handleRoleChange(employee.id, e.target.value)}
                                            >
                                                {roles.filter(r => r.id !== 3).map(role => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(employee.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                </section>

            </div>
        </section>
    );
}