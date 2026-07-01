import React from 'react'
import { render, screen } from '@testing-library/react'
import KpiCard from '../components/common/KpiCard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

describe('KpiCard', () => {
  it('renders title and value', () => {
    render(<KpiCard title="Total Requests" value={42} icon={<ShoppingCartIcon />} />)
    expect(screen.getByText('Total Requests')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<KpiCard title="Vendors" value={10} subtitle="8 active" icon={<ShoppingCartIcon />} />)
    expect(screen.getByText('8 active')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(<KpiCard title="Risks" value={5} icon={<ShoppingCartIcon />} />)
    expect(screen.queryByText('undefined')).not.toBeInTheDocument()
  })

  it('renders trend indicator when provided', () => {
    render(<KpiCard title="Spend" value="$1M" icon={<ShoppingCartIcon />} trend="up" trendValue="+12%" />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })
})
