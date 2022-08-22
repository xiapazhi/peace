import React from 'react';
import './style.less';
import CustomChart from '../generic-chart';
function StorageCapacity(props) {
    const { data, struct, factorId, selectSensorId, factorName } = props

    return (
        <div>
            <div className='btn-container'>
                <div className='btn-item blue'>库容：</div>
                <div className='btn-item blue'>实时水位：</div>
            </div>
            <CustomChart {...props} />
        </div>
    );
}

export default StorageCapacity;