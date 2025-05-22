import React, { useEffect, useState } from 'react';

const StepName = ({ onValidChange, onChange, initialName = '', initialPrivacy = 'public' }) => {
    const [name, setName] = useState(initialName);
    const [privacy, setPrivacy] = useState(initialPrivacy);

    useEffect(() => {
        const valid = name.trim().length > 0 && name.length <= 48;
        onValidChange?.(valid);
        onChange?.({ name, privacy });
    }, [name, privacy]);
    return (
        <div>
            <div className='createcommunity-title'>
                <h1>Choose a name</h1>
                <p>Use words that reflect the idea of your community. You can change the name later.</p>
            </div>
            <div className="createcommunity-type-content">
                <form action="" onSubmit={(e) => e.preventDefault()}>
                    <div className='type-content-name-counter'>
                        <label htmlFor="">Community name</label>
                        <p>{name.length}/48</p>
                    </div>
                    <input
                        type="text"
                        placeholder='Enter a name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={48}
                    />
                    <label htmlFor="">Community privacy</label>
                    <select name="" id="" value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                        <option value="public">Public</option>
                        <option value="private">Privat</option>
                    </select>
                </form>
            </div>
        </div>
    );
}

export default StepName;