import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = ({ loading }) => {
    return (
        <div className="spinner">
            {loading && <ClipLoader color={'#e50914'} loading={loading} size={50} />}
        </div>
    );
};

export default Spinner;