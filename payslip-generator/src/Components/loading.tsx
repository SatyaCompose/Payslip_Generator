import React from 'react';
import '../Styles/loading.css'; // Optional: for custom styles

const Loading: React.FC = () => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p style={{fontSize: 25}}>Sending Email Email in Progress...</p>
        </div>
    );
};

export default Loading;