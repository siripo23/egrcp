import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { hideSnackbar } from '../../store/slices/uiSlice'

function GlobalSnackbar() {
  const dispatch = useDispatch()
  const { open, message, severity } = useSelector(state => state.ui.snackbar)
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={() => dispatch(hideSnackbar())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={() => dispatch(hideSnackbar())} severity={severity} variant="filled" elevation={6}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default GlobalSnackbar
