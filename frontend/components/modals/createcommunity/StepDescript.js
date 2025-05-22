import React, { useEffect, useState } from 'react';

const StepDescription = ({ onValidChange, onChange, initialDes = '' }) => {
    const [description, setDescription] = useState(initialDes);

    useEffect(() => {
        const valid = description.length > 0 && description.length <= 350;
        onValidChange?.(valid);
        onChange?.({ description })
    }, [description])

    return (
        <div>
            <div className='createcommunity-title'>
                <h1>Choose a description</h1>
                <p>Provide a brief description of your community. This can be updated later.</p>
            </div>
            <div className="createcommunity-type-content">
                <form action="" onSubmit={(e) => e.preventDefault()}>
                    <div className='type-content-name-counter'>
                        <label htmlFor="">Description</label>
                        <p>{description.length}/350</p>
                    </div>
                    <textarea
                        className='createcommunity-type-content-textarea'
                        type="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={350}
                    />
                </form>
            </div>
        </div>
    );
};

export default StepDescription;