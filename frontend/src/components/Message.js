import React from 'react'
import { Alert } from 'react-bootstrap'

function Message({type, children}) {
  return (
    <Alert variant={type} className='text-center'>
      {children}
    </Alert>
  )
}

export default Message