import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const TableSkeleton = ({ rows = 8, columns = 6 }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="px-6 py-3">
                                    <Skeleton variant="text" width={80} height={24} animation="wave" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4">
                                        <Skeleton variant="text" width="100%" height={24} animation="wave" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableSkeleton;
