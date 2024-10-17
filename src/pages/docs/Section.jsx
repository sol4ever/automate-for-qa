import React from 'react';
import './section.css';

export default function Section({ title, children }) {
    return (
        <div className="section">
            <h2 className="section-title">{title}</h2>
            <div className="section-content">{children}</div>
        </div>
    );
}
