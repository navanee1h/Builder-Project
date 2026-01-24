import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const DashboardSkeleton = () => {
    return (
        <div>
            {/* Header Skeleton */}
            <div className="mb-8">
                <Skeleton variant="text" width={200} height={40} animation="wave" />
                <Skeleton variant="text" width={150} height={20} animation="wave" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <Skeleton variant="text" width={100} height={24} className="mb-2" animation="wave" />
                            <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} animation="wave" />
                        </div>
                        <Skeleton variant="circular" width={48} height={48} animation="wave" />
                    </div>
                ))}
            </div>

            {/* Bottom Section Skeleton */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <Skeleton variant="text" width={250} height={32} className="mb-4" animation="wave" />
                <div className="flex flex-wrap gap-4">
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} animation="wave" />
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} animation="wave" />
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} animation="wave" />
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
