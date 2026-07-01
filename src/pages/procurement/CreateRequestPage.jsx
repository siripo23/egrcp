import React from 'react'
import { Box, Card, CardContent, TextField, Button, Grid, MenuItem, Typography, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createRequest } from '../../store/slices/procurementSlice'
import { showSnackbar } from '../../store/slices/uiSlice'
import SectionHeader from '../../components/common/SectionHeader'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import vendorsData from '../../mocks/vendors.json'

const schema = yup.object({
  title: yup.string().required('Title is required').min(5, 'Min 5 characters'),
  description: yup.string().required('Description is required').min(10),
  department: yup.string().required('Department is required'),
  vendorId: yup.string().required('Vendor is required'),
  amount: yup.number().typeError('Must be a number').positive('Must be positive').required('Amount is required'),
  priority: yup.string().required('Priority is required'),
  category: yup.string().required('Category is required'),
  dueDate: yup.string().required('Due date is required'),
})

const departments = ['IT', 'Engineering', 'Finance', 'Marketing', 'Operations', 'Facilities', 'HR', 'Legal']
const priorities = ['high', 'medium', 'low']
const categories = ['IT Equipment', 'Technology', 'Facilities', 'Services', 'Marketing', 'Equipment', 'Office Supplies']

function CreateRequestPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)
  const { loading } = useSelector(state => state.procurement)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { priority: 'medium' }
  })

  const onSubmit = async (data) => {
    const vendor = vendorsData.find(v => v.id === data.vendorId)
    const result = await dispatch(createRequest({
      ...data,
      amount: Number(data.amount),
      vendor: vendor?.name || '',
      requestedBy: user?.name,
      requestedById: user?.id,
    }))
    if (!result.error) {
      dispatch(showSnackbar({ message: 'Request created successfully!', severity: 'success' }))
      navigate('/procurement')
    }
  }

  return (
    <Box>
      <Box mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/procurement')} size="small">Back to Procurement</Button>
      </Box>
      <SectionHeader title="Create New Request" subtitle="Submit a new procurement request for approval" />
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField fullWidth label="Request Title *" {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Description *" {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Department *" defaultValue="" {...register('department')} error={!!errors.department} helperText={errors.department?.message}>
                  {departments.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Vendor *" defaultValue="" {...register('vendorId')} error={!!errors.vendorId} helperText={errors.vendorId?.message}>
                  {vendorsData.filter(v => v.status === 'active').map(v => <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth label="Amount (USD) *" type="number" {...register('amount')} error={!!errors.amount} helperText={errors.amount?.message} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField select fullWidth label="Priority *" defaultValue="medium" {...register('priority')} error={!!errors.priority} helperText={errors.priority?.message}>
                  {priorities.map(p => <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField select fullWidth label="Category *" defaultValue="" {...register('category')} error={!!errors.category} helperText={errors.category?.message}>
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth label="Due Date *" type="date" {...register('dueDate')} error={!!errors.dueDate} helperText={errors.dueDate?.message} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate('/procurement')}>Cancel</Button>
                  <Button variant="contained" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CreateRequestPage
