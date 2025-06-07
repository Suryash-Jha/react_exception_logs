import React, { useState, useEffect } from 'react';
import axios from 'axios';

const methods = ['', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const statusCodes = ['', '200', '201', '400', '401', '403', '404', '500', '503'];

const ExceptionLogsTable = () => {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);

    const [filters, setFilters] = useState({
        search: '',
        statusCode: '',
        method: '',
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
    });

    const [sort, setSort] = useState({
        sortBy: 'timestamp',
        sortOrder: 'DESC',
    });

    const fetchData = async () => {
        try {
            const params = {
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
                sortBy: sort.sortBy,
                sortOrder: sort.sortOrder,
            };

            Object.keys(params).forEach(
                (key) => params[key] === '' && delete params[key],
            );

            const response = await axios.get('https://jira-backend-7e3x.onrender.com/api/exception-logs', { params });

            setLogs(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Failed to fetch exception logs:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters, pagination.page, pagination.limit, sort]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleSort = (field) => {
        setSort((prev) => {
            if (prev.sortBy === field) {
                return { sortBy: field, sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC' };
            } else {
                return { sortBy: field, sortOrder: 'ASC' };
            }
        });
    };

    const totalPages = Math.ceil(total / pagination.limit);

    return (
        <div
            style={{
                padding: '20px',
                fontFamily: "'Roboto', sans-serif",
                background: 'linear-gradient(45deg, #FF6F61, #FFB74D)',
                minHeight: '100vh',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
            }}
        >
            <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '20px' }}>Exception Logs</h2>

            <div style={{ marginBottom: 16, display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    placeholder="Search text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #FF6F61',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        flex: '1',
                    }}
                />

                <select
                    name="statusCode"
                    value={filters.statusCode}
                    onChange={handleFilterChange}
                    style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #FF6F61',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        flex: '1',
                    }}
                >
                    {statusCodes.map((code) => (
                        <option key={code} value={code}>
                            {code === '' ? 'All Status Codes' : code}
                        </option>
                    ))}
                </select>

                <select
                    name="method"
                    value={filters.method}
                    onChange={handleFilterChange}
                    style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #FF6F61',
                        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                        flex: '1',
                    }}
                >
                    {methods.map((m) => (
                        <option key={m} value={m}>
                            {m === '' ? 'All Methods' : m}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '12px', backgroundColor: '#fff' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}
                >
                    <thead>
                        <tr style={{ background: '#D84315', color: '#fff' }}>
                            {[
                                'Timestamp',
                                'Status Code',
                                'IP',
                                'Authorization',
                                'Path',
                                'Method',
                                'Payload',
                                'Message',
                                'Count',
                                'Stack Trace',
                                'Controller',
                                'Handler',
                            ].map((header, index) => (
                                <th
                                    key={index}
                                    onClick={() =>
                                        header === 'Timestamp' || header === 'Status Code'
                                            ? handleSort(header.toLowerCase().replace(' ', ''))
                                            : null
                                    }
                                    style={{
                                        padding: '12px',
                                        cursor: header === 'Timestamp' || header === 'Status Code' ? 'pointer' : 'default',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan="12" style={{ textAlign: 'center', padding: '16px', color: '#555' }}>
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr
                                    key={log.id}
                                    style={{
                                        background: '#FFEBEE',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.background = '#FFCDD2')}
                                    onMouseOut={(e) => (e.currentTarget.style.background = '#FFEBEE')}
                                >
                                    <td style={{ padding: '12px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{log.statusCode}</td>
                                    <td style={{ padding: '12px' }}>{log.ip}</td>
                                    <td style={{ padding: '12px' }}>{log.authorization}</td>
                                    <td style={{ padding: '12px' }}>{log.path}</td>
                                    <td style={{ padding: '12px' }}>{log.method}</td>
                                    <td style={{ padding: '8px', borderRadius: '4px' }}>
                                        <div
                                            style={{
                                                maxHeight: '80px', // Set the desired height
                                                overflowY: 'auto',
                                                whiteSpace: 'pre-wrap', // Handle line breaks
                                            }}
                                        >
                                            {JSON.stringify(log.payload)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{log.message}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{log.count}</td>
                                    <td style={{ padding: '8px',  borderRadius: '4px' }}>
                                        <div
                                            style={{
                                                maxHeight: '80px', // Set the desired height
                                                overflowY: 'auto',
                                                whiteSpace: 'pre-wrap', // Handle line breaks
                                            }}
                                        >
                                            {JSON.stringify(log.stack)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px' }}>{log.controllerName}</td>
                                    <td style={{ padding: '12px' }}>{log.handlerName}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExceptionLogsTable;
