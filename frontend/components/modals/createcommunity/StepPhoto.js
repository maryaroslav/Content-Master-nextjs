import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

import addPhotoSVG from '@/public/img/modal-create-community/add-photo.svg'

const StepPhoto = ({ onValidChange, onChange, initialPhoto = null }) => {
    const [photo, setPhoto] = useState(initialPhoto);
    const fileInputRef = useRef();

    useEffect(() => {
        const valid = !!photo;
        onValidChange?.(valid);
        onChange?.({ photo });
    }, [photo]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
        }
    };

    return (
        <div>
            <div className='createcommunity-title'>
                <h1>Add a photo</h1>
                <p>Upload an image that represents your community. You can change it later.</p>
            </div>
            <div className="createcommunity-type-content">
                <div className="createcommunity-add-photo" onClick={handleClick}>
                    <Image src={addPhotoSVG} alt='Add photo' />
                </div>
            </div>

            <input
                type="file"
                accept='image/'
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {photo && (
                <div>
                    Selected: {photo.name}
                </div>
            )}
        </div>
    );
};

export default StepPhoto;