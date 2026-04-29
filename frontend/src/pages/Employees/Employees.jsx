import { useState } from 'react';
import { useStaff } from '../../hooks/useStaff';
import { useNavigate } from 'react-router-dom';
import styles from './Employees.module.css';

export default function Employees() {
    const navigate = useNavigate();
    const { 
        employees, roles, loading, error, 
        addStaff, updateRole, removeStaff 
    } = useStaff();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        username: '', email: '', password: '', roleID: 1
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: name === 'roleID' ? Number(value) : value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await addStaff(newEmployee);
            setNewEmployee({ username: '', email: '', password: '', roleID: 1 });
            setIsFormOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const onRoleChange = async (id, roleID) => {
        try {
            await updateRole(id, roleID);
        } catch (err) {
            alert(err.message);
        }
    };

    const onDelete = async (id) => {
        if (!confirm('Удалить сотрудника?')) return;
        try {
            await removeStaff(id);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className={styles.loader}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    const admins = employees.filter(emp => emp.roleID === 3);
    const staff = employees.filter(emp => emp.roleID !== 3);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.navGroup}>
                        <button className='btn' onClick={() => navigate('/store')}>Главная</button>
                        <span className={styles.breadcrumb}>/ Персонал</span>
                    </div>
                    <button 
                        className={isFormOpen ? styles.btnCancel : styles.btnAdd} 
                        onClick={() => setIsFormOpen(!isFormOpen)}
                    >
                        {isFormOpen ? 'Отмена' : '+ Новый сотрудник'}
                    </button>
                </div>
            </header>

            <main className={styles.container}>
                {isFormOpen && (
                    <section className={styles.formSection}>
                        <form className={styles.addForm} onSubmit={onSubmit}>
                            <h2>Регистрация</h2>
                            <div className={styles.formGrid}>
                                <input name="username" value={newEmployee.username} onChange={handleInputChange} placeholder="ФИО" required />
                                <input name="email" type="email" value={newEmployee.email} onChange={handleInputChange} placeholder="Email" required />
                                <input name="password" type="password" value={newEmployee.password} onChange={handleInputChange} placeholder="Пароль" required minLength={6} />
                                <select name="roleID" value={newEmployee.roleID} onChange={handleInputChange}>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <button type="submit" className={styles.btnSubmit}>Создать</button>
                        </form>
                    </section>
                )}

                <div className={styles.layout}>
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Админы ({admins.length})</h3>
                        <div className={styles.grid}>
                            {admins.map(emp => (
                                <div key={emp.id} className={`${styles.card} ${styles.adminCard}`}>
                                    <div className={styles.cardHeader}>
                                        <h4>{emp.username}</h4>
                                        <span className={styles.badge}>Admin</span>
                                    </div>
                                    <p className={styles.email}>{emp.email}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Персонал ({staff.length})</h3>
                        <div className={styles.grid}>
                            {staff.map(emp => (
                                <div key={emp.id} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h4>{emp.username}</h4>
                                        <button className={styles.btnDelete} onClick={() => onDelete(emp.id)}>Удалить</button>
                                    </div>
                                    <p className={styles.email}>{emp.email}</p>
                                    <div className={styles.cardFooter}>
                                        <select 
                                            value={emp.roleID} 
                                            onChange={(e) => onRoleChange(emp.id, e.target.value)}
                                            className={styles.roleSelect}
                                        >
                                            {roles.filter(r => r.id !== 3).map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}