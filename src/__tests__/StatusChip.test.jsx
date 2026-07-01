import React from 'react'
import { render, screen } from '@testing-library/react'
import StatusChip from '../components/common/StatusChip'

describe('StatusChip', () => {
  it('renders pending status', () => {
    render(<StatusChip status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders approved status', () => {
    render(<StatusChip status="approved" />)
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('renders rejected status', () => {
    render(<StatusChip status="rejected" />)
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })

  it('renders high risk', () => {
    render(<StatusChip status="high" />)
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders expired status', () => {
    render(<StatusChip status="expired" />)
    expect(screen.getByText('Expired')).toBeInTheDocument()
  })

  it('renders unknown status with raw value', () => {
    render(<StatusChip status="custom_status" />)
    expect(screen.getByText('custom_status')).toBeInTheDocument()
  })
})
