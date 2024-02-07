import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Reserve() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);


  const [showListingError, setShowListingError] = useState(false);
  
  const handleShowList = async () => {
    try{
      setShowListingError(false);
      const res = await fetch(`/users/list/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingError(true);
        return;
      }

    }catch(error){
      setShowListingError(true);
    }
  }

  return (
    <div>
      <button onClick={handleShowList}
        style={{ color: 'green' }}
      >
        รายการจองหอพัก
      </button>
      <p style={{color: 'red'}}>{showListingError ? 'Error show listing' : ''}</p>
    </div>
  )
}

export default Reserve