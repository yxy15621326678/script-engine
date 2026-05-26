import React from 'react';

/** 最大化图标（四角向外展开） */
export const MaximizeIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    {/* 左上角 */}
    <path d="M4 9V4h5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* 右上角 */}
    <path d="M20 9V4h-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* 左下角 */}
    <path d="M4 15v5h5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* 右下角 */}
    <path d="M20 15v5h-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 最小化图标（四角向内收缩） */
export const MinimizeIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    {/* 左上角 */}
    <path d="M9 4v5H4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* 右上角 */}
    <path d="M15 4v5h5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* 左下角 */}
    <path d="M9 20v-5H4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* 右下角 */}
    <path d="M15 20v-5h5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
